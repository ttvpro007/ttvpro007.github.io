/**
 * Admin API routes. All paths are relative to /__admin/api.
 *
 *   GET    /state                         everything the admin needs in one call
 *   POST   /projects                      { title } → create a draft project
 *   PUT    /projects/:slug                project.json body → save
 *   POST   /projects/:slug/rename         { slug } → rename the folder
 *   DELETE /projects/:slug                move the folder to .trash/
 *   PUT    /projects/:slug/overview       text body → overview.md (empty deletes it)
 *   POST   /projects/:slug/media?path=…&optimize=1   raw file body → media/<path>
 *   DELETE /projects/:slug/media?path=…   move a media file/folder to .trash/
 *   PUT    /order                         [slug, …]
 *   PUT    /theme                         theme.json body
 *   PUT    /site/:name                    content/site/<name>.json body
 *   POST   /test                          validate + production build + serve dist/ at localhost:4173 → { job }
 *   POST   /test/stop                     stop the local test server
 *   POST   /stage                         { message } → commit content/, push to the `staging` branch → { job }
 *   POST   /publish                       { message } → go live: requires a passing test of the current content → { job }
 *   GET    /jobs/:id                      { status, log }
 *
 * Release flow: edit → Test (local production build) → optional Stage (staging site) → Go live.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadProjects, PROJECTS_DIR, ORDER_FILE, CONTENT_DIR } from '../../plugins/content.js';
import { slugify, emptyProject, validateProject } from '../../src/lib/content/projectSchema.js';
import { optimizeImage } from './media.js';
import { startJob, getJob, run } from './jobs.js';
import { contentFingerprint, startPreview, stopPreview, testState, markTested } from './release.js';

const ROOT = path.resolve('.');
const TRASH = path.join(ROOT, '.trash');
const SITE_DIR = path.join(CONTENT_DIR, 'site');
const THEME_FILE = path.join(CONTENT_DIR, 'theme.json');
const SITE_FILES = ['profile', 'navigation', 'uiContent', 'contact'];

const fail = (status, message) => Object.assign(new Error(message), { status });

const send = (res, data, status = 200) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

const readBody = (req, limit = 2 * 1024 ** 3) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) reject(fail(413, 'Upload too large'));
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

const readJsonBody = async (req) => {
  try { return JSON.parse((await readBody(req, 20 * 1024 ** 2)).toString('utf8')); } catch { throw fail(400, 'Body is not valid JSON'); }
};

const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
};

const readJson = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
};

/** Resolve a path inside `base`, refusing traversal outside it. */
const inside = (base, rel = '') => {
  const p = path.resolve(base, rel);
  if (p !== base && !p.startsWith(base + path.sep)) throw fail(400, 'Path escapes its folder');
  return p;
};

const projectDir = (slug) => {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw fail(400, `Bad project slug "${slug}"`);
  return inside(PROJECTS_DIR, slug);
};

const toTrash = (p, label) => {
  const dest = path.join(TRASH, `${new Date().toISOString().replace(/[:.]/g, '-')}-${label}`);
  fs.mkdirSync(TRASH, { recursive: true });
  try {
    fs.renameSync(p, dest);
  } catch (err) {
    // Windows refuses to rename a folder the dev server's file watcher has open: copy, then remove
    if (err.code !== 'EPERM' && err.code !== 'EBUSY' && err.code !== 'EXDEV') throw err;
    fs.cpSync(p, dest, { recursive: true });
    fs.rmSync(p, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
  return path.relative(ROOT, dest);
};

/** Every file under a project's media/ folder, as forward-slash relative paths with sizes. */
const listMedia = (slug) => {
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

const gitInfo = async () => {
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

const state = async () => ({
  projects: loadProjects().map((p) => ({ ...p, mediaFiles: listMedia(p.slug), errors: validateProject(p) })),
  theme: readJson(THEME_FILE, { active: null, presets: {} }),
  site: Object.fromEntries(SITE_FILES.map((n) => [n, readJson(path.join(SITE_DIR, `${n}.json`), {})])),
  git: await gitInfo().catch((e) => ({ error: e.message, changes: [] })),
  release: testState(),
});

const STORED_KEYS = ['slug', 'overview', 'mediaFiles', 'errors'];
const cleanProject = (p) => Object.fromEntries(Object.entries(p).filter(([k]) => !STORED_KEYS.includes(k)));

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

export async function handleApi(req, res) {
  const url = new URL(req.url, 'http://local');
  const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const route = `${req.method} /${parts.map((p, i) => (i === 1 && ['projects', 'site', 'jobs'].includes(parts[0]) ? ':id' : p)).join('/')}`;
  const id = parts[1];

  switch (route) {
    case 'GET /state':
      return send(res, await state());

    case 'POST /projects': {
      const { title } = await readJsonBody(req);
      let slug = slugify(title);
      for (let n = 2; fs.existsSync(path.join(PROJECTS_DIR, slug)); n++) slug = `${slugify(title)}-${n}`;
      const dir = projectDir(slug);
      fs.mkdirSync(path.join(dir, 'media'), { recursive: true });
      writeJson(path.join(dir, 'project.json'), emptyProject(title));
      writeJson(ORDER_FILE, [slug, ...readJson(ORDER_FILE, [])]);
      return send(res, { slug }, 201);
    }

    case 'PUT /projects/:id': {
      const dir = projectDir(id);
      if (!fs.existsSync(dir)) throw fail(404, `No project "${id}"`);
      writeJson(path.join(dir, 'project.json'), cleanProject(await readJsonBody(req)));
      return send(res, { ok: true });
    }

    case 'POST /projects/:id/rename': {
      const to = slugify((await readJsonBody(req)).slug);
      const from = projectDir(id);
      const dest = projectDir(to);
      if (fs.existsSync(dest)) throw fail(409, `"${to}" already exists`);
      fs.renameSync(from, dest);
      writeJson(ORDER_FILE, readJson(ORDER_FILE, []).map((s) => (s === id ? to : s)));
      return send(res, { slug: to });
    }

    case 'DELETE /projects/:id': {
      const trashed = toTrash(projectDir(id), id);
      writeJson(ORDER_FILE, readJson(ORDER_FILE, []).filter((s) => s !== id));
      return send(res, { trashed });
    }

    case 'PUT /projects/:id/overview': {
      const file = path.join(projectDir(id), 'overview.md');
      const text = (await readBody(req)).toString('utf8');
      if (text.trim()) fs.writeFileSync(file, text);
      else if (fs.existsSync(file)) fs.rmSync(file);
      return send(res, { ok: true });
    }

    case 'POST /projects/:id/media': {
      const mediaRoot = path.join(projectDir(id), 'media');
      let rel = url.searchParams.get('path') || '';
      let data = await readBody(req);
      if (url.searchParams.get('optimize') === '1') ({ data, rel } = await optimizeImage(data, rel));
      const file = inside(mediaRoot, rel);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, data);
      return send(res, { path: rel, size: data.length }, 201);
    }

    case 'DELETE /projects/:id/media': {
      const target = inside(path.join(projectDir(id), 'media'), url.searchParams.get('path') || '');
      if (!fs.existsSync(target)) return send(res, { ok: true });
      return send(res, { trashed: toTrash(target, `${id}-${path.basename(target)}`) });
    }

    case 'PUT /order':
      writeJson(ORDER_FILE, await readJsonBody(req));
      return send(res, { ok: true });

    case 'PUT /theme':
      writeJson(THEME_FILE, await readJsonBody(req));
      return send(res, { ok: true });

    case 'PUT /site/:id': {
      if (!SITE_FILES.includes(id)) throw fail(404, `No site file "${id}"`);
      writeJson(path.join(SITE_DIR, `${id}.json`), await readJsonBody(req));
      return send(res, { ok: true });
    }

    case 'POST /test':
      return send(res, { job: startJob('test', async (log) => {
        assertPublishable();
        const fingerprint = contentFingerprint();
        log('▶ Production build…\n');
        await viteBuild(log);
        const url = await startPreview(log);
        markTested(fingerprint, url);
        log(`\n✅ Test build is running at ${url}\nClick through it — Go live unlocks for exactly this content.\n`);
      }) });

    case 'POST /test/stop':
      stopPreview();
      return send(res, { ok: true });

    case 'POST /stage': {
      const { message } = await readJsonBody(req);
      return send(res, { job: startJob('stage', async (log) => {
        requireTested();
        await commitContent(message, log);
        log('\n▶ Pushing to the staging branch…\n');
        // staging mirrors whatever is being reviewed, so it is overwritten rather than merged
        await run('git', ['push', '--force', 'origin', 'HEAD:staging'], log);
        log('\n✅ Pushed to staging. CI deploys it to the staging site (see docs/release.md).\n');
      }) });
    }

    case 'POST /publish': {
      const { message } = await readJsonBody(req);
      return send(res, { job: startJob('publish', async (log) => {
        requireTested();
        const branch = (await run('git', ['rev-parse', '--abbrev-ref', 'HEAD'])).out.trim();
        if (branch !== 'master') throw new Error(`Go live publishes master, but you are on "${branch}".`);
        await commitContent(message, log);
        log('\n▶ Pushing master…\n');
        await run('git', ['push', 'origin', 'HEAD:master'], log);
        log('\n✅ Live push done. GitHub Actions is building and deploying (usually 1–2 minutes).\n');
      }) });
    }

    case 'GET /jobs/:id': {
      const job = getJob(id);
      if (!job) throw fail(404, 'No such job');
      return send(res, job);
    }

    default:
      throw fail(404, `No route ${req.method} ${url.pathname}`);
  }
}
