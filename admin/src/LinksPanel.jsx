import { LINK_TYPES, detectLinkType } from '@/lib/content/linkTypes';

/** Project links → the action buttons in the modal. Types come from LINK_TYPES. */
export default function LinksPanel({ links, onChange }) {
  const update = (i, patch) => onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  return (
    <div className="stack">
      <p className="muted">
        Each link becomes a button in the project modal, ordered by type. Paste a URL and the type is guessed for you.
        A Unity build in Media adds a Live Demo button automatically.
      </p>
      {links.map((link, i) => (
        <div key={i} className="link-row">
          <select className="input" value={link.type} onChange={(e) => update(i, { type: e.target.value })}>
            {Object.entries(LINK_TYPES).map(([id, t]) => <option key={id} value={id}>{t.icon} {t.label}</option>)}
          </select>
          <input
            className="input"
            placeholder="https://…"
            value={link.url}
            onChange={(e) => update(i, { url: e.target.value })}
            onPaste={(e) => {
              const url = e.clipboardData.getData('text');
              if (link.url) return; // normal paste into existing text
              e.preventDefault();
              update(i, { url, type: detectLinkType(url) });
            }}
          />
          <input className="input" placeholder={`Button label (default: ${LINK_TYPES[link.type]?.label})`} value={link.label || ''} onChange={(e) => update(i, { label: e.target.value || undefined })} />
          <button className="btn btn-small btn-danger" onClick={() => onChange(links.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <div>
        <button className="btn" onClick={() => onChange([...links, { type: 'website', url: '' }])}>+ Add link</button>
      </div>
      <p className="muted small">Remember to Save (Ctrl+S) after editing links.</p>
    </div>
  );
}
