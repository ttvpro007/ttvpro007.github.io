import { useEffect, useRef, useState } from 'react';
import { THEME_TOKENS, FONT_CHOICES } from '@/lib/theme/applyTheme';
import { slugify } from '@/lib/content/projectSchema';
import { api } from './api';
import { SaveBar, useDialog, useDirty, useSaveShortcut } from './ui';

const VIEWPORTS = [
  { id: 'phone', label: 'Phone', width: 390, height: 844 },
  { id: 'tablet', label: 'Tablet', width: 820, height: 1180 },
  { id: 'laptop', label: 'Laptop', width: 1366, height: 768 },
  { id: 'wide', label: 'Wide', width: 1920, height: 1080 },
];

/** WCAG contrast ratio between two hex colors. */
const contrast = (a, b) => {
  const lum = (hex) => {
    const n = parseInt(hex.replace('#', '').slice(0, 6), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

export default function ThemeEditor({ theme, act }) {
  const dialog = useDialog();
  const [draft, setDraft] = useState(theme);
  const [saving, setSaving] = useState(false);
  const [viewport, setViewport] = useState(VIEWPORTS[2]);
  const frame = useRef(null);
  const box = useRef(null);
  const [scale, setScale] = useState(1);
  const dirty = JSON.stringify(draft) !== JSON.stringify(theme);
  const preset = draft.presets[draft.active];
  useDirty('theme', dirty);

  const save = async () => {
    setSaving(true);
    try { await act(() => api.saveTheme(draft), 'Theme saved'); } finally { setSaving(false); }
  };
  useSaveShortcut(save, dirty && !saving);

  // Live preview: push the unsaved theme into the site iframe
  const push = () => frame.current?.contentWindow?.postMessage({ type: 'portfolio:theme', theme: draft }, window.location.origin);
  useEffect(push, [draft]);

  // Fit the chosen viewport into the preview pane
  useEffect(() => {
    const fit = () => box.current && setScale(Math.min(1, box.current.clientWidth / viewport.width));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [viewport]);

  const setPreset = (patch) => setDraft((d) => ({ ...d, presets: { ...d.presets, [d.active]: { ...d.presets[d.active], ...patch } } }));
  const setColor = (key, value) => setPreset({ colors: { ...preset.colors, [key]: value } });

  const duplicate = async () => {
    const label = await dialog.prompt({ title: 'Duplicate preset', label: 'Name for the new preset', initial: `${preset.label} copy`, confirmLabel: 'Duplicate' });
    if (!label) return;
    let id = slugify(label);
    while (draft.presets[id]) id += '-2';
    setDraft((d) => ({ active: id, presets: { ...d.presets, [id]: { ...structuredClone(preset), label } } }));
  };

  const rename = async () => {
    const label = await dialog.prompt({ title: 'Rename preset', label: 'Preset name', initial: preset.label, confirmLabel: 'Rename' });
    if (label) setPreset({ label });
  };

  const remove = async () => {
    if (Object.keys(draft.presets).length < 2) return;
    const ok = await dialog.confirm({ title: `Delete preset “${preset.label}”?`, body: 'Takes effect when you save the theme.', confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    setDraft((d) => {
      const presets = { ...d.presets };
      delete presets[d.active];
      return { active: Object.keys(presets)[0], presets };
    });
  };

  const checks = [
    ['Text on background', preset.colors.text, preset.colors.background, 4.5],
    ['Muted text on surface', preset.colors.textMuted, preset.colors.surface, 4.5],
    ['Primary on background', preset.colors.primary, preset.colors.background, 3],
  ].map(([label, fg, bg, min]) => ({ label, ratio: contrast(fg, bg), min }));

  return (
    <div className="theme-editor">
      <div className="theme-controls">
        <header className="editor-header">
          <h1>Theme</h1>
          <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={() => setDraft(theme)} saveLabel="Save theme" />
        </header>

        <h3>Presets</h3>
        <div className="preset-grid">
          {Object.entries(draft.presets).map(([id, p]) => (
            <button key={id} aria-pressed={draft.active === id} className={`preset ${draft.active === id ? 'active' : ''}`} onClick={() => setDraft((d) => ({ ...d, active: id }))}>
              <div className="swatches" style={{ background: p.colors.background }}>
                {['primary', 'secondary', 'accent', 'surface', 'text'].map((k) => <span key={k} style={{ background: p.colors[k] }} />)}
              </div>
              <div className="preset-name" style={{ fontFamily: `'${p.fonts.heading}'` }}>{p.label}</div>
              {theme.active === id && <span className="badge badge-ok">Live</span>}
            </button>
          ))}
        </div>
        <div className="row">
          <button className="btn btn-small" onClick={duplicate}>Duplicate…</button>
          <button className="btn btn-small" onClick={rename}>Rename…</button>
          <button className="btn btn-small btn-danger" onClick={remove} disabled={Object.keys(draft.presets).length < 2}>Delete…</button>
        </div>

        <h3>Colors <span className="muted small">— editing “{preset.label}”</span></h3>
        <div className="color-grid">
          {THEME_TOKENS.map((t) => (
            <label key={t.key} className="color-field" title={t.hint}>
              <input type="color" value={preset.colors[t.key] || '#000000'} onChange={(e) => setColor(t.key, e.target.value.toUpperCase())} />
              <span>
                <b>{t.label}</b>
                <HexInput value={preset.colors[t.key] || ''} onChange={(v) => setColor(t.key, v)} />
              </span>
            </label>
          ))}
        </div>

        <div className="contrast">
          {checks.map((c) => (
            <div key={c.label} className={c.ratio >= c.min ? 'ok' : 'bad'}>
              {c.ratio >= c.min ? '✓' : '⚠'} {c.label}: {c.ratio.toFixed(1)}:1 <span className="muted">(aim ≥ {c.min})</span>
            </div>
          ))}
        </div>

        <h3>Typography & shape</h3>
        <div className="form-grid">
          {['heading', 'body'].map((role) => (
            <div key={role} className="field">
              <label className="label">{role === 'heading' ? 'Heading font' : 'Body font'} <span className="muted">— any Google Fonts family</span></label>
              <input className="input" list={`fonts-${role}`} value={preset.fonts[role]} onChange={(e) => setPreset({ fonts: { ...preset.fonts, [role]: e.target.value } })} />
              <datalist id={`fonts-${role}`}>{FONT_CHOICES[role].map((f) => <option key={f} value={f} />)}</datalist>
            </div>
          ))}
          <div className="field">
            <label className="label">Corner radius: {preset.radius}px</label>
            <input type="range" min="0" max="32" value={preset.radius} onChange={(e) => setPreset({ radius: Number(e.target.value) })} />
          </div>
        </div>
        <p className="muted small">Changes preview instantly on the right. <b>Save theme</b> writes content/theme.json; the active preset is what visitors see.</p>
      </div>

      <div className="theme-preview">
        <div className="segmented" role="group" aria-label="Preview size">
          {VIEWPORTS.map((v) => (
            <button key={v.id} aria-pressed={viewport.id === v.id} className={viewport.id === v.id ? 'active' : ''} onClick={() => setViewport(v)}>
              {v.label} <span className="muted">{v.width}</span>
            </button>
          ))}
        </div>
        <div className="preview-box" ref={box} style={{ height: viewport.height * scale }}>
          <iframe
            ref={frame}
            title="Site preview"
            src="/"
            onLoad={push}
            style={{ width: viewport.width, height: viewport.height, transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  );
}

/** Hex text field that lets you type freely and applies the color once it is a full #RRGGBB. */
function HexInput({ value, onChange }) {
  const [text, setText] = useState(value);
  const [seen, setSeen] = useState(value);
  if (seen !== value) { setSeen(value); setText(value); }
  const valid = /^#[0-9a-f]{6}$/i.test(text);
  return (
    <input
      className={`input input-small mono ${valid ? '' : 'input-invalid'}`}
      value={text}
      aria-invalid={!valid}
      spellCheck={false}
      onChange={(e) => {
        const v = e.target.value.trim();
        setText(v);
        if (/^#[0-9a-f]{6}$/i.test(v)) onChange(v.toUpperCase());
      }}
      onBlur={() => setText(value)}
    />
  );
}
