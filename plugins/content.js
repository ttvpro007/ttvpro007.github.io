/**
 * Vite plugin: turns content/projects/* into site data.
 *
 *   content/projects/<slug>/project.json   project fields, media list, links
 *   content/projects/<slug>/overview.md    optional long-form write-up
 *   content/projects/<slug>/media/**       images, videos, Unity builds…
 *   content/projects/order.json            display order (array of slugs)
 *
 * Exposes `virtual:projects` (array of stored projects, ordered, with slug +
 * overview). Media is served at <base>projects/<slug>/… in dev and copied to
 * dist/projects/<slug>/ on build. Projects marked draft are dropped from builds.
 */
import fs from 'node:fs';
import path from 'node:path';

const VIRTUAL_ID = 'virtual:projects';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

export const CONTENT_DIR = path.resolve('content');
export const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects');
export const ORDER_FILE = path.join(PROJECTS_DIR, 'order.json');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.wasm': 'application/wasm', '.data': 'application/octet-stream', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.mov': 'video/quicktime', '.md': 'text/markdown',
};

const readJson = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
};

/** All project folders in display order (order.json first, the rest newest-first). */
export const loadProjects = ({ includeDrafts = true } = {}) => {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  const slugs = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(PROJECTS_DIR, d.name, 'project.json')))
    .map((d) => d.name);

  const projects = slugs.map((slug) => {
    const dir = path.join(PROJECTS_DIR, slug);
    const data = readJson(path.join(dir, 'project.json'), null);
    if (!data) throw new Error(`content/projects/${slug}/project.json is not valid JSON`);
    const overviewFile = path.join(dir, 'overview.md');
    return { ...data, slug, overview: fs.existsSync(overviewFile) ? fs.readFileSync(overviewFile, 'utf8') : null };
  });

  const order = readJson(ORDER_FILE, []);
  const rank = (p) => { const i = order.indexOf(p.slug); return i === -1 ? Infinity : i; };
  projects.sort((a, b) => rank(a) - rank(b) || (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title));
  return includeDrafts ? projects : projects.filter((p) => !p.draft);
};

/** Resolve a URL path under a project's media folder, refusing anything that escapes it. */
const mediaFile = (slug, rel) => {
  const root = path.join(PROJECTS_DIR, slug, 'media');
  const file = path.resolve(root, decodeURIComponent(rel));
  return file.startsWith(root + path.sep) ? file : null;
};

export default function contentPlugin() {
  let config;
  let isBuild = false;

  return {
    name: 'portfolio-content',

    configResolved(c) {
      config = c;
      isBuild = c.command === 'build';
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id !== RESOLVED_ID) return;
      // Dev reloads come from the watcher in configureServer; builds read content once
      const projects = loadProjects({ includeDrafts: !isBuild });
      return `export default ${JSON.stringify(projects)};`;
    },

    configureServer(server) {
      server.watcher.add(PROJECTS_DIR);
      const onChange = (file) => {
        if (!file.startsWith(PROJECTS_DIR) || file.includes(`${path.sep}media${path.sep}`)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        // Only the site listens (src/data/index.js) — a full-reload would also reset the admin
        server.ws.send({ type: 'custom', event: 'portfolio:content-changed' });
      };
      server.watcher.on('change', onChange);
      server.watcher.on('add', onChange);
      server.watcher.on('unlink', onChange);

      // Serve <base>projects/<slug>/<file> from content/projects/<slug>/media/<file>
      const prefix = `${config.base}projects/`;
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0];
        if (!url.startsWith(prefix)) return next();
        const [slug, ...rest] = url.slice(prefix.length).split('/');
        const file = rest.length && mediaFile(slug, rest.join('/'));
        if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
        res.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-cache');
        fs.createReadStream(file).pipe(res);
      });
    },

    closeBundle() {
      if (!isBuild) return;
      const outDir = path.resolve(config.root, config.build.outDir);
      for (const { slug } of loadProjects({ includeDrafts: false })) {
        const src = path.join(PROJECTS_DIR, slug, 'media');
        if (fs.existsSync(src)) fs.cpSync(src, path.join(outDir, 'projects', slug), { recursive: true });
      }
    },
  };
}
