import { useRef, useState } from 'react';
import { MEDIA_TYPES, detectMediaType, youTubeId, isExternal } from '@/lib/content/mediaTypes';
import { slugify } from '@/lib/content/projectSchema';
import { api, mediaUrl } from './api';
import { useDialog } from './ui';

/**
 * Media list editor. Every change saves the project immediately (uploads land on
 * disk right away, so the list must follow). Types come from MEDIA_TYPES, so a
 * new type shows up here once it is registered there.
 */
export default function MediaPanel({ project, draft, onChange, act, notify }) {
  const media = draft.media || [];
  const [busy, setBusy] = useState(null);
  const [optimize, setOptimize] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dropAt, setDropAt] = useState(null);
  const dialog = useDialog();
  const listRef = useRef(null);
  const fileInput = useRef(null);
  const folderInput = useRef(null);
  const slug = project.slug;
  const existing = new Set(project.mediaFiles.map((f) => f.path));

  const commit = (nextMedia, extra = {}) => onChange({ ...draft, ...extra, media: nextMedia });

  const uniqueName = (name) => {
    const dot = name.lastIndexOf('.');
    const base = slugify(dot > 0 ? name.slice(0, dot) : name);
    const ext = dot > 0 ? name.slice(dot).toLowerCase() : '';
    let candidate = base + ext;
    for (let n = 2; existing.has(candidate); n++) candidate = `${base}-${n}${ext}`;
    existing.add(candidate);
    return candidate;
  };

  const uploadFiles = async (files) => {
    const added = [];
    const skipped = [];
    for (const [i, file] of [...files].entries()) {
      const type = detectMediaType(file.name);
      if (!type || MEDIA_TYPES[type].source !== 'file') { skipped.push(file.name); continue; }
      setBusy(`Uploading ${i + 1}/${files.length}: ${file.name}`);
      try {
        const { path } = await api.uploadMedia(slug, uniqueName(file.name), file, optimize && type === 'image');
        added.push({ type, src: path });
      } catch (e) {
        notify(`${file.name}: ${e.message}`, 'error');
      }
    }
    setBusy(null);
    if (skipped.length) notify(`Skipped unsupported files: ${skipped.join(', ')}`, 'error');
    if (added.length) await commit([...media, ...added]);
  };

  /** A folder upload (Unity WebGL build): keep its inner structure under media/<folder>/ */
  const uploadFolder = async (fileList) => {
    const files = [...fileList];
    if (!files.length) return;
    const top = files[0].webkitRelativePath.split('/')[0];
    let folder = slugify(top);
    while ([...existing].some((p) => p.startsWith(folder + '/'))) folder += '-new';
    const entry = files.find((f) => f.webkitRelativePath.split('/').length === 2 && f.name === MEDIA_TYPES.unity.entry);
    if (!entry) {
      notify(`"${top}" has no ${MEDIA_TYPES.unity.entry} at its top level — pick the Unity build output folder.`, 'error');
      return;
    }
    try {
      for (const [i, file] of files.entries()) {
        const rel = file.webkitRelativePath.split('/').slice(1).join('/');
        setBusy(`Uploading build ${i + 1}/${files.length}: ${rel}`);
        await api.uploadMedia(slug, `${folder}/${rel}`, file, false);
      }
      await commit([...media, { type: 'unity', src: `${folder}/${MEDIA_TYPES.unity.entry}`, title: 'Play in browser' }]);
    } finally {
      setBusy(null);
    }
  };

  const addUrl = async (type) => {
    const src = await dialog.prompt({
      title: `Add ${MEDIA_TYPES[type].label}`,
      label: 'URL',
      placeholder: MEDIA_TYPES[type].placeholder,
      confirmLabel: 'Add',
      validate: (v) =>
        !/^https?:\/\//i.test(v) ? 'Use a full URL starting with https://'
          : type === 'youtube' && !youTubeId(v) ? 'That does not look like a YouTube link' : null,
    });
    if (!src) return;
    await commit([...media, { type, src }]);
  };

  const remove = async (index) => {
    const item = media[index];
    const ok = await dialog.confirm({
      title: `Remove this ${MEDIA_TYPES[item.type]?.label.toLowerCase() || 'item'}?`,
      body: isExternal(item.src) ? 'The link is removed from the project.' : 'Its file is deleted from the media folder unless another item still uses it.',
      confirmLabel: 'Remove',
      danger: true,
    });
    if (!ok) return;
    const next = media.filter((_, i) => i !== index);
    const extra = draft.cover === item.src ? { cover: null } : {};
    await commit(next, extra);
    // Delete the file (or whole build folder) when nothing else references it
    if (!isExternal(item.src)) {
      const target = MEDIA_TYPES[item.type]?.source === 'folder' ? item.src.split('/')[0] : item.src;
      const stillUsed = next.some((m) => m.src === item.src || m.src.startsWith(target + '/'));
      if (!stillUsed) await act(() => api.deleteMedia(slug, target));
    }
  };

  const move = (from, to) => {
    if (from === null || to < 0 || to >= media.length || from === to) return;
    const next = [...media];
    next.splice(to, 0, next.splice(from, 1)[0]);
    commit(next);
  };
  /** Drop before position `at` (0…length). */
  const dropBefore = (from, at) => move(from, at > from ? at - 1 : at);

  const update = (index, patch) => commit(media.map((m, i) => (i === index ? { ...m, ...patch } : m)));

  return (
    <div className="stack">
      <div
        className={`dropzone ${dragOver ? 'over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
      >
        <div className="dropzone-title">
          <span className="dropzone-icon" aria-hidden>⬆</span>
          <div>
            <b>Drop images or videos here</b>
            <div className="muted small">PNG, JPEG, WebP, GIF, MP4, WebM — or add from the options below. Media changes save immediately.</div>
          </div>
        </div>
        <div className="row wrap">
          <button className="btn" onClick={() => fileInput.current.click()}>🖼️ Choose files…</button>
          <button className="btn" onClick={() => folderInput.current.click()}>🎮 Unity WebGL build folder…</button>
          <button className="btn" onClick={() => addUrl('youtube')}>▶️ YouTube link</button>
          <button className="btn" onClick={() => addUrl('embed')}>🧩 Embed URL</button>
        </div>
        <label className="switch switch-plain small">
          <input type="checkbox" role="switch" checked={optimize} onChange={(e) => setOptimize(e.target.checked)} />
          <span className="switch-track" aria-hidden />
          <span>Optimize large PNG/JPEG uploads (resize to ≤2400px, convert to WebP)</span>
        </label>
        <input ref={fileInput} type="file" multiple hidden accept="image/*,video/mp4,video/webm" onChange={(e) => { uploadFiles(e.target.files); e.target.value = ''; }} />
        <input ref={folderInput} type="file" hidden webkitdirectory="" directory="" onChange={(e) => { uploadFolder(e.target.files); e.target.value = ''; }} />
        {busy && <div className="progress" role="status"><span className="spinner spinner-small" aria-hidden /> {busy}</div>}
      </div>

      {media.length === 0 && <div className="empty-state empty-state-small"><p className="muted">No media yet. The first image becomes the card cover unless you pick one.</p></div>}

      <ol
        className="media-list"
        ref={listRef}
        onDragOver={(e) => dragIndex !== null && e.preventDefault()}
        onDrop={(e) => {
          if (dragIndex === null) return;
          e.preventDefault();
          e.stopPropagation();
          if (dropAt !== null) dropBefore(dragIndex, dropAt);
          setDragIndex(null);
          setDropAt(null);
        }}
      >
        {media.map((item, i) => {
          const t = MEDIA_TYPES[item.type];
          const isCover = draft.cover ? draft.cover === item.src : i === media.findIndex((m) => m.type === 'image');
          return (
            <li
              key={item.src + i}
              className={[
                'media-row',
                dragIndex === i && 'dragging',
                dragIndex !== null && dropAt === i && 'drop-before',
                dragIndex !== null && dropAt === i + 1 && i === media.length - 1 && 'drop-after',
              ].filter(Boolean).join(' ')}
              draggable
              onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragIndex(i); }}
              onDragEnd={() => { setDragIndex(null); setDropAt(null); }}
              onDragOver={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                const r = e.currentTarget.getBoundingClientRect();
                setDropAt(e.clientY < r.top + r.height / 2 ? i : i + 1);
              }}
            >
              <button
                className="grip grip-btn"
                aria-label={`Move item ${i + 1} (Alt+↑/↓)`}
                title="Drag, or focus and press Alt+↑/↓, to reorder"
                onKeyDown={(e) => {
                  if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
                  e.preventDefault();
                  const to = e.key === 'ArrowUp' ? i - 1 : i + 1;
                  move(i, to);
                  requestAnimationFrame(() => listRef.current?.querySelectorAll('.grip-btn')[to]?.focus());
                }}
              >⋮⋮</button>
              <MediaPreview item={item} slug={slug} />
              <div className="media-meta">
                <div className="row">
                  <span className="tag">{t?.icon} {t?.label || item.type}</span>
                  {t?.placement === 'playable' && <span className="badge badge-ok">Own tab + Live Demo button</span>}
                  {isCover && <span className="badge badge-gold">Cover</span>}
                </div>
                <div className="mono small ellipsis" title={item.src}>{item.src}</div>
                <input
                  aria-label={t?.placement === 'playable' ? 'Tab title' : 'Caption'}
                  className="input input-small"
                  placeholder={t?.placement === 'playable' ? 'Tab title (e.g. Play in browser)' : 'Caption (optional)'}
                  defaultValue={t?.placement === 'playable' ? item.title || '' : item.caption || ''}
                  onBlur={(e) => {
                    const key = t?.placement === 'playable' ? 'title' : 'caption';
                    if ((item[key] || '') !== e.target.value) update(i, { [key]: e.target.value || undefined });
                  }}
                />
              </div>
              <div className="media-actions">
                <button className="icon-btn" aria-label="Move up" title="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>↑</button>
                <button className="icon-btn" aria-label="Move down" title="Move down" disabled={i === media.length - 1} onClick={() => move(i, i + 1)}>↓</button>
                {item.type === 'image' && !isCover && (
                  <button className="btn btn-small" onClick={() => commit(media, { cover: item.src })}>Set cover</button>
                )}
                <button className="btn btn-small btn-danger" onClick={() => remove(i)}>Remove</button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MediaPreview({ item, slug }) {
  const url = mediaUrl(slug, item.src);
  switch (item.type) {
    case 'image':
      return <img className="media-thumb" src={url} alt="" loading="lazy" />;
    case 'video':
      return <video className="media-thumb" src={`${url}#t=0.5`} muted preload="metadata" />;
    case 'youtube':
      return <img className="media-thumb" src={`https://img.youtube.com/vi/${youTubeId(item.src)}/mqdefault.jpg`} alt="" />;
    default:
      return <div className="media-thumb media-thumb-icon">{MEDIA_TYPES[item.type]?.icon || '❔'}</div>;
  }
}
