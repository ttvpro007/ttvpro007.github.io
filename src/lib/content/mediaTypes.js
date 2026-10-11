/**
 * Media type registry — the single list of media kinds a project can carry.
 *
 * Shared by the site (renderers in src/components/features/projects/media),
 * the content plugin (URL resolution) and the admin GUI (upload + forms).
 * Adding a media type = one entry here + one renderer in media/renderers.jsx.
 *
 * Fields:
 *   label      human name shown in the admin
 *   icon       emoji used in the admin and thumbnails
 *   placement  'gallery'  → shown in the modal's media carousel
 *              'playable' → gets its own tab in the modal (and drives the Live Demo button)
 *   source     'file'   → uploaded into the project's media/ folder
 *              'folder' → a whole directory upload (e.g. a Unity WebGL build); src points at its entry file
 *              'url'    → an external link pasted in the admin
 *   accept     file picker filter for 'file' sources
 *   extensions file extensions that auto-detect to this type on upload
 */
export const MEDIA_TYPES = {
  image: {
    label: 'Image',
    icon: '🖼️',
    placement: 'gallery',
    source: 'file',
    accept: 'image/*',
    extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'svg'],
  },
  video: {
    label: 'Video file',
    icon: '🎞️',
    placement: 'gallery',
    source: 'file',
    accept: 'video/mp4,video/webm',
    extensions: ['mp4', 'webm', 'mov'],
  },
  youtube: {
    label: 'YouTube',
    icon: '▶️',
    placement: 'gallery',
    source: 'url',
    placeholder: 'https://www.youtube.com/watch?v=…',
  },
  embed: {
    label: 'Embed (iframe)',
    icon: '🧩',
    placement: 'gallery',
    source: 'url',
    placeholder: 'https://sketchfab.com/models/…/embed',
  },
  unity: {
    label: 'Unity WebGL build',
    icon: '🎮',
    placement: 'playable',
    source: 'folder',
    entry: 'index.html',
    tabLabel: 'Play',
  },
};

export const mediaTypeOf = (item) => MEDIA_TYPES[item?.type] || null;

/** Guess a media type from an uploaded file name. */
export const detectMediaType = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return Object.entries(MEDIA_TYPES).find(([, t]) => t.extensions?.includes(ext))?.[0] || null;
};

/** Accepts watch, youtu.be, shorts, embed URLs or a bare 11-char id. */
export const youTubeId = (src) => {
  if (!src) return null;
  if (/^[\w-]{11}$/.test(src)) return src;
  const m = src.match(/(?:youtu\.be\/|\/embed\/|\/shorts\/|[?&]v=)([\w-]{11})/);
  return m ? m[1] : null;
};

export const isExternal = (src) => /^(https?:)?\/\//.test(src || '');
