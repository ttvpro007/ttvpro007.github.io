import { useRef, useState } from 'react';
import { SECTION_TYPES, sectionOptions } from '@/lib/content/sectionTypes';
import {
  ID_PATTERN, sortedPages, validateLayout, addPage, removePage, updatePage, movePage,
  addSection, removeSection, moveSection, updateSection, uniqueId,
} from '@/lib/content/siteLayout';
import { slugify } from '@/lib/content/projectSchema';
import { api } from './api';
import { SaveBar, useDialog, useDirty, useSaveShortcut } from './ui';

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const SITE_FILE = /^site\/(\w+)\.json$/;

/**
 * Site map — content/site/layout.json as pages → sections → the content each section reads.
 * Drag (or Alt+↑/↓) pages and sections to reorder, toggle them, add sections from the
 * registry (src/lib/content/sectionTypes.js) and edit their options. Saved as one file.
 */
export default function SiteMap({ layout, act, onOpenFile, onOpenProjects }) {
  const dialog = useDialog();
  const [draft, setDraft] = useState(layout);
  const [base, setBase] = useState(layout);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(() => new Set());
  const [drag, setDrag] = useState(null); // { kind: 'page', id } | { kind: 'section', pageId, index }
  const [dropAt, setDropAt] = useState(null); // page index | { pageId, index }
  const listRef = useRef(null);

  // Adopt outside edits (CLI, editor) when there is nothing unsaved here
  if (base !== layout) {
    setBase(layout);
    if (same(draft, base)) setDraft(layout);
  }

  const dirty = !same(draft, layout);
  const errors = validateLayout(draft);
  useDirty('sitemap', dirty);

  const save = async () => {
    setSaving(true);
    try { await act(() => api.saveLayout(draft), 'Site map saved'); } finally { setSaving(false); }
  };
  useSaveShortcut(save, dirty && !saving && !errors.length);

  /** Apply a siteLayout.js edit to the draft; a bad reference is reported, not thrown. */
  const edit = (fn) => setDraft((d) => {
    try { return fn(d); } catch (e) { console.warn(e.message); return d; }
  });
  const toggleOpen = (key) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(key)) n.delete(key); else n.add(key);
    return n;
  });

  const pages = sortedPages(draft);
  const landing = pages.find((p) => p.enabled !== false)?.id;
  const savedSlugs = new Set(sortedPages(layout).filter((p) => p.enabled !== false).map((p) => p.slug));

  const newPage = async () => {
    const label = await dialog.prompt({
      title: 'New page',
      label: 'Nav label',
      placeholder: 'e.g. Blog',
      confirmLabel: 'Add page',
      validate: (v) => {
        const id = slugify(v);
        if (!ID_PATTERN.test(id)) return 'Use letters or digits';
        if (draft.pages.some((p) => p.id === id || p.slug === id)) return `A page “${id}” already exists`;
        return null;
      },
      describe: (v) => `Adds an empty page “${slugify(v)}” at the end of the nav — then add sections to it.`,
    });
    if (label) edit((d) => addPage(d, { id: slugify(label), label }));
  };

  const deletePage = async (page) => {
    const ok = await dialog.confirm({
      title: `Remove the “${page.label}” page?`,
      body: `Its ${page.sections.length} section(s) go with it — the content files they read stay. Takes effect when you save.`,
      confirmLabel: 'Remove page',
      danger: true,
    });
    if (ok) edit((d) => removePage(d, page.id));
  };

  /** Sections can be dropped into another page; their id is made unique there. */
  const dropSection = (from, to) => {
    edit((d) => {
      if (from.pageId === to.pageId) {
        return moveSection(d, from.pageId, from.index, to.index > from.index ? to.index - 1 : to.index);
      }
      const section = d.pages.find((p) => p.id === from.pageId).sections[from.index];
      const target = d.pages.find((p) => p.id === to.pageId);
      const id = uniqueId(section.id, target.sections.map((s) => s.id));
      return updatePage(removeSection(d, from.pageId, from.index), to.pageId, {
        sections: [...target.sections.slice(0, to.index), { ...section, id }, ...target.sections.slice(to.index)],
      });
    });
  };

  const endDrag = () => { setDrag(null); setDropAt(null); };
  const onDrop = () => {
    if (drag?.kind === 'page' && typeof dropAt === 'number') {
      const from = pages.findIndex((p) => p.id === drag.id);
      edit((d) => movePage(d, drag.id, dropAt > from ? dropAt - 1 : dropAt));
    }
    if (drag?.kind === 'section' && dropAt && typeof dropAt === 'object') dropSection(drag, dropAt);
    endDrag();
  };

  const focusGrip = (selector) => requestAnimationFrame(() => listRef.current?.querySelector(selector)?.focus());

  return (
    <div className="editor narrow-wide">
      <header className="editor-header">
        <div className="editor-title">
          <h1>Site map</h1>
          <div className="muted small">
            <code>content/site/layout.json</code> — the pages in the nav and the sections each one shows, top to bottom.
          </div>
        </div>
        <SaveBar dirty={dirty} saving={saving} invalid={errors.length > 0} onSave={save} onDiscard={() => setDraft(layout)} />
      </header>

      {errors.length > 0 && (
        <div className="notice notice-error" role="alert">
          Fix these to save:
          <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <div className="toolbar">
        <span className="muted small">Drag ⋮⋮ (or focus it and press Alt+↑/↓) to reorder. Sections can be dragged between pages.</span>
        <button className="btn btn-small btn-primary" onClick={newPage}>+ Add page</button>
      </div>

      <ol className="sitemap-pages" ref={listRef} onDragOver={(e) => drag && e.preventDefault()} onDrop={onDrop}>
        {pages.map((page, pi) => {
          const off = page.enabled === false;
          return (
            <li
              key={page.id}
              className={[
                'card sitemap-page',
                off && 'is-off',
                drag?.kind === 'page' && drag.id === page.id && 'dragging',
                drag?.kind === 'page' && dropAt === pi && 'drop-before',
                drag?.kind === 'page' && dropAt === pi + 1 && pi === pages.length - 1 && 'drop-after',
              ].filter(Boolean).join(' ')}
              onDragOver={(e) => {
                if (drag?.kind !== 'page') return;
                e.preventDefault();
                const r = e.currentTarget.getBoundingClientRect();
                setDropAt(e.clientY < r.top + r.height / 2 ? pi : pi + 1);
              }}
            >
              <div className="sitemap-page-head">
                <button
                  className="grip grip-btn"
                  draggable
                  data-page-grip={page.id}
                  aria-label={`Move page ${page.label} (Alt+↑/↓)`}
                  title="Drag, or focus and press Alt+↑/↓, to reorder"
                  onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setDragImage(e.currentTarget.closest('li'), 16, 16); setDrag({ kind: 'page', id: page.id }); }}
                  onDragEnd={endDrag}
                  onKeyDown={(e) => {
                    if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
                    e.preventDefault();
                    edit((d) => movePage(d, page.id, Math.max(0, pi + (e.key === 'ArrowUp' ? -1 : 1))));
                    focusGrip(`[data-page-grip="${page.id}"]`);
                  }}
                >⋮⋮</button>
                <div className="sitemap-page-fields">
                  <div className="field">
                    <label className="label small" htmlFor={`page-label-${page.id}`}>Nav label</label>
                    <input
                      id={`page-label-${page.id}`}
                      className={`input input-small ${!page.label?.trim() ? 'input-invalid' : ''}`}
                      value={page.label}
                      onChange={(e) => edit((d) => updatePage(d, page.id, { label: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label className="label small" htmlFor={`page-slug-${page.id}`}>Slug <span className="muted">(?page=…)</span></label>
                    <input
                      id={`page-slug-${page.id}`}
                      className={`input input-small mono ${!ID_PATTERN.test(page.slug || '') ? 'input-invalid' : ''}`}
                      value={page.slug}
                      onChange={(e) => edit((d) => updatePage(d, page.id, { slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                    />
                  </div>
                </div>
                <div className="sitemap-page-actions">
                  {page.id === landing && <span className="badge badge-gold" title="The first enabled page opens first">Landing</span>}
                  <label className="switch switch-plain small" title={off ? 'Hidden from the nav' : 'Shown in the nav'}>
                    <input type="checkbox" checked={!off} onChange={(e) => edit((d) => updatePage(d, page.id, { enabled: e.target.checked }))} />
                    <span className="switch-track" aria-hidden />
                    In nav
                  </label>
                  {savedSlugs.has(page.slug) && (
                    <a className="btn btn-small" href={`/?page=${encodeURIComponent(page.slug)}`} target="_blank" rel="noreferrer" title="Open the saved version of this page">View ↗</a>
                  )}
                  <button className="icon-btn icon-btn-danger" aria-label={`Remove page ${page.label}`} title="Remove page" onClick={() => deletePage(page)}>×</button>
                </div>
              </div>

              <ol className="sitemap-sections" aria-label={`${page.label} sections`}>
                {page.sections.map((section, si) => {
                  const type = SECTION_TYPES[section.type];
                  const key = `${page.id}/${section.id}`;
                  const isOpen = open.has(key);
                  const optionKeys = Object.keys(type?.options || {});
                  const sectionOff = section.enabled === false;
                  const isDrop = drag?.kind === 'section' && dropAt?.pageId === page.id;
                  return (
                    <li
                      key={section.id}
                      className={[
                        'sitemap-section',
                        (sectionOff || off) && 'is-off',
                        !type && 'is-unknown',
                        drag?.kind === 'section' && drag.pageId === page.id && drag.index === si && 'dragging',
                        isDrop && dropAt.index === si && 'drop-before',
                        isDrop && dropAt.index === si + 1 && si === page.sections.length - 1 && 'drop-after',
                      ].filter(Boolean).join(' ')}
                      onDragOver={(e) => {
                        if (drag?.kind !== 'section') return;
                        e.preventDefault();
                        e.stopPropagation();
                        const r = e.currentTarget.getBoundingClientRect();
                        setDropAt({ pageId: page.id, index: e.clientY < r.top + r.height / 2 ? si : si + 1 });
                      }}
                    >
                      <div className="sitemap-section-row">
                        <button
                          className="grip grip-btn"
                          draggable
                          data-section-grip={key}
                          aria-label={`Move section ${type?.label || section.type} (Alt+↑/↓)`}
                          title="Drag (also onto another page), or focus and press Alt+↑/↓, to reorder"
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setDragImage(e.currentTarget.closest('li'), 16, 16);
                            setDrag({ kind: 'section', pageId: page.id, index: si });
                          }}
                          onDragEnd={endDrag}
                          onKeyDown={(e) => {
                            if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
                            e.preventDefault();
                            edit((d) => moveSection(d, page.id, si, Math.max(0, si + (e.key === 'ArrowUp' ? -1 : 1))));
                            focusGrip(`[data-section-grip="${key}"]`);
                          }}
                        >⋮⋮</button>
                        <span className="sitemap-icon" aria-hidden>{type?.icon || '❔'}</span>
                        <div className="sitemap-section-text">
                          <div className="row">
                            <b>{type?.label || section.type}</b>
                            {section.id !== section.type && <span className="tag mono">{section.id}</span>}
                            {!type && <span className="badge badge-error">Unknown type</span>}
                          </div>
                          {type && (
                            <div className="sitemap-reads" aria-label="Reads">
                              {type.reads.map((r) => {
                                const site = r.file.match(SITE_FILE);
                                const text = `${r.file.replace(/^site\//, '')}${r.keys ? ` · ${r.keys.join(', ')}` : ''}`;
                                return (
                                  <button
                                    key={r.file}
                                    className="tag sitemap-read"
                                    title={`Reads content/${r.file}${r.keys ? ` (${r.keys.join(', ')})` : ''} — click to edit`}
                                    onClick={() => (site ? onOpenFile(site[1]) : onOpenProjects())}
                                  >
                                    📄 {text}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="sitemap-section-actions">
                          <label className="switch switch-plain small" title={sectionOff ? 'Hidden' : 'Shown'}>
                            <input
                              type="checkbox"
                              checked={!sectionOff}
                              aria-label={`Show ${type?.label || section.type}`}
                              onChange={(e) => edit((d) => updateSection(d, page.id, si, (s) => ({ ...s, enabled: e.target.checked })))}
                            />
                            <span className="switch-track" aria-hidden />
                          </label>
                          {optionKeys.length > 0 && (
                            <button className="btn btn-small" aria-expanded={isOpen} onClick={() => toggleOpen(key)}>
                              Options {isOpen ? '▴' : '▾'}
                            </button>
                          )}
                          <button
                            className="icon-btn icon-btn-danger"
                            aria-label={`Remove section ${type?.label || section.type}`}
                            title="Remove section"
                            onClick={() => edit((d) => removeSection(d, page.id, si))}
                          >×</button>
                        </div>
                      </div>
                      {isOpen && type && (
                        <SectionOptions
                          idPrefix={`opt-${page.id}-${section.id}`}
                          schema={type.options}
                          values={sectionOptions(section)}
                          onChange={(options) => edit((d) => updateSection(d, page.id, si, (s) => ({ ...s, options })))}
                        />
                      )}
                    </li>
                  );
                })}
                {page.sections.length === 0 && (
                  <li
                    className={`sitemap-empty muted small ${drag?.kind === 'section' && dropAt?.pageId === page.id ? 'is-target' : ''}`}
                    onDragOver={(e) => {
                      if (drag?.kind !== 'section') return;
                      e.preventDefault();
                      e.stopPropagation();
                      setDropAt({ pageId: page.id, index: 0 });
                    }}
                  >
                    No sections yet — this page shows nothing. Add one below{drag?.kind === 'section' ? ' or drop it here' : ''}.
                  </li>
                )}
              </ol>

              <div className="sitemap-add">
                <select
                  className="input input-small"
                  aria-label={`Add a section to ${page.label}`}
                  value=""
                  onChange={(e) => {
                    const type = e.target.value;
                    if (!type) return;
                    const id = uniqueId(type, page.sections.map((s) => s.id));
                    edit((d) => addSection(d, page.id, { type, id }));
                    if (Object.keys(SECTION_TYPES[type].options).length) toggleOpen(`${page.id}/${id}`);
                  }}
                >
                  <option value="">+ Add section…</option>
                  {Object.entries(SECTION_TYPES).map(([k, t]) => (
                    <option key={k} value={k}>{t.icon} {t.label} — {t.description}</option>
                  ))}
                </select>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** A form generated from a section type's option schema. */
function SectionOptions({ idPrefix, schema, values, onChange }) {
  const set = (k, v) => onChange({ ...values, [k]: v });
  return (
    <div className="form-grid sitemap-options">
      {Object.entries(schema).map(([k, o]) => {
        const id = `${idPrefix}-${k}`;
        const isDefault = same(values[k], o.default);
        const hint = o.hint || (isDefault ? 'Default' : `Default: ${String(o.default)}`);
        if (o.kind === 'boolean') {
          return (
            <div key={k} className="field field-switch">
              <label className="switch">
                <input id={id} type="checkbox" checked={!!values[k]} onChange={(e) => set(k, e.target.checked)} />
                <span className="switch-track" aria-hidden />
                {o.label}
              </label>
              <div className="field-hint">{hint}</div>
            </div>
          );
        }
        return (
          <div key={k} className="field">
            <label className="label" htmlFor={id}>{o.label}</label>
            {o.kind === 'select' ? (
              <select id={id} className="input" value={values[k]} onChange={(e) => set(k, e.target.value)}>
                {o.values.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            ) : (
              <input
                id={id}
                className="input"
                type={o.kind === 'number' ? 'number' : 'text'}
                value={values[k] ?? ''}
                onChange={(e) => set(k, o.kind === 'number' ? Number(e.target.value) : e.target.value)}
              />
            )}
            <div className="field-hint">{hint}</div>
          </div>
        );
      })}
    </div>
  );
}
