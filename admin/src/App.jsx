import { useCallback, useEffect, useRef, useState } from 'react';
import { slugify } from '@/lib/content/projectSchema';
import { api } from './api';
import { DirtyContext, Toasts, useDialog, useToasts } from './ui';
import ProjectEditor from './ProjectEditor';
import ThemeEditor from './ThemeEditor';
import SiteEditor from './SiteEditor';
import SiteMap from './SiteMap';
import ReleasePanel from './ReleasePanel';

/** The current page lives in the URL hash so a reload keeps your place. */
const readHash = () => {
  const [kind, slug] = decodeURIComponent(window.location.hash.replace(/^#\/?/, '')).split('/');
  if (kind === 'site') return { kind, file: slug || undefined };
  return ['sitemap', 'theme', 'release'].includes(kind) ? { kind } : { kind: 'project', slug: kind === 'project' ? slug || null : null };
};
const writeHash = (view) => {
  const hash = view.kind === 'project'
    ? (view.slug ? `#/project/${encodeURIComponent(view.slug)}` : '')
    : `#/${view.kind}${view.file ? `/${view.file}` : ''}`;
  window.history.replaceState(null, '', hash || window.location.pathname);
};

/**
 * Portfolio admin — runs only on the local dev server (npm run admin).
 * Every save writes straight into content/, and the site in the other tab
 * reloads with it. Nothing reaches the internet until Release → Go live.
 */
export default function App() {
  const [state, setState] = useState(null);
  const [view, setView] = useState(readHash);
  const [error, setError] = useState(null);
  const [dirtyKeys, setDirtyKeys] = useState(() => new Set());
  const { toasts, notify, dismiss } = useToasts();
  const dialog = useDialog();

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

  const setDirty = useCallback((key, dirty) => {
    setDirtyKeys((prev) => {
      if (prev.has(key) === dirty) return prev;
      const next = new Set(prev);
      if (dirty) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  // Closing the tab with unsaved edits asks first
  const hasDirty = dirtyKeys.size > 0;
  useEffect(() => {
    if (!hasDirty) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasDirty]);

  /** Switch page; unsaved edits on the current one must be discarded explicitly. */
  const go = useCallback(async (next) => {
    if (hasDirty) {
      const ok = await dialog.confirm({
        title: 'Discard unsaved changes?',
        body: 'You have edits on this page that are not saved yet. Leaving drops them.',
        confirmLabel: 'Discard and leave',
        danger: true,
      });
      if (!ok) return;
    }
    setView(next);
  }, [hasDirty, dialog]);

  const projects = state?.projects || [];
  const current = view.kind === 'project' ? projects.find((p) => p.slug === view.slug) || projects[0] : null;
  const shownView = current ? { kind: 'project', slug: current.slug } : view;
  useEffect(() => { writeHash(shownView); }, [shownView.kind, shownView.slug, shownView.file]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error && !state) {
    return (
      <div className="boot">
        <div className="boot-card">
          <h1>Admin API unreachable</h1>
          <p className="muted">{error}</p>
          <p>Start the editor with <code>npm run admin</code>, then reload this page.</p>
          <button className="btn btn-primary" onClick={reload}>Try again</button>
        </div>
      </div>
    );
  }
  if (!state) return <div className="boot"><div className="spinner" aria-label="Loading" /></div>;

  const createProject = async () => {
    const title = await dialog.prompt({
      title: 'New project',
      label: 'Project title',
      placeholder: 'e.g. Space Miner',
      confirmLabel: 'Create draft',
      describe: (v) => `Creates content/projects/${slugify(v)}/ as a draft — it stays off the live site until you untick Draft.`,
    });
    if (!title) return;
    const { slug } = await act(() => api.createProject(title), 'Project created as a draft');
    setView({ kind: 'project', slug });
  };

  return (
    <DirtyContext.Provider value={setDirty}>
      <div className="admin">
        <Sidebar
          projects={projects}
          view={shownView}
          dirty={hasDirty}
          release={state.release}
          git={state.git}
          onSelect={go}
          onCreate={createProject}
          onReorder={(slugs) => act(() => api.saveOrder(slugs), 'Order saved')}
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
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h2>No projects yet</h2>
              <p className="muted">Each project is a folder in <code>content/projects/</code> with its details, media and links.</p>
              <button className="btn btn-primary" onClick={createProject}>+ New project</button>
            </div>
          )}
          {view.kind === 'theme' && <ThemeEditor theme={state.theme} act={act} />}
          {view.kind === 'sitemap' && (
            <SiteMap
              layout={state.layout}
              act={act}
              onOpenFile={(file) => go({ kind: 'site', file })}
              onOpenProjects={() => go({ kind: 'project', slug: null })}
            />
          )}
          {view.kind === 'site' && <SiteEditor key={view.file} site={state.site} act={act} initialFile={view.file} />}
          {view.kind === 'release' && <ReleasePanel state={state} act={act} reload={reload} onOpenProject={(slug) => go({ kind: 'project', slug })} />}
        </main>
        <Toasts toasts={toasts} dismiss={dismiss} />
      </div>
    </DirtyContext.Provider>
  );
}

function Sidebar({ projects, view, dirty, release, git, onSelect, onCreate, onReorder }) {
  const [query, setQuery] = useState('');
  const [dragging, setDragging] = useState(null);
  const [dropAt, setDropAt] = useState(null);
  const listRef = useRef(null);

  const q = query.trim().toLowerCase();
  const shown = q
    ? projects.filter((p) => [p.title, p.slug, p.category, ...(p.tech || [])].some((s) => s && String(s).toLowerCase().includes(q)))
    : projects;
  const canReorder = !q;

  const moveTo = (slug, index) => {
    const slugs = projects.map((p) => p.slug);
    const from = slugs.indexOf(slug);
    if (from < 0) return;
    slugs.splice(from, 1);
    slugs.splice(index > from ? index - 1 : index, 0, slug);
    if (slugs.join() !== projects.map((p) => p.slug).join()) onReorder(slugs);
  };

  const drop = () => {
    if (dragging && dropAt !== null) moveTo(dragging, dropAt);
    setDragging(null);
    setDropAt(null);
  };

  const pending = git?.contentChanges || 0;
  const navItem = (kind, icon, label, extra) => (
    <button
      className={`nav-item ${view.kind === kind ? 'active' : ''}`}
      aria-current={view.kind === kind ? 'page' : undefined}
      onClick={() => onSelect({ kind })}
    >
      <span className="nav-icon" aria-hidden>{icon}</span>
      <span className="nav-label">{label}</span>
      {view.kind === kind && dirty && <span className="dirty-dot" title="Unsaved changes" />}
      {extra}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="brand">
        <span>Portfolio Admin</span>
        <a href="/" target="_blank" rel="noreferrer" className="muted small">Open site ↗</a>
      </div>

      <div className="nav-group nav-group-projects">
        <div className="nav-heading">
          <span>Projects <span className="count">{projects.length}</span></span>
          <button className="btn btn-small btn-primary" onClick={onCreate}>+ New</button>
        </div>
        {projects.length > 4 && (
          <div className="search">
            <input
              className="input input-small"
              type="search"
              placeholder="Filter by title, tech…"
              aria-label="Filter projects"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
            />
          </div>
        )}
        <ul
          className="project-list"
          ref={listRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={drop}
          aria-label="Projects (Alt+↑/↓ to reorder)"
        >
          {shown.map((p) => {
            const index = projects.indexOf(p);
            const active = view.kind === 'project' && view.slug === p.slug;
            return (
              <li
                key={p.slug}
                draggable={canReorder}
                onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragging(p.slug); }}
                onDragEnd={() => { setDragging(null); setDropAt(null); }}
                onDragOver={(e) => {
                  if (!dragging) return;
                  e.preventDefault();
                  const r = e.currentTarget.getBoundingClientRect();
                  setDropAt(e.clientY < r.top + r.height / 2 ? index : index + 1);
                }}
                className={[
                  dragging === p.slug && 'dragging',
                  dragging && dropAt === index && 'drop-before',
                  dragging && dropAt === index + 1 && index === projects.length - 1 && 'drop-after',
                ].filter(Boolean).join(' ')}
              >
                <button
                  className={`project-item ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => onSelect({ kind: 'project', slug: p.slug })}
                  onKeyDown={(e) => {
                    if (!canReorder || !e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
                    e.preventDefault();
                    const to = e.key === 'ArrowUp' ? index - 1 : index + 2;
                    if (to >= 0 && to <= projects.length) moveTo(p.slug, to);
                    requestAnimationFrame(() => listRef.current?.querySelector(`[data-slug="${p.slug}"]`)?.focus());
                  }}
                  data-slug={p.slug}
                  title={canReorder ? 'Drag (or Alt+↑/↓) to reorder' : undefined}
                >
                  {canReorder && <span className="grip" aria-hidden>⋮⋮</span>}
                  <span className="project-name">{p.title || p.slug}</span>
                  {active && dirty && <span className="dirty-dot" title="Unsaved changes" />}
                  {p.errors.length > 0 && <span className="badge badge-error" title={p.errors.join('\n')}>{p.errors.length}</span>}
                  {p.featured && <span className="badge badge-gold" title="Featured">★</span>}
                  {p.draft && <span className="badge" title="Draft — not published">Draft</span>}
                </button>
              </li>
            );
          })}
          {shown.length === 0 && <li className="muted small list-empty">No project matches “{query}”.</li>}
        </ul>
      </div>

      <nav className="nav-group" aria-label="Site">
        <div className="nav-heading"><span>Site</span></div>
        {navItem('sitemap', '🗺️', 'Site map')}
        {navItem('theme', '🎨', 'Theme')}
        {navItem('site', '🧾', 'Site content')}
        {navItem('release', '🚀', 'Release',
          release?.upToDate
            ? <span className="badge badge-ok" title="Current content passed Test">Tested</span>
            : pending > 0 && <span className="badge badge-gold" title={`${pending} uncommitted change(s) in content/`}>{pending}</span>,
        )}
      </nav>
    </aside>
  );
}
