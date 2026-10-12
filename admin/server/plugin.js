/**
 * Vite plugin: the local admin's HTTP API, mounted at /__admin/api on the dev server.
 *
 * Dev-server only (apply: 'serve') — nothing here ships in `vite build`. Vite binds to
 * localhost by default; don't run `npm run admin -- --host` on an untrusted network,
 * since this API writes files and runs git.
 */
import { handleApi } from './api.js';
import { stopPreview } from './release.js';

export default function adminPlugin() {
  return {
    name: 'portfolio-admin',
    apply: 'serve',
    configureServer(server) {
      // The Test preview is a child process; don't leave it holding port 4173 after a restart
      server.httpServer?.once('close', stopPreview);
      process.once('exit', stopPreview);

      server.middlewares.use('/__admin/api', (req, res) => {
        handleApi(req, res, server).catch((err) => {
          res.statusCode = err.status || 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message, ...(err.details ? { details: err.details } : {}) }));
        });
      });
      // /admin → /admin/ so relative asset URLs resolve
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin') {
          res.statusCode = 302;
          res.setHeader('Location', '/admin/');
          return res.end();
        }
        next();
      });
    },
  };
}
