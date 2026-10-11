import { MEDIA_TYPES, youTubeId, isExternal } from './mediaTypes.js';

/**
 * Project schema — field definitions for content/projects/<slug>/project.json.
 *
 * The admin GUI renders its form from PROJECT_FIELDS, so adding a field here
 * makes it editable without touching admin code. `media` and `links` are
 * edited by dedicated panels and are not listed.
 *
 * kinds: text | textarea | number | boolean | list (array of strings) | select
 */
export const PROJECT_FIELDS = [
  { key: 'title',           kind: 'text',     label: 'Title', required: true },
  { key: 'description',     kind: 'textarea', label: 'Short description', hint: 'One or two sentences, shown on cards', required: true },
  { key: 'longDescription', kind: 'textarea', label: 'Long description', hint: 'Shown in the modal when there is no overview.md' },
  { key: 'category',        kind: 'text',     label: 'Category', suggest: 'categories', required: true },
  { key: 'year',            kind: 'number',   label: 'Year', required: true },
  { key: 'tech',            kind: 'list',     label: 'Tech', suggest: 'tech' },
  { key: 'roles',           kind: 'list',     label: 'Roles' },
  { key: 'features',        kind: 'list',     label: 'Features' },
  { key: 'featured',        kind: 'boolean',  label: 'Featured', hint: 'Shown in the hero slot on the Projects page (one project)' },
  { key: 'showOnResume',    kind: 'boolean',  label: 'Show on resume' },
  { key: 'resumeOrder',     kind: 'number',   label: 'Resume order' },
  { key: 'draft',           kind: 'boolean',  label: 'Draft', hint: 'Visible while running locally, left out of published builds' },
];

export const emptyProject = (title = 'New Project') => ({
  title,
  description: '',
  longDescription: '',
  category: '',
  year: new Date().getFullYear(),
  tech: [],
  roles: [],
  features: [],
  cover: null,
  media: [],
  links: [],
  featured: false,
  showOnResume: false,
  resumeOrder: 99,
  draft: true,
});

export const slugify = (s) =>
  String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-') || 'project';

/** Problems that should block publishing. Returns [] when valid. */
export const validateProject = (p) => {
  const errors = [];
  for (const f of PROJECT_FIELDS) {
    if (f.required && (p[f.key] === undefined || p[f.key] === '' || p[f.key] === null)) errors.push(`${f.label} is required`);
  }
  for (const [i, m] of (p.media || []).entries()) {
    if (!MEDIA_TYPES[m.type]) errors.push(`Media #${i + 1}: unknown type "${m.type}"`);
    if (!m.src) errors.push(`Media #${i + 1}: missing source`);
    if (m.type === 'youtube' && !youTubeId(m.src)) errors.push(`Media #${i + 1}: not a YouTube URL`);
  }
  for (const [i, l] of (p.links || []).entries()) {
    if (!l.url) errors.push(`Link #${i + 1}: missing URL`);
  }
  return errors;
};

/**
 * Resolve a media src to a URL the browser can load.
 * Local files live in content/projects/<slug>/media/ and are served at <base>projects/<slug>/.
 */
export const resolveMediaUrl = (src, slug, base = '/') =>
  !src || isExternal(src) ? src : `${base}projects/${slug}/${src.replace(/^\.?\//, '')}`;

/**
 * Turn a stored project (media srcs relative to its folder) into the shape the
 * site renders: resolved URLs plus the derived `image` (card cover) and `demo`
 * (Live Demo target) the card components read.
 */
export const toViewModel = (project, base = '/') => {
  const { slug } = project;
  const media = (project.media || []).map((m) => ({ ...m, url: resolveMediaUrl(m.src, slug, base) }));
  const firstImage = media.find((m) => m.type === 'image');
  const playable = media.find((m) => MEDIA_TYPES[m.type]?.placement === 'playable');
  const demoLink = (project.links || []).find((l) => l.type === 'demo');
  return {
    ...project,
    media,
    tech: project.tech || [],
    roles: project.roles || [],
    features: project.features || [],
    links: project.links || [],
    // overview.md can reference its own files as ![alt](media/shot.png)
    overview: project.overview?.replace(/\]\((?:\.\/)?media\/([^)\s]+)/g, (_, p) => `](${resolveMediaUrl(p, slug, base)}`) ?? null,
    image: project.cover ? resolveMediaUrl(project.cover, slug, base) : firstImage?.url || null,
    demo: playable?.url || demoLink?.url || null,
  };
};
