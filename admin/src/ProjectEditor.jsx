import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PROJECT_FIELDS, validateProject } from '@/lib/content/projectSchema';
import { api } from './api';
import MediaPanel from './MediaPanel';
import LinksPanel from './LinksPanel';

const STORED_EXTRAS = ['slug', 'overview', 'mediaFiles', 'errors'];
const strip = (p) => Object.fromEntries(Object.entries(p).filter(([k]) => !STORED_EXTRAS.includes(k)));

export default function ProjectEditor({ project, allProjects, act, notify, onRenamed, onDeleted }) {
  const [draft, setDraft] = useState(() => strip(project));
  const [overview, setOverview] = useState(project.overview || '');
  const [tab, setTab] = useState('details');

  // Pick up external changes (media uploads, other saves) when nothing is being edited
  const saved = useMemo(() => JSON.stringify(strip(project)), [project]);
  const dirty = JSON.stringify(draft) !== saved;
  const overviewDirty = overview !== (project.overview || '');
  useEffect(() => { if (!dirty) setDraft(strip(project)); }, [saved]); // eslint-disable-line react-hooks/exhaustive-deps

  const errors = validateProject(draft);
  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async (next = draft) => {
    await act(async () => {
      await api.saveProject(project.slug, next);
      if (overviewDirty) await api.saveOverview(project.slug, overview);
    }, 'Saved');
    setDraft(next);
  };

  // Ctrl/Cmd+S saves
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const suggestions = useMemo(() => ({
    categories: [...new Set(allProjects.map((p) => p.category).filter(Boolean))],
    tech: [...new Set(allProjects.flatMap((p) => p.tech || []))],
  }), [allProjects]);

  return (
    <div className="editor">
      <header className="editor-header">
        <div>
          <h1>{draft.title || 'Untitled'}</h1>
          <div className="muted small">
            content/projects/{project.slug}/ {draft.draft && <span className="tag">draft — not published</span>}
          </div>
        </div>
        <div className="row">
          <a className="btn" href={`/?project=${project.slug}`} target="_blank" rel="noreferrer">View on site ↗</a>
          <button className="btn btn-primary" disabled={!dirty && !overviewDirty} onClick={() => save()}>
            {dirty || overviewDirty ? 'Save (Ctrl+S)' : 'Saved'}
          </button>
        </div>
      </header>

      {errors.length > 0 && (
        <div className="notice notice-error">
          <b>Needs attention before release:</b>
          <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <nav className="tabs">
        {[['details', 'Details'], ['media', `Media (${draft.media?.length || 0})`], ['links', `Links (${draft.links?.length || 0})`], ['overview', 'Overview'], ['advanced', 'Advanced']].map(([id, label]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>

      {tab === 'details' && (
        <div className="form-grid">
          {PROJECT_FIELDS.map((f) => (
            <Field key={f.key} field={f} value={draft[f.key]} onChange={(v) => set(f.key, v)} suggestions={suggestions[f.suggest]} />
          ))}
        </div>
      )}

      {tab === 'media' && (
        <MediaPanel project={project} draft={draft} onChange={save} act={act} notify={notify} />
      )}

      {tab === 'links' && <LinksPanel links={draft.links || []} onChange={(links) => set('links', links)} />}

      {tab === 'overview' && (
        <div className="overview-editor">
          <div>
            <label className="label">overview.md <span className="muted">— Markdown. Reference uploaded images as <code>![alt](media/file.png)</code>. Leave empty to show the long description instead.</span></label>
            <textarea className="input mono" value={overview} onChange={(e) => setOverview(e.target.value)} rows={28} />
          </div>
          <div className="markdown-preview">
            <label className="label">Preview</label>
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
        <div className="stack">
          <section className="card">
            <h3>Folder name (URL slug)</h3>
            <p className="muted">Currently <code>{project.slug}</code>. Renaming moves the folder; media URLs follow automatically.</p>
            <button className="btn" onClick={async () => {
              const to = prompt('New folder name', project.slug);
              if (!to || to === project.slug) return;
              const { slug } = await act(() => api.renameProject(project.slug, to), 'Renamed');
              onRenamed(slug);
            }}>Rename…</button>
          </section>
          <section className="card card-danger">
            <h3>Delete project</h3>
            <p className="muted">Moves the whole folder to <code>.trash/</code> (not committed). Recover it from there or from git.</p>
            <button className="btn btn-danger" onClick={async () => {
              if (!confirm(`Move "${draft.title}" to .trash/?`)) return;
              await act(() => api.deleteProject(project.slug), 'Moved to .trash/');
              onDeleted();
            }}>Delete…</button>
          </section>
        </div>
      )}
    </div>
  );
}

function Field({ field, value, onChange, suggestions }) {
  const id = `f-${field.key}`;
  const label = (
    <label className="label" htmlFor={id}>
      {field.label}{field.required && ' *'} {field.hint && <span className="muted">— {field.hint}</span>}
    </label>
  );
  switch (field.kind) {
    case 'textarea':
      return <div className="field field-wide">{label}<textarea id={id} className="input" rows={field.key === 'description' ? 2 : 5} value={value || ''} onChange={(e) => onChange(e.target.value)} /></div>;
    case 'number':
      return <div className="field">{label}<input id={id} className="input" type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} /></div>;
    case 'boolean':
      return (
        <div className="field">
          <label className="switch">
            <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
            <span>{field.label}</span>
          </label>
          {field.hint && <div className="muted small">{field.hint}</div>}
        </div>
      );
    case 'list':
      return <div className="field field-wide">{label}<ChipInput id={id} value={value || []} onChange={onChange} suggestions={suggestions} /></div>;
    default:
      return (
        <div className="field">
          {label}
          <input id={id} className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} list={suggestions ? `${id}-list` : undefined} />
          {suggestions && <datalist id={`${id}-list`}>{suggestions.map((s) => <option key={s} value={s} />)}</datalist>}
        </div>
      );
  }
}

/** Edit an array of strings: Enter or comma adds, × removes, drag-free reordering via ↑. */
function ChipInput({ id, value, onChange, suggestions }) {
  const [text, setText] = useState('');
  const add = () => {
    const items = text.split(',').map((s) => s.trim()).filter(Boolean).filter((s) => !value.includes(s));
    if (items.length) onChange([...value, ...items]);
    setText('');
  };
  return (
    <div className="chips">
      {value.map((v, i) => (
        <span key={v + i} className="chip">
          {i > 0 && <button className="chip-btn" title="Move left" onClick={() => { const n = [...value]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}>‹</button>}
          {v}
          <button className="chip-btn" title="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>×</button>
        </span>
      ))}
      <input
        id={id}
        className="chip-input"
        value={text}
        placeholder="type and press Enter"
        list={suggestions ? `${id}-list` : undefined}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
          if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
      />
      {suggestions && <datalist id={`${id}-list`}>{suggestions.map((s) => <option key={s} value={s} />)}</datalist>}
    </div>
  );
}
