import { useEffect, useRef, useState } from 'react';
import { api, followJob } from './api';

/**
 * Release flow: Test (local production build) → Stage (optional staging site) → Go live.
 * Stage and Go live stay locked until the current content has passed Test.
 */
export default function ReleasePanel({ state, act, reload }) {
  const { git, release, projects } = state;
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState('');
  const logRef = useRef(null);
  const running = job?.status === 'running';
  const drafts = projects.filter((p) => p.draft);
  const invalid = projects.filter((p) => !p.draft && p.errors.length);
  const tested = release?.upToDate;

  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [job?.log]);

  const start = async (fn, confirmText) => {
    if (confirmText && !confirm(confirmText)) return;
    try {
      const { job: id } = await act(fn);
      await followJob(id, setJob);
    } finally {
      reload();
    }
  };

  const commitMessage = message.trim() || defaultMessage(git);

  return (
    <div className="editor">
      <header className="editor-header">
        <div>
          <h1>Release</h1>
          <div className="muted small">branch <code>{git.branch}</code> · {git.contentChanges} content change(s) not yet committed</div>
        </div>
      </header>

      {invalid.length > 0 && (
        <div className="notice notice-error">
          <b>Fix before release:</b>
          <ul>{invalid.map((p) => <li key={p.slug}>{p.title}: {p.errors.join('; ')}</li>)}</ul>
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
        <li className={`step ${tested ? 'done' : ''}`}>
          <div className="step-head">
            <span className="step-num">1</span>
            <div>
              <h3>Test</h3>
              <p className="muted">Builds the production site exactly as it will be published and serves it at <code>localhost:4173</code>. Click through it on this machine (or use the browser's device mode).</p>
            </div>
          </div>
          <div className="row">
            <button className="btn btn-primary" disabled={running || invalid.length > 0} onClick={() => start(api.test)}>Build & test</button>
            {release?.previewRunning && <a className="btn" href={release.url} target="_blank" rel="noreferrer">Open test site ↗</a>}
            {release?.previewRunning && <button className="btn" onClick={() => act(api.stopTest)}>Stop test server</button>}
            {release?.testedFingerprint && !tested && <span className="tag tag-error">content changed since last test</span>}
            {tested && <span className="tag tag-ok">✓ tested {new Date(release.testedAt).toLocaleTimeString()}</span>}
          </div>
        </li>

        <li className="step">
          <div className="step-head">
            <span className="step-num">2</span>
            <div>
              <h3>Stage <span className="muted small">(optional)</span></h3>
              <p className="muted">Commits <code>content/</code> and pushes it to the <code>staging</code> branch; CI deploys it to your staging site so you can check it on real phones and browsers. Setup: docs/release.md.</p>
            </div>
          </div>
          <button className="btn" disabled={running || !tested} onClick={() => start(() => api.stage(commitMessage))}>Push to staging</button>
        </li>

        <li className="step">
          <div className="step-head">
            <span className="step-num">3</span>
            <div>
              <h3>Go live</h3>
              <p className="muted">Commits <code>content/</code>, pushes <code>master</code>, and GitHub Actions deploys the public site.</p>
            </div>
          </div>
          <label className="label">Commit message</label>
          <input className="input" placeholder={defaultMessage(git)} value={message} onChange={(e) => setMessage(e.target.value)} />
          <div className="row">
            <button
              className="btn btn-danger"
              disabled={running || !tested}
              onClick={() => start(() => api.publish(commitMessage), `Publish to the live site?\n\n"${commitMessage}"`)}
            >
              Go live
            </button>
            {!tested && <span className="muted small">Locked until Test passes for the current content.</span>}
            {git.actionsUrl && <a href={git.actionsUrl} target="_blank" rel="noreferrer" className="small">GitHub Actions ↗</a>}
          </div>
        </li>
      </ol>

      {job && (
        <section className="card">
          <h3>
            {job.kind} — {job.status === 'running' ? 'running…' : job.status === 'done' ? '✅ done' : '❌ failed'}
          </h3>
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

const defaultMessage = (git) => {
  const slugs = [...new Set((git.changes || []).map((c) => c.file.match(/^content\/projects\/([^/]+)\//)?.[1]).filter(Boolean))];
  if (slugs.length === 1) return `Update ${slugs[0]}`;
  if (slugs.length > 1) return `Update ${slugs.length} projects`;
  return 'Update portfolio content';
};
