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
 *   PUT    /layout                        content/site/layout.json body (validated; 422 with details if not)
 *   POST   /test                          validate + production build + serve dist/ at localhost:4173 → { job }
 *   POST   /test/stop                     stop the local test server
 *   POST   /stage                         { message } → commit content/, push to the `staging` branch → { job }
 *   POST   /publish                       { message } → go live: requires a passing test of the current content → { job }
 *   GET    /jobs/:id                      { status, log }
 *
 * Release flow: edit → Test (local production build) → optional Stage (staging site) → Go live.
 * The operations themselves live in store.js, shared with the headless CLI (admin/cli.js).
 */
import * as store from './store.js';
import { startJob, getJob } from './jobs.js';
import { stopPreview } from './release.js';

const { fail } = store;

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

export async function handleApi(req, res) {
  const url = new URL(req.url, 'http://local');
  const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const route = `${req.method} /${parts.map((p, i) => (i === 1 && ['projects', 'site', 'jobs'].includes(parts[0]) ? ':id' : p)).join('/')}`;
  const id = parts[1];

  switch (route) {
    case 'GET /state':
      return send(res, await store.state());

    case 'POST /projects':
      return send(res, store.createProject((await readJsonBody(req)).title), 201);

    case 'PUT /projects/:id':
      return send(res, store.saveProject(id, await readJsonBody(req)));

    case 'POST /projects/:id/rename':
      return send(res, store.renameProject(id, (await readJsonBody(req)).slug));

    case 'DELETE /projects/:id':
      return send(res, store.deleteProject(id));

    case 'PUT /projects/:id/overview':
      return send(res, store.writeOverview(id, (await readBody(req)).toString('utf8')));

    case 'POST /projects/:id/media': {
      const rel = url.searchParams.get('path') || '';
      const optimize = url.searchParams.get('optimize') === '1';
      return send(res, await store.writeMediaFile(id, rel, await readBody(req), { optimize }), 201);
    }

    case 'DELETE /projects/:id/media':
      return send(res, store.deleteMediaFile(id, url.searchParams.get('path') || ''));

    case 'PUT /order':
      return send(res, store.saveOrder(await readJsonBody(req)));

    case 'PUT /theme':
      return send(res, store.saveTheme(await readJsonBody(req)));

    case 'PUT /site/:id':
      return send(res, store.saveSite(id, await readJsonBody(req)));

    case 'PUT /layout':
      return send(res, store.saveLayout(await readJsonBody(req)));

    case 'POST /test':
      return send(res, { job: startJob('test', (log) => store.releaseTest(log)) });

    case 'POST /test/stop':
      stopPreview();
      return send(res, { ok: true });

    case 'POST /stage': {
      const { message } = await readJsonBody(req);
      return send(res, { job: startJob('stage', (log) => store.releaseStage(message, log)) });
    }

    case 'POST /publish': {
      const { message } = await readJsonBody(req);
      return send(res, { job: startJob('publish', (log) => store.releasePublish(message, log)) });
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
