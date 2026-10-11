import { useEffect, useRef, useState } from 'react';
import { api } from './api';
import { ChipInput, SaveBar, humanize, useDirty, useSaveShortcut } from './ui';

const FILES = {
  profile: { label: 'Profile', about: 'Name, bio, skills, journey, socials and the home page cards' },
  navigation: { label: 'Navigation', about: 'Page list and brand name' },
  uiContent: { label: 'UI text', about: 'Section titles, labels and messages across the site' },
  contact: { label: 'Contact', about: 'Contact form text, fields and the form endpoint' },
};

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isPrimitive = (v) => v === null || ['string', 'number', 'boolean'].includes(typeof v);
const hidden = (k) => k.startsWith('_');
/** Arrays of short words edit as chips; sentences get a row each. */
const isChipList = (v) => Array.isArray(v) && v.every((x) => typeof x === 'number' || (typeof x === 'string' && x.length <= 40));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Empty value with the same shape — used for "Add item" in object lists. */
const blank = (v) =>
  Array.isArray(v) ? [] : isObj(v) ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)]))
    : typeof v === 'number' ? 0 : typeof v === 'boolean' ? false : '';

/** A readable title for an object in a list. */
const itemTitle = (item, i) => {
  for (const k of ['title', 'name', 'label', 'id', 'text']) if (typeof item?.[k] === 'string' && item[k]) return item[k];
  for (const v of Object.values(item || {})) if (isObj(v)) { const t = itemTitle(v, -1); if (t) return t; }
  return i >= 0 ? `Item ${i + 1}` : null;
};

/** Does this path or anything under it match the filter (by name or value)? */
const matches = (q, path, value) => {
  if (!q) return true;
  if (path.some((p) => String(p).toLowerCase().includes(q) || humanize(p).toLowerCase().includes(q))) return true;
  if (isPrimitive(value)) return value !== null && String(value).toLowerCase().includes(q);
  return Object.entries(value).some(([k, v]) => !hidden(k) && matches(q, [k], v));
};

/**
 * Site-wide files in content/site/, edited as forms generated from each file's
 * own shape — so a new key in the JSON shows up here without admin changes.
 * The JSON view stays available for structural edits.
 */
export default function SiteEditor({ site, act }) {
  const [name, setName] = useState('profile');
  const [mode, setMode] = useState('form');
  const [drafts, setDrafts] = useState(() => structuredClone(site));
  const [base, setBase] = useState(site);
  const [jsonText, setJsonText] = useState(null);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);

  // Adopt outside edits for files that have no unsaved changes
  if (base !== site) {
    setBase(site);
    setDrafts((d) => Object.fromEntries(Object.keys(FILES).map((k) => [k, same(d[k], base[k]) ? structuredClone(site[k]) : d[k]])));
  }

  const dirtyFiles = Object.keys(FILES).filter((k) => !same(drafts[k], site[k]));
  const dirty = dirtyFiles.length > 0;
  useDirty('site', dirty);

  let parseError = null;
  if (jsonText !== null) { try { JSON.parse(jsonText); } catch (e) { parseError = e.message; } }

  const setDraft = (value) => setDrafts((d) => ({ ...d, [name]: value }));
  const switchMode = (m) => {
    if (m === mode) return;
    if (m === 'json') setJsonText(JSON.stringify(drafts[name], null, 2));
    else setJsonText(null);
    setMode(m);
  };
  const switchFile = (k) => {
    setName(k);
    setQuery('');
    if (mode === 'json') setJsonText(JSON.stringify(drafts[k], null, 2));
  };

  const save = async () => {
    setSaving(true);
    try {
      await act(async () => { for (const k of dirtyFiles) await api.saveSite(k, drafts[k]); },
        dirtyFiles.length > 1 ? `Saved ${dirtyFiles.length} files` : 'Saved');
    } finally {
      setSaving(false);
    }
  };
  const discard = () => {
    setDrafts(structuredClone(site));
    if (mode === 'json') setJsonText(JSON.stringify(site[name], null, 2));
  };
  useSaveShortcut(save, dirty && !parseError && !saving);

  const data = drafts[name];
  const hiddenKeys = isObj(data) ? Object.keys(data).filter(hidden) : [];
  const hints = data?._fieldDescriptions || {};
  const q = query.trim().toLowerCase();

  return (
    <div className="editor">
      <header className="editor-header">
        <div className="editor-title">
          <h1>Site content</h1>
          <div className="muted small"><code>content/site/{name}.json</code> — {FILES[name].about}</div>
        </div>
        <SaveBar dirty={dirty} saving={saving} invalid={!!parseError} onSave={save} onDiscard={discard} />
      </header>

      <nav className="tabs" role="tablist">
        {Object.entries(FILES).map(([k, f]) => (
          <button key={k} role="tab" aria-selected={k === name} className={k === name ? 'active' : ''} onClick={() => switchFile(k)}>
            {f.label}
            {dirtyFiles.includes(k) && <span className="dirty-dot" title="Unsaved changes" />}
          </button>
        ))}
      </nav>

      <div className="toolbar">
        {mode === 'form' && (
          <input
            className="input input-small toolbar-search"
            type="search"
            placeholder="Find a field or text…"
            aria-label="Find a field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        <div className="segmented" role="group" aria-label="Editor mode">
          <button className={mode === 'form' ? 'active' : ''} aria-pressed={mode === 'form'} disabled={!!parseError} onClick={() => switchMode('form')}>Form</button>
          <button className={mode === 'json' ? 'active' : ''} aria-pressed={mode === 'json'} onClick={() => switchMode('json')}>JSON</button>
        </div>
      </div>

      {mode === 'json' ? (
        <>
          {parseError && <div className="notice notice-error">Invalid JSON — fix it to save or switch back to the form: {parseError}</div>}
          <textarea
            className={`input mono json-editor ${parseError ? 'input-invalid' : ''}`}
            spellCheck={false}
            aria-label={`${name}.json`}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              try { setDraft(JSON.parse(e.target.value)); } catch { /* shown above */ }
            }}
          />
        </>
      ) : (
        <div className="site-form">
          {isObj(data) ? (
            <ObjectFields value={data} path={[]} hints={hints} q={q} depth={0} onChange={setDraft} />
          ) : (
            <Node k={name} value={data} path={[name]} hints={hints} q={q} depth={0} onChange={setDraft} />
          )}
          {q && !matches(q, [], Object.fromEntries(Object.entries(data || {}).filter(([k]) => !hidden(k)))) && (
            <div className="empty-state empty-state-small"><p className="muted">Nothing in {FILES[name].label} matches “{query}”.</p></div>
          )}
          {hiddenKeys.length > 0 && (
            <p className="muted small">
              {hiddenKeys.map((k) => <code key={k}>{k}</code>).reduce((a, b) => [a, ', ', b])} — notes for maintainers, kept as is (edit in JSON view).
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** An object's keys: simple values first in a grid, nested groups and lists below. */
function ObjectFields({ value, path, hints, q, depth, onChange }) {
  const entries = Object.entries(value).filter(([k, v]) => !hidden(k) && matches(q, [...path, k], v));
  const simple = entries.filter(([, v]) => isPrimitive(v) || isChipList(v));
  const complex = entries.filter((e) => !simple.includes(e));
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <>
      {simple.length > 0 && (depth === 0 ? (
        <section className="card site-section">
          <h3>General</h3>
          <div className="form-grid">
            {simple.map(([k, v]) => <Node key={k} k={k} value={v} path={[...path, k]} hints={hints} q={q} depth={depth} onChange={(x) => set(k, x)} />)}
          </div>
        </section>
      ) : (
        <div className="form-grid">
          {simple.map(([k, v]) => <Node key={k} k={k} value={v} path={[...path, k]} hints={hints} q={q} depth={depth} onChange={(x) => set(k, x)} />)}
        </div>
      ))}
      {complex.map(([k, v]) => <Node key={k} k={k} value={v} path={[...path, k]} hints={hints} q={q} depth={depth} onChange={(x) => set(k, x)} />)}
    </>
  );
}

function Node({ k, value, path, hints, q, depth, onChange }) {
  const id = `site-${path.join('-')}`;
  const hint = typeof hints[k] === 'string' ? hints[k] : null;
  const label = typeof k === 'number' ? `#${k + 1}` : humanize(k);

  if (isObj(value)) {
    const body = <ObjectFields value={value} path={path} hints={hints} q={q} depth={depth + 1} onChange={onChange} />;
    if (depth === 0) {
      return (
        <section className="card site-section">
          <h3>{label}</h3>
          {hint && <p className="muted small">{hint}</p>}
          {body}
        </section>
      );
    }
    return (
      <details className="group" open={!!q || depth < 2}>
        <summary>{label}{hint && <span className="muted small"> — {hint}</span>}</summary>
        <div className="group-body">{body}</div>
      </details>
    );
  }

  if (Array.isArray(value) && !isChipList(value)) {
    const List = value.every((x) => typeof x === 'string') ? StringList : ObjectList;
    const list = <List k={k} value={value} path={path} hints={hints} q={q} depth={depth} onChange={onChange} />;
    if (depth === 0) {
      return (
        <section className="card site-section">
          <h3>{label} <span className="tab-count">{value.length}</span></h3>
          {hint && <p className="muted small">{hint}</p>}
          {list}
        </section>
      );
    }
    return (
      <details className="group" open={!!q || depth < 2}>
        <summary>{label} <span className="tab-count">{value.length}</span>{hint && <span className="muted small"> — {hint}</span>}</summary>
        <div className="group-body">{list}</div>
      </details>
    );
  }

  const labelEl = <label className="label" htmlFor={id}>{label}</label>;
  const hintEl = hint && <div className="field-hint">{hint}</div>;

  if (Array.isArray(value)) {
    const numeric = value.length > 0 && value.every((v) => typeof v === 'number');
    return <div className="field field-wide">{labelEl}<ChipInput id={id} value={value} numeric={numeric} onChange={onChange} />{hintEl}</div>;
  }
  if (typeof value === 'boolean') {
    return (
      <div className="field field-switch">
        <label className="switch">
          <input id={id} type="checkbox" role="switch" checked={value} onChange={(e) => onChange(e.target.checked)} />
          <span className="switch-track" aria-hidden />
          <span>{label}</span>
        </label>
        {hintEl}
      </div>
    );
  }
  if (typeof value === 'number') {
    return <div className="field">{labelEl}<input id={id} className="input" type="number" value={value} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />{hintEl}</div>;
  }
  const text = value ?? '';
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(text)) {
    return (
      <div className="field">
        {labelEl}
        <div className="color-input">
          <input type="color" aria-label={`${label} color`} value={text.length === 4 ? `#${[...text.slice(1)].map((c) => c + c).join('')}` : text} onChange={(e) => onChange(e.target.value)} />
          <input id={id} className="input mono" value={text} onChange={(e) => onChange(e.target.value)} />
        </div>
        {hintEl}
      </div>
    );
  }
  if ((text.length > 70 && text.includes(' ')) || text.includes('\n')) {
    return (
      <div className="field field-wide">
        {labelEl}
        <textarea id={id} className="input" rows={Math.min(8, Math.max(2, Math.ceil(text.length / 110)))} value={text} onChange={(e) => onChange(e.target.value)} />
        {hintEl}
      </div>
    );
  }
  return (
    <div className="field">
      {labelEl}
      <input id={id} className="input" value={text} onChange={(e) => onChange(value === null && e.target.value === '' ? null : e.target.value)} />
      {hintEl}
    </div>
  );
}

/** A list of objects: one collapsible card per item, with reorder / remove / add. */
function ObjectList({ k, value, path, hints, q, depth, onChange }) {
  const [openIndex, setOpenIndex] = useState(null);
  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const n = [...value];
    n.splice(to, 0, n.splice(from, 1)[0]);
    onChange(n);
  };
  const noun = humanize(k).replace(/s$/i, '').toLowerCase();
  const shown = value.map((item, i) => [item, i]).filter(([item, i]) => matches(q, [...path, i], item));

  return (
    <div className="object-list">
      {shown.map(([item, i]) => (
        <details
          key={i}
          className="list-item"
          open={!!q || openIndex === i}
          onToggle={(e) => {
            if (q) return;
            const open = e.currentTarget.open;
            setOpenIndex((o) => (open ? i : o === i ? null : o));
          }}
        >
          <summary>
            <span className="list-item-title">{itemTitle(item, i)}</span>
            <span className="list-item-actions" onClick={(e) => e.preventDefault()}>
              <button className="icon-btn" aria-label="Move up" title="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>↑</button>
              <button className="icon-btn" aria-label="Move down" title="Move down" disabled={i === value.length - 1} onClick={() => move(i, i + 1)}>↓</button>
              <button className="icon-btn icon-btn-danger" aria-label={`Remove ${itemTitle(item, i)}`} title="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>×</button>
            </span>
          </summary>
          <div className="group-body">
            {isObj(item)
              ? <ObjectFields value={item} path={[...path, i]} hints={hints} q={q} depth={depth + 2} onChange={(x) => onChange(value.map((v, j) => (j === i ? x : v)))} />
              : <Node k={i} value={item} path={[...path, i]} hints={hints} q={q} depth={depth + 2} onChange={(x) => onChange(value.map((v, j) => (j === i ? x : v)))} />}
          </div>
        </details>
      ))}
      {!q && (
        <div>
          <button className="btn btn-small" onClick={() => { onChange([...value, blank(value[0] ?? '')]); setOpenIndex(value.length); }}>
            + Add {noun || 'item'}
          </button>
        </div>
      )}
    </div>
  );
}

/** A list of sentences: one text row each, with reorder / remove / add. */
function StringList({ value, path, q, onChange }) {
  const listRef = useRef(null);
  const [focusLast, setFocusLast] = useState(false);
  useEffect(() => {
    if (!focusLast) return;
    const inputs = listRef.current?.querySelectorAll('textarea');
    inputs?.[inputs.length - 1]?.focus();
    setFocusLast(false);
  }, [focusLast]);
  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const n = [...value];
    n.splice(to, 0, n.splice(from, 1)[0]);
    onChange(n);
  };
  return (
    <div className="object-list" ref={listRef}>
      {value.map((text, i) => matches(q, [...path, i], text) && (
        <div key={i} className="string-row">
          <textarea
            className="input"
            rows={Math.max(1, Math.ceil(text.length / 90))}
            aria-label={`Item ${i + 1}`}
            value={text}
            onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
          />
          <span className="list-item-actions">
            <button className="icon-btn" aria-label="Move up" title="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>↑</button>
            <button className="icon-btn" aria-label="Move down" title="Move down" disabled={i === value.length - 1} onClick={() => move(i, i + 1)}>↓</button>
            <button className="icon-btn icon-btn-danger" aria-label={`Remove item ${i + 1}`} title="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>×</button>
          </span>
        </div>
      ))}
      {!q && <div><button className="btn btn-small" onClick={() => { onChange([...value, '']); setFocusLast(true); }}>+ Add</button></div>}
    </div>
  );
}
