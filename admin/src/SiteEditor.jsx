import { useState } from 'react';
import { api } from './api';

const FILES = {
  profile: 'Profile — name, bio, skills, journey, socials, home page cards',
  navigation: 'Navigation — page list and brand name',
  uiContent: 'UI text — section titles, labels, messages',
  contact: 'Contact form — fields and form endpoint',
};

/** Raw JSON editing for the site-wide files in content/site/, validated before saving. */
export default function SiteEditor({ site, act }) {
  const [name, setName] = useState('profile');
  const [texts, setTexts] = useState(() => Object.fromEntries(Object.keys(FILES).map((k) => [k, JSON.stringify(site[k], null, 2)])));
  const text = texts[name];
  let parseError = null;
  try { JSON.parse(text); } catch (e) { parseError = e.message; }
  const dirty = text !== JSON.stringify(site[name], null, 2);

  return (
    <div className="editor">
      <header className="editor-header">
        <div>
          <h1>Site content</h1>
          <div className="muted small">content/site/{name}.json</div>
        </div>
        <div className="row">
          <button className="btn" disabled={!dirty} onClick={() => setTexts((t) => ({ ...t, [name]: JSON.stringify(site[name], null, 2) }))}>Discard</button>
          <button className="btn btn-primary" disabled={!dirty || !!parseError} onClick={() => act(() => api.saveSite(name, JSON.parse(text)), 'Saved')}>Save</button>
        </div>
      </header>
      <nav className="tabs">
        {Object.keys(FILES).map((k) => <button key={k} className={k === name ? 'active' : ''} onClick={() => setName(k)}>{k}</button>)}
      </nav>
      <p className="muted">{FILES[name]}</p>
      {parseError && <div className="notice notice-error">Invalid JSON: {parseError}</div>}
      <textarea className="input mono json-editor" spellCheck={false} value={text} onChange={(e) => setTexts((t) => ({ ...t, [name]: e.target.value }))} />
    </div>
  );
}
