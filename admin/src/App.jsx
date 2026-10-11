import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import ProjectEditor from './ProjectEditor';
import ThemeEditor from './ThemeEditor';
import SiteEditor from './SiteEditor';
import ReleasePanel from './ReleasePanel';

/**
 * Portfolio admin — runs only on the local dev server (npm run admin).
 * Every save writes straight into content/, and the site in the other tab
 * reloads with it. Nothing reaches the internet until Release → Go live.
 */
export default function App() {
  const [state, setState] = useState(null);
  const [view, setView] = useState({ kind: 'project', slug: null });
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const reload = useCallback(async () => {
    try {
      const s = await api.state();
      setState(s);
      setError(null);
      return s;
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // Content edited outside the admin (editor, git checkout…) → refresh, keeping unsaved form edits
  useEffect(() => {
    import.meta.hot?.on('portfolio:content-changed', reload);
    return () => import.meta.hot?.off?.('portfolio:content-changed', reload);
  }, [reload]);

  const notify = useCallback((text, kind = 'ok') => {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 2600);
  }, []);

  // Wrap an API call: report failures, refresh state afterwards
  const act = useCallback(async (fn, okText) => {
    try {
      const out = await fn();
      if (okText) notify(okText);
      await reload();
      return out;
    } catch (e) {
      notify(e.message, 'error');
      throw e;
    }
  }, [notify, reload]);

  if (error && !state) return <div className="boot-error">Admin API unreachable: {error}<br />Start it with <code>npm run admin</code>.</div>;
  if (!state) return <div className="boot">Loading…</div>;

  const projects = state.projects;
  const current = view.kind === 'project' ? projects.find((p) => p.slug === view.slug) || projects[0] : null;

  return (
    <div className="admin">
      <Sidebar
        projects={projects}
        view={view}
        currentSlug={current?.slug}
        release={state.release}
        git={state.git}
        onSelect={setView}
        onCreate={async () => {
          const title = prompt('Project title');
          if (!title?.trim()) return;
          const { slug } = await act(() => api.createProject(title.trim()), 'Project created as a draft');
          setView({ kind: 'project', slug });
        }}
        onReorder={(slugs) => act(() => api.saveOrder(slugs))}
      />
      <main className="admin-main">
        {view.kind === 'project' && current && (
          <ProjectEditor
            key={current.slug}
            project={current}
            allProjects={projects}
            act={act}
            notify={notify}
            onRenamed={(slug) => setView({ kind: 'project', slug })}
            onDeleted={() => setView({ kind: 'project', slug: null })}
          />
        )}
        {view.kind === 'project' && !current && (
          <div className="empty">No projects yet — use <b>+ New project</b>.</div>
        )}
        {view.kind === 'theme' && <ThemeEditor theme={state.theme} act={act} />}
        {view.kind === 'site' && <SiteEditor site={state.site} act={act} />}
        {view.kind === 'release' && <ReleasePanel state={state} act={act} reload={reload} />}
      </main>
      {toast && <div className={`toast toast-${toast.kind}`}>{toast.text}</div>}
    </div>
  );
}

function Sidebar({ projects, view, currentSlug, release, git, onSelect, onCreate, onReorder }) {
  const [dragging, setDragging] = useState(null);

  const drop = (targetSlug) => {
    if (!dragging || dragging === targetSlug) return;
    const slugs = projects.map((p) => p.slug).filter((s) => s !== dragging);
    slugs.splice(slugs.indexOf(targetSlug), 0, dragging);
    onReorder(slugs);
    setDragging(null);
  };

  const pending = git?.contentChanges || 0;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span>Portfolio Admin</span>
        <a href="/" target="_blank" rel="noreferrer" className="muted small">open site ↗</a>
      </div>

      <div className="nav-group">
        <div className="nav-heading">
          Projects <button className="btn btn-small" onClick={onCreate}>+ New project</button>
        </div>
        <ul className="project-list">
          {projects.map((p) => (
            <li
              key={p.slug}
              draggable
              onDragStart={() => setDragging(p.slug)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(p.slug)}
              className={`${view.kind === 'project' && currentSlug === p.slug ? 'active' : ''} ${dragging === p.slug ? 'dragging' : ''}`}
              onClick={() => onSelect({ kind: 'project', slug: p.slug })}
              title="Drag to reorder"
            >
              <span className="grip">⋮⋮</span>
              <span className="project-name">{p.title}</span>
              {p.draft && <span className="tag">draft</span>}
              {p.featured && <span className="tag tag-gold">★</span>}
              {p.errors.length > 0 && <span className="tag tag-error" title={p.errors.join('\n')}>!</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-group">
        <button className={`nav-item ${view.kind === 'theme' ? 'active' : ''}`} onClick={() => onSelect({ kind: 'theme' })}>🎨 Theme</button>
        <button className={`nav-item ${view.kind === 'site' ? 'active' : ''}`} onClick={() => onSelect({ kind: 'site' })}>🧾 Site content</button>
        <button className={`nav-item ${view.kind === 'release' ? 'active' : ''}`} onClick={() => onSelect({ kind: 'release' })}>
          🚀 Release
          {pending > 0 && <span className="tag tag-gold">{pending} unpublished</span>}
          {release?.upToDate && <span className="tag tag-ok">tested</span>}
        </button>
      </div>
    </aside>
  );
}
