/**
 * Content operations shared by the admin HTTP API (api.js) and the headless CLI
 * (admin/cli.js). Everything that reads or writes content/ goes through here, so
 * the GUI and agents get the same rules: slug checks, trash-instead-of-delete,
 * order.json upkeep, WebP optimization, the Unity build check and the release gate.
 *
 * Paths resolve against the process's working directory (like plugins/content.js),
 * so callers chdir to the repo root before importing this module.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadProjects, PROJECTS_DIR, ORDER_FILE, CONTENT_DIR } from '../../plugins/content.js';
import { slugify, emptyProject, validateProject } from '../../src/lib/content/projectSchema.js';
import { MEDIA_TYPES, detectMediaType, youTubeId, isExternal } from '../../src/lib/content/mediaTypes.js';
import { validateLayout, normalizeLayout } from '../../src/lib/content/siteLayout.js';
import { optimizeImage } from './media.js';
import { run } from './jobs.js';
import { contentFingerprint, startPreview, testState, markTested } from './release.js';

export const ROOT = path.resolve('.');
const TRASH = path.join(ROOT, '.trash');
const SITE_DIR = path.join(CONTENT_DIR, 'site');
const THEME_FILE = path.join(CONTENT_DIR, 'theme.json');
export const LAYOUT_FILE = path.join(SITE_DIR, 'layout.json');
export const SITE_FILES = ['profile', 'navigation', 'uiContent', 'contact'];

/** An error with an HTTP status (the API sends it; the CLI exits non-zero) and optional detail lines. */
export const fail = (status, message, details) => Object.assign(new Error(message), { status, details });

export const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
};

export const readJson = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
};

/** Resolve a path inside `base`, refusing traversal outside it. */
export const inside = (base, rel = '') => {
  const p = path.resolve(base, rel);
  if (p !== base && !p.startsWith(base + path.sep)) throw fail(400, 'Path escapes its folder');
  return p;
};

export const projectDir = (slug) => {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug || '')) throw fail(400, `Bad project slug "${slug}"`);
  return inside(PROJECTS_DIR, slug);
};

const existingProjectDir = (slug) => {
  const dir = projectDir(slug);
  if (!fs.existsSync(path.join(dir, 'project.json'))) throw fail(404, `No project "${slug}"`);
  return dir;
};

const move = (from, to) => {
  try {
    fs.renameSync(from, to);
  } catch (err) {
    // Windows refuses to rename a folder the dev server's file watcher has open: copy, then remove
    if (err.code !== 'EPERM' && err.code !== 'EBUSY' && err.code !== 'EXDEV') throw err;
    fs.cpSync(from, to, { recursive: true });
    fs.rmSync(from, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
};

const toTrash = (p, label) => {
  const dest = path.join(TRASH, `${new Date().toISOString().replace(/[:.]/g, '-')}-${label}`);
  fs.mkdirSync(TRASH, { recursive: true });
  move(p, dest);
  return path.relative(ROOT, dest);
};

/** Every file under a project's media/ folder, as forward-slash relative paths with sizes. */
export const listMedia = (slug) => {
  const root = path.join(PROJECTS_DIR, slug, 'media');
  if (!fs.existsSync(root)) return [];
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else out.push({ path: path.relative(root, p).split(path.sep).join('/'), size: fs.statSync(p).size });
    }
  };
  walk(root);
  return out;
};

/* ── Projects ─────────────────────────────────────────────────────────── */

const withExtras = (p) => ({ ...p, mediaFiles: listMedia(p.slug), errors: validateProject(p) });

export const listProjects = () => loadProjects().map(withExtras);

export const getProject = (slug) => {
  existingProjectDir(slug);
  return withExtras(loadProjects().find((p) => p.slug === slug));
};

/** Draft project at the top of order.json; the slug gets -2, -3… if taken. */
export const createProject = (title) => {
  if (!String(title ?? '').trim()) throw fail(400, 'A title is required');
  let slug = slugify(title);
  for (let n = 2; fs.existsSync(path.join(PROJECTS_DIR, slug)); n++) slug = `${slugify(title)}-${n}`;
  const dir = projectDir(slug);
  fs.mkdirSync(path.join(dir, 'media'), { recursive: true });
  writeJson(path.join(dir, 'project.json'), emptyProject(title));
  writeJson(ORDER_FILE, [slug, ...readJson(ORDER_FILE, [])]);
  return { slug };
};

const STORED_KEYS = ['slug', 'overview', 'mediaFiles', 'errors'];
const cleanProject = (p) => Object.fromEntries(Object.entries(p).filter(([k]) => !STORED_KEYS.includes(k)));

/** Replace project.json (derived keys like slug/overview/errors are dropped). */
export const saveProject = (slug, data) => {
  const dir = existingProjectDir(slug);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw fail(400, 'Project must be a JSON object');
  writeJson(path.join(dir, 'project.json'), cleanProject(data));
  return { ok: true };
};

export const renameProject = (from, toRaw) => {
  const to = slugify(toRaw);
  const src = existingProjectDir(from);
  const dest = projectDir(to);
  if (fs.existsSync(dest)) throw fail(409, `"${to}" already exists`);
  move(src, dest);
  writeJson(ORDER_FILE, readJson(ORDER_FILE, []).map((s) => (s === from ? to : s)));
  return { slug: to };
};

/** Moves the folder to .trash/ (recoverable) and drops it from order.json. */
export const deleteProject = (slug) => {
  const trashed = toTrash(existingProjectDir(slug), slug);
  writeJson(ORDER_FILE, readJson(ORDER_FILE, []).filter((s) => s !== slug));
  return { trashed };
};

export const readOverview = (slug) => {
  const file = path.join(existingProjectDir(slug), 'overview.md');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
};

/** Write overview.md; blank text deletes it. */
export const writeOverview = (slug, text) => {
  const file = path.join(existingProjectDir(slug), 'overview.md');
  if (text.trim()) fs.writeFileSync(file, text);
  else if (fs.existsSync(file)) fs.rmSync(file);
  return { ok: true };
};

/* ── Media files ──────────────────────────────────────────────────────── */

/** Store one file under media/<rel>; with `optimize`, large PNG/JPEG become WebP (rel may change). */
export const writeMediaFile = async (slug, rel, data, { optimize = false } = {}) => {
  const mediaRoot = path.join(existingProjectDir(slug), 'media');
  if (optimize) ({ data, rel } = await optimizeImage(data, rel));
  const file = inside(mediaRoot, rel);
  if (file === mediaRoot) throw fail(400, 'A media path is required');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
  return { path: rel, size: data.length };
};

export const deleteMediaFile = (slug, rel) => {
  const mediaRoot = path.join(existingProjectDir(slug), 'media');
  const target = inside(mediaRoot, rel);
  if (target === mediaRoot) throw fail(400, 'A media path is required');
  if (!fs.existsSync(target)) return { ok: true };
  return { trashed: toTrash(target, `${slug}-${path.basename(target)}`) };
};

/* ── Media list (what the admin's Media panel does, for headless callers) ─ */

/** A slugified file name not yet used under media/ (keeps the extension). */
const uniqueName = (taken, name) => {
  const dot = name.lastIndexOf('.');
  const base = slugify(dot > 0 ? name.slice(0, dot) : name);
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : '';
  let candidate = base + ext;
  for (let n = 2; taken.has(candidate); n++) candidate = `${base}-${n}${ext}`;
  return candidate;
};

const filesUnder = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile())
    .map((e) => path.relative(dir, path.join(e.parentPath ?? e.path, e.name)).split(path.sep).join('/'));

/**
 * Add a media item to a project and save it.
 *   source = file path  → uploaded like the admin (type from extension; images optimized unless optimize=false)
 *   source = folder     → Unity WebGL build: must contain index.html at its top level, copied to media/<folder>/
 *   source = https URL  → youtube / embed (type required, or guessed for YouTube links)
 */
export const addMedia = async (slug, source, { type, caption, title, optimize = true, cover = false } = {}) => {
  const project = getProject(slug);
  const taken = new Set(project.mediaFiles.map((f) => f.path));
  let item;

  if (isExternal(source)) {
    type ||= youTubeId(source) ? 'youtube' : 'embed';
    if (MEDIA_TYPES[type]?.source !== 'url') throw fail(400, `"${type}" media is not a URL type (use youtube or embed)`);
    if (type === 'youtube' && !youTubeId(source)) throw fail(400, 'That does not look like a YouTube link');
    item = { type, src: source };
  } else {
    if (!fs.existsSync(source)) throw fail(404, `No such file or folder: ${source}`);
    if (fs.statSync(source).isDirectory()) {
      type ||= 'unity';
      if (MEDIA_TYPES[type]?.source !== 'folder') throw fail(400, `"${type}" media is not uploaded as a folder`);
      const entry = MEDIA_TYPES[type].entry;
      if (!fs.existsSync(path.join(source, entry))) {
        throw fail(400, `"${path.basename(source)}" has no ${entry} at its top level — pass the Unity build output folder.`);
      }
      let folder = slugify(path.basename(path.resolve(source)));
      while ([...taken].some((p) => p.startsWith(folder + '/'))) folder += '-new';
      for (const rel of filesUnder(source)) {
        await writeMediaFile(slug, `${folder}/${rel}`, fs.readFileSync(path.join(source, rel)));
      }
      item = { type, src: `${folder}/${entry}`, title: title || 'Play in browser' };
    } else {
      type ||= detectMediaType(source);
      if (!type) throw fail(400, `Can't tell the media type of "${path.basename(source)}" — pass --type`);
      if (MEDIA_TYPES[type]?.source !== 'file') throw fail(400, `"${type}" media is not uploaded as a single file`);
      const name = uniqueName(taken, path.basename(source));
      const { path: rel } = await writeMediaFile(slug, name, fs.readFileSync(source), { optimize: optimize && type === 'image' });
      item = { type, src: rel };
    }
  }

  if (caption && MEDIA_TYPES[type].placement !== 'playable') item.caption = caption;
  if (title && MEDIA_TYPES[type].placement === 'playable') item.title = title;
  const next = { ...project, media: [...(project.media || []), item] };
  if (cover && type === 'image') next.cover = item.src;
  saveProject(slug, next);
  return { slug, added: item, index: next.media.length - 1 };
};

/**
 * Remove a media item (by list index or src) and save; clears `cover` if it pointed there,
 * and trashes the file (or the whole build folder) once nothing else references it.
 */
export const removeMedia = (slug, which) => {
  const project = getProject(slug);
  const media = project.media || [];
  const index = /^\d+$/.test(String(which)) ? Number(which) : media.findIndex((m) => m.src === which);
  const item = media[index];
  if (!item) throw fail(404, `${slug} has no media item ${JSON.stringify(which)}`);
  const next = media.filter((_, i) => i !== index);
  saveProject(slug, { ...project, media: next, ...(project.cover === item.src ? { cover: null } : {}) });
  let trashed = null;
  if (!isExternal(item.src)) {
    const target = MEDIA_TYPES[item.type]?.source === 'folder' ? item.src.split('/')[0] : item.src;
    const stillUsed = next.some((m) => m.src === item.src || m.src.startsWith(target + '/'));
    if (!stillUsed) trashed = deleteMediaFile(slug, target).trashed ?? null;
  }
  return { slug, removed: item, trashed };
};

/* ── Order, theme, site ───────────────────────────────────────────────── */

export const readOrder = () => readJson(ORDER_FILE, []);

export const saveOrder = (order) => {
  if (!Array.isArray(order) || order.some((s) => typeof s !== 'string')) throw fail(400, 'Order must be an array of slugs');
  writeJson(ORDER_FILE, order);
  return { ok: true };
};

export const readTheme = () => readJson(THEME_FILE, { active: null, presets: {} });

export const saveTheme = (theme) => {
  if (!theme || typeof theme !== 'object' || Array.isArray(theme)) throw fail(400, 'Theme must be a JSON object');
  writeJson(THEME_FILE, theme);
  return { ok: true };
};

const siteFile = (id) => {
  if (!SITE_FILES.includes(id)) throw fail(404, `No site file "${id}" (one of: ${SITE_FILES.join(', ')})`);
  return path.join(SITE_DIR, `${id}.json`);
};

export const readSite = (id) => readJson(siteFile(id), {});

export const saveSite = (id, data) => {
  writeJson(siteFile(id), data);
  return { ok: true };
};

/* ── Site layout (pages → sections) ───────────────────────────────────── */

export const readLayout = () => readJson(LAYOUT_FILE, { pages: [] });

/**
 * Save layout.json — refused (nothing written) when it fails validateLayout. Stored normalized:
 * pages in order, canonical key order, options only where they differ from the defaults.
 */
export const saveLayout = (layout) => {
  const errors = validateLayout(layout);
  if (errors.length) throw fail(422, `content/site/layout.json would be invalid — nothing saved (${errors.length} problem${errors.length > 1 ? 's' : ''})`, errors);
  const next = normalizeLayout(layout);
  writeJson(LAYOUT_FILE, next);
  return { ok: true, layout: next };
};

/** Apply a layout edit (siteLayout.js helper) and save; a bad reference becomes a 404. */
export const editLayout = (edit) => {
  let next;
  try { next = edit(readLayout()); } catch (e) { throw e.status ? e : fail(404, e.message); }
  return saveLayout(next).layout;
};

/* ── Validation ───────────────────────────────────────────────────────── */

/**
 * Whole-content check: schema errors (blocking for published projects, warnings for drafts),
 * missing local media, order.json problems, unparseable site/theme JSON, an invalid site layout
 * (unknown section types, duplicate ids, no enabled page…) and a dangling theme.active.
 */
export const validateAll = () => {
  const errors = [];
  const warnings = [];
  let projects = [];
  try { projects = loadProjects(); } catch (e) { errors.push(e.message); }

  for (const p of projects) {
    for (const e of validateProject(p)) (p.draft ? warnings : errors).push(`${p.slug}: ${e}${p.draft ? ' (draft)' : ''}`);
    const srcs = [p.cover, ...(p.media || []).map((m) => m.src)].filter((s) => s && !isExternal(s));
    for (const src of new Set(srcs)) {
      if (!fs.existsSync(path.join(PROJECTS_DIR, p.slug, 'media', src))) errors.push(`${p.slug}: missing media/${src}`);
    }
  }

  const order = readJson(ORDER_FILE, null);
  if (!Array.isArray(order)) errors.push('projects/order.json is missing or not a JSON array');
  else {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const s of order) if (!slugs.has(s)) errors.push(`order.json lists unknown project "${s}"`);
    if (new Set(order).size !== order.length) errors.push('order.json has duplicates');
  }

  for (const file of [THEME_FILE, LAYOUT_FILE, ...SITE_FILES.map((n) => path.join(SITE_DIR, `${n}.json`))]) {
    try { JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { errors.push(`${path.relative(CONTENT_DIR, file)}: ${e.message}`); }
  }
  if (fs.existsSync(LAYOUT_FILE)) for (const e of validateLayout(readLayout())) errors.push(`site/layout.json: ${e}`);
  const theme = readTheme();
  if (theme.active && !theme.presets?.[theme.active]) errors.push(`theme.json: active preset "${theme.active}" does not exist`);

  return { ok: errors.length === 0, projects: projects.length, errors, warnings };
};

/* ── State + release ──────────────────────────────────────────────────── */

export const gitInfo = async () => {
  const branch = (await run('git', ['rev-parse', '--abbrev-ref', 'HEAD'])).out.trim();
  const status = (await run('git', ['status', '--porcelain', '--untracked-files=all'])).out;
  const changes = status.split('\n').filter(Boolean).map((l) => ({ code: l.slice(0, 2).trim(), file: l.slice(3).replace(/^"|"$/g, '') }));
  const remote = (await run('git', ['remote', 'get-url', 'origin'])).out.trim();
  const m = remote.match(/github[^:/]*[:/]([^/]+\/[^/]+?)(\.git)?$/);
  return {
    branch,
    changes,
    contentChanges: changes.filter((c) => c.file.startsWith('content/')).length,
    otherChanges: changes.filter((c) => !c.file.startsWith('content/')).length,
    actionsUrl: m ? `https://github.com/${m[1]}/actions` : null,
  };
};

export const state = async () => ({
  projects: listProjects(),
  theme: readTheme(),
  site: Object.fromEntries(SITE_FILES.map((n) => [n, readJson(path.join(SITE_DIR, `${n}.json`), {})])),
  layout: readLayout(),
  git: await gitInfo().catch((e) => ({ error: e.message, changes: [] })),
  release: testState(),
});

const assertPublishable = () => {
  const invalid = loadProjects({ includeDrafts: false }).map((p) => [p.slug, validateProject(p)]).filter(([, e]) => e.length);
  if (invalid.length) throw new Error('Fix these before testing:\n' + invalid.map(([s, e]) => `  ${s}: ${e.join('; ')}`).join('\n'));
};

/** Stage and Go live only ship content that passed Test unchanged. */
const requireTested = () => {
  const t = testState();
  if (!t.testedFingerprint) throw new Error('Run Test first.');
  if (t.testedFingerprint !== contentFingerprint()) throw new Error('Content changed since the last Test — run Test again.');
};

const commitContent = async (message, log) => {
  log('▶ Committing content/ …\n');
  await run('git', ['add', '-A', 'content'], log);
  const staged = (await run('git', ['diff', '--cached', '--name-only'])).out.trim();
  if (staged) await run('git', ['commit', '-m', message?.trim() || 'Update portfolio content'], log);
  else log('No new content changes to commit.\n');
};

const viteBuild = (log) => run(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'build'], log);

/**
 * Test: validate + production build, then mark this exact content as tested.
 * With `serve` (the admin always serves) dist/ is previewed at localhost:4173.
 */
export const releaseTest = async (log, { serve = true } = {}) => {
  assertPublishable();
  const fingerprint = contentFingerprint();
  log('▶ Production build…\n');
  await viteBuild(log);
  const url = serve ? await startPreview(log) : null;
  markTested(fingerprint, url);
  log(serve
    ? `\n✅ Test build is running at ${url}\nClick through it — Go live unlocks for exactly this content.\n`
    : '\n✅ Test build passed — Stage / Go live unlock for exactly this content.\n');
  return { fingerprint, url };
};

export const releaseStage = async (message, log) => {
  requireTested();
  await commitContent(message, log);
  log('\n▶ Pushing to the staging branch…\n');
  // staging mirrors whatever is being reviewed, so it is overwritten rather than merged
  await run('git', ['push', '--force', 'origin', 'HEAD:staging'], log);
  log('\n✅ Pushed to staging. CI deploys it to the staging site (see docs/release.md).\n');
};

export const releasePublish = async (message, log) => {
  requireTested();
  const branch = (await run('git', ['rev-parse', '--abbrev-ref', 'HEAD'])).out.trim();
  if (branch !== 'master') throw new Error(`Go live publishes master, but you are on "${branch}".`);
  await commitContent(message, log);
  log('\n▶ Pushing master…\n');
  await run('git', ['push', 'origin', 'HEAD:master'], log);
  log('\n✅ Live push done. GitHub Actions is building and deploying (usually 1–2 minutes).\n');
};
