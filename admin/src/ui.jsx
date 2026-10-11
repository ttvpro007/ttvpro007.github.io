/* eslint-disable react-refresh/only-export-components -- shared hooks and widgets live together */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

/** "resumeOrder" / "form_fields" → "Resume order" / "Form fields" */
export const humanize = (key) => {
  const s = String(key).replace(/[_-]+/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().trim();
  const words = s.split(' ').map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w));
  const out = words.join(' ');
  return out.charAt(0).toUpperCase() + out.slice(1);
};
const ACRONYMS = new Set(['url', 'id', 'ui', 'api', 'svg', 'cx', 'cy']);

/* ── Dialogs: promise-based replacements for window.prompt / confirm ─────────── */

const DialogContext = createContext(null);
export const useDialog = () => useContext(DialogContext);

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const open = useCallback((opts) => new Promise((resolve) => setDialog({ ...opts, resolve, returnFocus: document.activeElement })), []);
  const api = useRef({
    /** Resolves true/false. */
    confirm: (opts) => open({ ...opts, kind: 'confirm' }),
    /** Resolves the entered text, or null when cancelled. */
    prompt: (opts) => open({ ...opts, kind: 'prompt' }),
  }).current;

  const close = (value) => {
    dialog.resolve(value);
    setDialog(null);
    requestAnimationFrame(() => dialog.returnFocus?.isConnected && dialog.returnFocus.focus());
  };

  return (
    <DialogContext.Provider value={api}>
      {children}
      {dialog && <Dialog dialog={dialog} onClose={close} />}
    </DialogContext.Provider>
  );
}

function Dialog({ dialog, onClose }) {
  const { kind, title, body, label, placeholder, initial = '', confirmLabel, danger, validate, describe } = dialog;
  const [value, setValue] = useState(initial);
  const input = useRef(null);
  const confirmBtn = useRef(null);
  const error = kind === 'prompt' ? validate?.(value.trim()) : null;
  const cancelValue = kind === 'prompt' ? null : false;

  useEffect(() => {
    if (kind === 'prompt') input.current?.select();
    else confirmBtn.current?.focus();
  }, [kind]);

  const submit = (e) => {
    e.preventDefault();
    if (kind === 'prompt') {
      if (!value.trim() || error) return;
      onClose(value.trim());
    } else onClose(true);
  };

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose(cancelValue)}>
      <form
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onSubmit={submit}
        onKeyDown={(e) => e.key === 'Escape' && onClose(cancelValue)}
      >
        <h2 id="dialog-title">{title}</h2>
        {body && <div className="dialog-body muted">{body}</div>}
        {kind === 'prompt' && (
          <div className="field">
            {label && <label className="label" htmlFor="dialog-input">{label}</label>}
            <input
              id="dialog-input"
              ref={input}
              className={`input ${error ? 'input-invalid' : ''}`}
              value={value}
              placeholder={placeholder}
              onChange={(e) => setValue(e.target.value)}
              aria-invalid={!!error}
              aria-describedby="dialog-hint"
            />
            <div id="dialog-hint" className={`field-hint ${error ? 'field-error' : ''}`}>{error || (value.trim() && describe?.(value.trim()))}</div>
          </div>
        )}
        <div className="dialog-actions">
          <button type="button" className="btn" onClick={() => onClose(cancelValue)}>Cancel</button>
          <button
            ref={confirmBtn}
            type="submit"
            className={`btn ${danger ? 'btn-danger-solid' : 'btn-primary'}`}
            disabled={kind === 'prompt' && (!value.trim() || !!error)}
          >
            {confirmLabel || (kind === 'prompt' ? 'OK' : 'Confirm')}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Toasts: success fades, errors stay until dismissed ─────────────────────── */

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback((text, kind = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-3), { id, text, kind }]);
    if (kind !== 'error') setTimeout(() => dismiss(id), 2600);
  }, [dismiss]);
  return { toasts, notify, dismiss };
}

export function Toasts({ toasts, dismiss }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`} role={t.kind === 'error' ? 'alert' : 'status'}>
          <span>{t.kind === 'error' ? '⚠' : '✓'}</span>
          <span className="toast-text">{t.text}</span>
          <button className="icon-btn" aria-label="Dismiss" onClick={() => dismiss(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

/* ── Unsaved-change tracking shared by every editor ─────────────────────────── */

export const DirtyContext = createContext(() => {});

/** Report this editor's unsaved state to the app (navigation guard, sidebar dot). */
export function useDirty(key, dirty) {
  const setDirty = useContext(DirtyContext);
  useEffect(() => {
    setDirty(key, dirty);
    return () => setDirty(key, false);
  }, [key, dirty, setDirty]);
}

/** Ctrl/Cmd+S runs `save` (when there is something to save). */
export function useSaveShortcut(save, enabled = true) {
  const ref = useRef(save);
  useEffect(() => { ref.current = save; });
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (enabled) ref.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}

/** Header save controls: status text, Discard, Save. */
export function SaveBar({ dirty, saving, invalid, onSave, onDiscard, saveLabel = 'Save' }) {
  return (
    <div className="save-bar">
      <span className={`save-status ${dirty ? 'is-dirty' : ''}`} aria-live="polite">
        {saving ? 'Saving…' : dirty ? '● Unsaved changes' : '✓ All changes saved'}
      </span>
      {onDiscard && <button className="btn" disabled={!dirty || saving} onClick={onDiscard}>Discard</button>}
      <button
        className="btn btn-primary"
        disabled={!dirty || saving || invalid}
        title={invalid ? 'Fix the highlighted problems first' : 'Ctrl+S'}
        onClick={onSave}
      >
        {saveLabel} <kbd>Ctrl S</kbd>
      </button>
    </div>
  );
}

/* ── Inputs ─────────────────────────────────────────────────────────────────── */

/** Edit an array of strings: Enter or comma adds, × removes, drag (or ‹ ›) reorders. */
export function ChipInput({ id, value, onChange, suggestions, numeric = false, placeholder = 'Type and press Enter' }) {
  const [text, setText] = useState('');
  const [dragFrom, setDragFrom] = useState(null);
  const parse = (s) => (numeric ? Number(s) : s);
  const add = () => {
    const items = text.split(',').map((s) => s.trim()).filter(Boolean)
      .filter((s) => !numeric || !Number.isNaN(Number(s)))
      .map(parse)
      .filter((s) => numeric || !value.includes(s));
    if (items.length) onChange([...value, ...items]);
    setText('');
  };
  const move = (from, to) => {
    if (to < 0 || to >= value.length || from === to) return;
    const n = [...value];
    n.splice(to, 0, n.splice(from, 1)[0]);
    onChange(n);
  };
  return (
    <div className="chips" onClick={(e) => e.target === e.currentTarget && e.currentTarget.querySelector('input')?.focus()}>
      {value.map((v, i) => (
        <span
          key={`${v}-${i}`}
          className={`chip ${dragFrom === i ? 'dragging' : ''}`}
          draggable
          onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragFrom(i); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); move(dragFrom, i); setDragFrom(null); }}
          onDragEnd={() => setDragFrom(null)}
          onKeyDown={(e) => {
            if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); move(i, i - 1); }
            if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); move(i, i + 1); }
          }}
          title="Drag to reorder"
        >
          {String(v)}
          <button type="button" className="chip-btn" aria-label={`Remove ${v}`} onClick={() => onChange(value.filter((_, j) => j !== i))}>×</button>
        </span>
      ))}
      <input
        id={id}
        className="chip-input"
        value={text}
        inputMode={numeric ? 'decimal' : undefined}
        placeholder={value.length ? '' : placeholder}
        list={suggestions?.length ? `${id}-list` : undefined}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
          if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
      />
      {suggestions?.length > 0 && (
        <datalist id={`${id}-list`}>{suggestions.filter((s) => !value.includes(s)).map((s) => <option key={s} value={s} />)}</datalist>
      )}
    </div>
  );
}
