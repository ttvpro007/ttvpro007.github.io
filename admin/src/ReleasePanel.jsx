import { useEffect, useRef, useState } from 'react';
import { api, followJob } from './api';
import { useDialog } from './ui';

const STATUS = {
  done: { label: 'Done', cls: 'badge-ok', icon: '✓' },
  ready: { label: 'Ready', cls: 'badge-gold' },
  stale: { label: 'Re-run needed', cls: 'badge-error' },
  blocked: { label: 'Blocked', cls: 'badge-error', icon: '!' },
  locked: { label: 'Locked', cls: '', icon: '🔒' },
  running: { label: 'Running…', cls: 'badge-gold' },
  optional: { label: 'Optional', cls: '' },
};

/**
 * Release flow: Test (local production build) → Stage (optional staging site) → Go live.
 * Stage and Go live stay locked until the current content has passed Test.
 */
export default function ReleasePanel({ state, act, reload, onOpenProject }) {
  const { git, release, projects } = state;
  const dialog = useDialog();
  const [job, setJob] = useState(null);
  const [finished, setFinished] = useState({}); // kind → tested fingerprint it ran against
  const [message, setMessage] = useState('');
  const logRef = useRef(null);
  const running = job?.status === 'running';
  const drafts = projects.filter((p) => p.draft);
  const live = projects.filter((p) => !p.draft);
  const invalid = live.filter((p) => p.errors.length);
  const tested = release?.upToDate;
  const fingerprint = release?.testedFingerprint;

  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [job?.log]);

  const start = async (kind, fn) => {
    try {
      const { job: id } = await act(fn);
      const result = await followJob(id, setJob);
      if (result.status === 'done') setFinished((f) => ({ ...f, [kind]: fingerprint }));
    } finally {
      reload();
    }
  };

  const commitMessage = message.trim() || defaultMessage(git);
  const runningKind = running ? job.kind : null;

  const status = {
    test: runningKind === 'test' ? 'running' : invalid.length ? 'blocked' : tested ? 'done' : fingerprint ? 'stale' : 'ready',
    stage: runningKind === 'stage' ? 'running' : !tested ? 'locked' : finished.stage === fingerprint ? 'done' : 'optional',
    publish: runningKind === 'publish' ? 'running' : !tested ? 'locked' : finished.publish === fingerprint ? 'done' : 'ready',
  };
  const steps = [['test', 'Test'], ['stage', 'Stage'], ['publish', 'Go live']];

  const goLive = async () => {
    const ok = await dialog.confirm({
      title: 'Publish to the live site?',
      body: (
        <>
          Commits <code>content/</code> as <b>“{commitMessage}”</b>, pushes <code>master</code>, and GitHub Actions deploys
          the public site. {live.length} project(s) ship; {drafts.length} draft(s) stay out.
        </>
      ),
      confirmLabel: 'Go live',
      danger: true,
    });
    if (ok) start('publish', () => api.publish(commitMessage));
  };

  return (
    <div className="editor release">
      <header className="editor-header">
        <div className="editor-title">
          <h1>Release</h1>
          <div className="muted small">
            Branch <code>{git.branch}</code> · {git.contentChanges
              ? `${git.contentChanges} content change(s) not yet committed`
              : 'content/ matches the last commit'}
          </div>
        </div>
      </header>

      <ol className="stepper" aria-label="Release progress">
        {steps.map(([id, label], i) => (
          <li key={id} className={`stepper-item is-${status[id]}`}>
            <span className="stepper-dot">{STATUS[status[id]].icon || i + 1}</span>
            <span>
              <b>{label}</b>
              <span className="muted small">{STATUS[status[id]].label}</span>
            </span>
          </li>
        ))}
      </ol>

      <section className="summary-grid">
        <div className="stat"><b>{live.length}</b><span className="muted small">project(s) will ship</span></div>
        <div className="stat"><b>{drafts.length}</b><span className="muted small">draft(s) left out</span></div>
        <div className={`stat ${invalid.length ? 'stat-bad' : ''}`}><b>{invalid.length}</b><span className="muted small">need fixes</span></div>
        <div className="stat"><b>{git.contentChanges}</b><span className="muted small">uncommitted content change(s)</span></div>
      </section>

      {invalid.length > 0 && (
        <div className="notice notice-error">
          <b>Fix before release:</b>
          <ul>{invalid.map((p) => <li key={p.slug}><button className="link-btn" onClick={() => onOpenProject(p.slug)}>{p.title}</button>: {p.errors.join('; ')}</li>)}</ul>
        </div>
      )}
      {drafts.length > 0 && (
        <div className="notice">Drafts are left out of releases: {drafts.map((p) => p.title).join(', ')}.</div>
      )}
      {git.otherChanges > 0 && (
        <div className="notice">
          {git.otherChanges} uncommitted change(s) outside <code>content/</code> (code, styles…). Test includes them, but Stage and
          Go live only commit <code>content/</code> — commit code changes yourself first so what you test is what ships.
        </div>
      )}

      <ol className="steps">
        <Step n={1} status={status.test} title="Test" text={<>Builds the production site exactly as it will be published and serves it at <code>localhost:4173</code>. Click through it on this machine (or use the browser's device mode).</>}>
          <div className="row">
            <button className="btn btn-primary" disabled={running || invalid.length > 0} onClick={() => start('test', api.test)}>
              {fingerprint ? 'Build & test again' : 'Build & test'}
            </button>
            {release?.previewRunning && <a className="btn" href={release.url} target="_blank" rel="noreferrer">Open test site ↗</a>}
            {release?.previewRunning && <button className="btn" onClick={() => act(api.stopTest, 'Test server stopped')}>Stop test server</button>}
            {status.test === 'stale' && <span className="field-error small">Content changed since the last test.</span>}
            {tested && <span className="muted small">Passed at {new Date(release.testedAt).toLocaleTimeString()}</span>}
            {invalid.length > 0 && <span className="field-error small">Fix the problems above first.</span>}
          </div>
        </Step>

        <Step n={2} status={status.stage} title={<>Stage <span className="muted small">(optional)</span></>} text={<>Commits <code>content/</code> and pushes it to the <code>staging</code> branch; CI deploys it to your staging site so you can check it on real phones and browsers. Setup: docs/release.md.</>}>
          <div className="row">
            <button className="btn" disabled={running || !tested} onClick={() => start('stage', () => api.stage(commitMessage))}>Push to staging</button>
            {!tested && <span className="muted small">Unlocks once Test passes for the current content.</span>}
          </div>
        </Step>

        <Step n={3} status={status.publish} title="Go live" text={<>Commits <code>content/</code>, pushes <code>master</code>, and GitHub Actions deploys the public site.</>}>
          <div className="field">
            <label className="label" htmlFor="commit-msg">Commit message</label>
            <input id="commit-msg" className="input" placeholder={defaultMessage(git)} value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="field-hint">Used for Stage and Go live. Leave empty for “{defaultMessage(git)}”.</div>
          </div>
          <div className="row">
            <button className="btn btn-danger-solid" disabled={running || !tested} onClick={goLive}>Go live…</button>
            {!tested && <span className="muted small">Unlocks once Test passes for the current content.</span>}
            {git.actionsUrl && <a href={git.actionsUrl} target="_blank" rel="noreferrer" className="small">GitHub Actions ↗</a>}
          </div>
        </Step>
      </ol>

      {job && (
        <section className="card job">
          <div className="job-head">
            <h3>{humanKind(job.kind)}</h3>
            <span className={`badge ${job.status === 'done' ? 'badge-ok' : job.status === 'running' ? 'badge-gold' : 'badge-error'}`}>
              {job.status === 'running' ? <><span className="spinner spinner-small" aria-hidden /> Running</> : job.status === 'done' ? 'Done' : 'Failed'}
            </span>
            {!running && <button className="btn btn-small" onClick={() => setJob(null)}>Clear</button>}
          </div>
          <pre className="log" ref={logRef}>{job.log}</pre>
        </section>
      )}

      {git.changes.length > 0 && (
        <details className="card">
          <summary>Working tree changes ({git.changes.length})</summary>
          <pre className="log small">{git.changes.map((c) => `${c.code.padEnd(2)} ${c.file}`).join('\n')}</pre>
        </details>
      )}
    </div>
  );
}

function Step({ n, status, title, text, children }) {
  const s = STATUS[status];
  return (
    <li className={`step is-${status}`}>
      <div className="step-head">
        <span className="step-num">{status === 'done' ? '✓' : n}</span>
        <div className="step-text">
          <div className="row">
            <h3>{title}</h3>
            <span className={`badge ${s.cls}`}>{s.label}</span>
          </div>
          <p className="muted">{text}</p>
        </div>
      </div>
      <div className="step-body">{children}</div>
    </li>
  );
}

const humanKind = (kind) => ({ test: 'Test build', stage: 'Push to staging', publish: 'Go live' }[kind] || kind);

const defaultMessage = (git) => {
  const slugs = [...new Set((git.changes || []).map((c) => c.file.match(/^content\/projects\/([^/]+)\//)?.[1]).filter(Boolean))];
  if (slugs.length === 1) return `Update ${slugs[0]}`;
  if (slugs.length > 1) return `Update ${slugs.length} projects`;
  return 'Update portfolio content';
};
