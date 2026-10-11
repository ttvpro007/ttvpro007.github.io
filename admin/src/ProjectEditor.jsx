import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PROJECT_FIELDS, validateProject, slugify } from '@/lib/content/projectSchema';
import { api, mediaUrl } from './api';
import { ChipInput, SaveBar, useDialog, useDirty, useSaveShortcut } from './ui';
import MediaPanel from './MediaPanel';
import LinksPanel from './LinksPanel';

const STORED_EXTRAS = ['slug', 'overview', 'mediaFiles', 'errors'];
const strip = (p) => Object.fromEntries(Object.entries(p).filter(([k]) => !STORED_EXTRAS.includes(k)));
const isEmpty = (v) => v === undefined || v === '' || v === null;
const isUrl = (s) => /^(https?:\/\/|mailto:)\S+$/i.test(s || '');

/** Per-field problems shown inline (the schema's validateProject covers the rest). */
const fieldErrors = (draft) => {
  const out = {};
  for (const f of PROJECT_FIELDS) if (f.required && isEmpty(draft[f.key])) out[f.key] = `${f.label} is required`;
  if (draft.year && (draft.year < 1990 || draft.year > new Date().getFullYear() + 2)) out.year = 'That year looks off';
  return out;
};
const linkErrors = (links = []) => links.map((l) => (!l.url ? 'Add a URL' : !isUrl(l.url) ? 'Use a full URL starting with https://' : null));

export default function ProjectEditor({ project, allProjects, act, notify, onRenamed, onDeleted }) {
  const dialog = useDialog();
  const [draft, setDraft] = useState(() => strip(project));
  const [overview, setOverview] = useState(project.overview || '');
  const [tab, setTab] = useState('details');
  const [saving, setSaving] = useState(false);

  // Pick up external changes (media uploads, other saves) when nothing is being edited
  const saved = useMemo(() => JSON.stringify(strip(project)), [project]);
  const [seen, setSeen] = useState(saved);
  const dirtyDetails = JSON.stringify(draft) !== saved;
  if (seen !== saved) {
    setSeen(saved);
    if (JSON.stringify(draft) === seen) setDraft(strip(project));
  }
  const overviewDirty = overview !== (project.overview || '');
  const dirty = dirtyDetails || overviewDirty;
  useDirty(`project:${project.slug}`, dirty);

  const errors = fieldErrors(draft);
  const lErrors = linkErrors(draft.links);
  const otherErrors = validateProject(draft).filter((e) => !/is required$|^Link #/.test(e));
  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async (next = draft) => {
    setSaving(true);
    try {
      await act(async () => {
        await api.saveProject(project.slug, next);
        if (overviewDirty) await api.saveOverview(project.slug, overview);
      }, 'Saved');
      setDraft(next);
    } finally {
      setSaving(false);
    }
  };
  const discard = () => { setDraft(strip(project)); setOverview(project.overview || ''); };
  useSaveShortcut(() => save(), dirty && !saving);

  const suggestions = useMemo(() => ({
    categories: [...new Set(allProjects.map((p) => p.category).filter(Boolean))],
    tech: [...new Set(allProjects.flatMap((p) => p.tech || []))].sort(),
  }), [allProjects]);

  const tabs = [
    ['details', 'Details', Object.keys(errors).length],
    ['media', 'Media', draft.media?.length || 0, otherErrors.length],
    ['links', 'Links', draft.links?.length || 0, lErrors.filter(Boolean).length],
    ['overview', 'Overview', overviewDirty ? '●' : null],
    ['advanced', 'Advanced'],
  ];

  const rename = async () => {
    if (dirty) return notify('Save or discard your changes before renaming the folder', 'error');
    const taken = new Set(allProjects.map((p) => p.slug).filter((s) => s !== project.slug));
    const to = await dialog.prompt({
      title: 'Rename folder',
      label: 'Folder name (URL slug)',
      initial: project.slug,
      confirmLabel: 'Rename',
      validate: (v) => (slugify(v) === project.slug ? 'That is the current name' : taken.has(slugify(v)) ? `“${slugify(v)}” already exists` : null),
      describe: (v) => `Becomes content/projects/${slugify(v)}/ — media URLs follow automatically.`,
    });
    if (!to) return;
    const { slug } = await act(() => api.renameProject(project.slug, to), 'Renamed');
    onRenamed(slug);
  };

  const remove = async () => {
    const ok = await dialog.confirm({
      title: `Delete “${draft.title || project.slug}”?`,
      body: <>The folder moves to <code>.trash/</code> (not committed). You can restore it from there or from git.</>,
      confirmLabel: 'Move to .trash/',
      danger: true,
    });
    if (!ok) return;
    await act(() => api.deleteProject(project.slug), 'Moved to .trash/');
    onDeleted();
  };

  return (
    <div className="editor">
      <header className="editor-header">
        <div className="editor-title">
          <h1>{draft.title || 'Untitled project'}</h1>
          <div className="row small">
            <code className="muted">content/projects/{project.slug}/</code>
            {draft.draft && <span className="badge" title="Left out of published builds">Draft</span>}
            {draft.featured && <span className="badge badge-gold">★ Featured</span>}
          </div>
        </div>
        <div className="row">
          <a className="btn" href={`/?project=${project.slug}`} target="_blank" rel="noreferrer">View on site ↗</a>
          <SaveBar dirty={dirty} saving={saving} onSave={() => save()} onDiscard={discard} />
        </div>
      </header>

      <nav className="tabs" role="tablist">
        {tabs.map(([id, label, count, problems = id === 'details' ? count : 0]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {label}
            {id !== 'details' && count ? <span className="tab-count">{count}</span> : null}
            {problems > 0 && <span className="badge badge-error" title="Needs attention before release">{problems}</span>}
          </button>
        ))}
      </nav>

      {tab === 'details' && (
        <div className="details-layout">
          <div className="form-grid">
            {PROJECT_FIELDS.map((f) => (
              <Field key={f.key} field={f} value={draft[f.key]} error={errors[f.key]} onChange={(v) => set(f.key, v)} suggestions={suggestions[f.suggest]} />
            ))}
          </div>
          <aside className="card-preview-wrap">
            <div className="label">Card preview</div>
            <CardPreview project={draft} slug={project.slug} />
            <p className="muted small">Roughly how the card reads on the Projects page. Pick the cover in Media.</p>
          </aside>
        </div>
      )}

      {tab === 'media' && (
        <>
          {otherErrors.length > 0 && (
            <div className="notice notice-error">
              <b>Needs attention before release:</b>
              <ul>{otherErrors.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          )}
          <MediaPanel project={project} draft={draft} onChange={save} act={act} notify={notify} />
        </>
      )}

      {tab === 'links' && <LinksPanel links={draft.links || []} errors={lErrors} onChange={(links) => set('links', links)} />}

      {tab === 'overview' && (
        <div className="overview-editor">
          <div className="field">
            <label className="label" htmlFor="overview-md">overview.md</label>
            <div className="field-hint">Markdown. Reference uploaded images as <code>![alt](media/file.png)</code>. Leave empty to show the long description instead.</div>
            <textarea id="overview-md" className="input mono" value={overview} onChange={(e) => setOverview(e.target.value)} rows={28} spellCheck />
          </div>
          <div className="markdown-preview">
            <div className="label">Preview</div>
            <div className="preview-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                urlTransform={(u) => u.replace(/^(\.\/)?media\//, `/projects/${project.slug}/`)}
              >
                {overview || '*No overview — the long description is shown instead.*'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {tab === 'advanced' && (
        <div className="stack narrow">
          <section className="card">
            <h3>Folder name (URL slug)</h3>
            <p className="muted">Currently <code>{project.slug}</code>. Renaming moves the folder; media URLs follow automatically.</p>
            <button className="btn" onClick={rename}>Rename…</button>
          </section>
          <section className="card card-danger">
            <h3>Delete project</h3>
            <p className="muted">Moves the whole folder to <code>.trash/</code> (not committed). Recover it from there or from git.</p>
            <button className="btn btn-danger" onClick={remove}>Delete…</button>
          </section>
        </div>
      )}
    </div>
  );
}

function CardPreview({ project, slug }) {
  const media = project.media || [];
  const cover = project.cover || media.find((m) => m.type === 'image')?.src;
  const tech = project.tech || [];
  return (
    <article className="card-preview">
      <div className="card-preview-img">
        {cover ? <img src={mediaUrl(slug, cover)} alt="" /> : <span className="muted small">No cover image</span>}
        {project.featured && <span className="badge badge-gold card-preview-flag">★ Featured</span>}
      </div>
      <div className="card-preview-body">
        <div className="muted small">{[project.category || 'No category', project.year].filter(Boolean).join(' · ')}</div>
        <h4>{project.title || 'Untitled project'}</h4>
        <p className={project.description ? '' : 'muted'}>{project.description || 'Add a short description — it is the first thing visitors read.'}</p>
        {tech.length > 0 && (
          <div className="row">
            {tech.slice(0, 5).map((t) => <span key={t} className="tag">{t}</span>)}
            {tech.length > 5 && <span className="muted small">+{tech.length - 5}</span>}
          </div>
        )}
      </div>
    </article>
  );
}

function Field({ field, value, error, onChange, suggestions }) {
  const id = `f-${field.key}`;
  const hintId = `${id}-hint`;
  const aria = { 'aria-invalid': !!error, 'aria-describedby': hintId };
  const cls = `input ${error ? 'input-invalid' : ''}`;
  const label = (
    <label className="label" htmlFor={id}>
      {field.label}{field.required && <span className="req" aria-label="required"> *</span>}
    </label>
  );
  const hint = (error || field.hint) && <div id={hintId} className={`field-hint ${error ? 'field-error' : ''}`}>{error || field.hint}</div>;

  switch (field.kind) {
    case 'textarea': {
      const short = field.key === 'description';
      const len = (value || '').length;
      return (
        <div className="field field-wide">
          {label}
          <textarea id={id} className={cls} {...aria} rows={short ? 2 : 5} value={value || ''} onChange={(e) => onChange(e.target.value)} />
          <div className="field-foot">
            {hint || <span />}
            {short && <span className={`small ${len > 220 ? 'field-error' : 'muted'}`}>{len}/220</span>}
          </div>
        </div>
      );
    }
    case 'number':
      return <div className="field">{label}<input id={id} className={cls} {...aria} type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />{hint}</div>;
    case 'boolean':
      return (
        <div className="field field-switch">
          <label className="switch">
            <input id={id} type="checkbox" role="switch" checked={!!value} onChange={(e) => onChange(e.target.checked)} aria-describedby={hintId} />
            <span className="switch-track" aria-hidden />
            <span>{field.label}</span>
          </label>
          {hint}
        </div>
      );
    case 'list':
      return <div className="field field-wide">{label}<ChipInput id={id} value={value || []} onChange={onChange} suggestions={suggestions} />{hint}</div>;
    default:
      return (
        <div className="field">
          {label}
          <input id={id} className={cls} {...aria} value={value || ''} onChange={(e) => onChange(e.target.value)} list={suggestions ? `${id}-list` : undefined} />
          {suggestions && <datalist id={`${id}-list`}>{suggestions.map((s) => <option key={s} value={s} />)}</datalist>}
          {hint}
        </div>
      );
  }
}
