import { useEffect, useRef, useState } from 'react';
import { LINK_TYPES, detectLinkType } from '@/lib/content/linkTypes';

/** Project links → the action buttons in the modal. Types come from LINK_TYPES. */
export default function LinksPanel({ links, errors = [], onChange }) {
  const [touched, setTouched] = useState(() => new Set());
  const [focusLast, setFocusLast] = useState(false);
  const listRef = useRef(null);
  const update = (i, patch) => onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  useEffect(() => {
    if (!focusLast) return;
    const inputs = listRef.current?.querySelectorAll('input[type="url"]');
    inputs?.[inputs.length - 1]?.focus();
    setFocusLast(false);
  }, [focusLast]);

  /** A URL typed or pasted into a link still on the default type picks its type. */
  const withType = (link, url) => (link.type === 'website' ? { url, type: detectLinkType(url) } : { url });

  const add = () => {
    onChange([...links, { type: 'website', url: '' }]);
    setFocusLast(true);
  };

  return (
    <div className="stack narrow-wide">
      <p className="muted">
        Each link becomes a button in the project modal, ordered by type. Paste a URL and its type is picked for you.
        A Unity build in Media adds a Live Demo button automatically.
      </p>

      {links.length === 0 ? (
        <div className="empty-state empty-state-small">
          <p className="muted">No links yet — add GitHub, itch.io, a store page or a website.</p>
          <button className="btn btn-primary" onClick={add}>+ Add link</button>
        </div>
      ) : (
        <div className="link-list" ref={listRef}>
          {links.map((link, i) => {
            const error = touched.has(i) || link.url ? errors[i] : null;
            const t = LINK_TYPES[link.type];
            return (
              <div key={i} className="link-row">
                <div className="field">
                  <label className="label small" htmlFor={`link-type-${i}`}>Type</label>
                  <select id={`link-type-${i}`} className="input" value={link.type} onChange={(e) => update(i, { type: e.target.value })}>
                    {Object.entries(LINK_TYPES).map(([id, lt]) => <option key={id} value={id}>{lt.icon} {lt.label}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="label small" htmlFor={`link-url-${i}`}>URL</label>
                  <input
                    id={`link-url-${i}`}
                    type="url"
                    className={`input ${error ? 'input-invalid' : ''}`}
                    placeholder="https://…"
                    value={link.url}
                    aria-invalid={!!error}
                    onChange={(e) => update(i, withType(link, e.target.value.trim()))}
                    onBlur={() => {
                      setTouched((s) => new Set(s).add(i));
                      // "github.com/me" → "https://github.com/me"
                      if (link.url && !/^[a-z][a-z+.-]*:/i.test(link.url) && /^[\w-]+(\.[\w-]+)+/.test(link.url)) update(i, { url: `https://${link.url}` });
                    }}
                  />
                  {error && <div className="field-hint field-error">{error}</div>}
                </div>
                <div className="field">
                  <label className="label small" htmlFor={`link-label-${i}`}>Button label</label>
                  <input
                    id={`link-label-${i}`}
                    className="input"
                    placeholder={t?.label}
                    value={link.label || ''}
                    onChange={(e) => update(i, { label: e.target.value || undefined })}
                  />
                </div>
                <button className="icon-btn icon-btn-danger link-remove" aria-label={`Remove link ${i + 1}`} title="Remove link" onClick={() => onChange(links.filter((_, j) => j !== i))}>×</button>
              </div>
            );
          })}
          <div><button className="btn" onClick={add}>+ Add link</button></div>
        </div>
      )}
    </div>
  );
}
