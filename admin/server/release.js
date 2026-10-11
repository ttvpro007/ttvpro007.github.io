/**
 * Release gate: remembers which exact state passed Test, and runs the local
 * production preview (`vite preview` of dist/) that Test serves.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import { CONTENT_DIR } from '../../plugins/content.js';

const ROOT = path.resolve('.');
const PREVIEW_PORT = 4173;
let preview = null;
const tested = { testedFingerprint: null, testedAt: null, url: null };

/**
 * Hash of everything that affects the published site: every file under content/
 * (path, size, mtime), the current commit, and any uncommitted code changes.
 */
export function contentFingerprint() {
  const h = crypto.createHash('sha1');
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else {
        const s = fs.statSync(p);
        h.update(`${path.relative(ROOT, p)}|${s.size}|${s.mtimeMs}\n`);
      }
    }
  };
  walk(CONTENT_DIR);
  const git = (...args) => { try { return execFileSync('git', args, { cwd: ROOT }).toString(); } catch { return ''; } };
  h.update(git('rev-parse', 'HEAD'));
  h.update(git('diff', 'HEAD', '--', '.', ':!content'));
  return h.digest('hex');
}

export const testState = () => ({
  ...tested,
  previewRunning: !!preview,
  upToDate: !!tested.testedFingerprint && tested.testedFingerprint === contentFingerprint(),
});

export const markTested = (fingerprint, url) => Object.assign(tested, { testedFingerprint: fingerprint, testedAt: Date.now(), url });

export function stopPreview() {
  preview?.kill();
  preview = null;
}

/** Serve dist/ like production would; resolves with its URL once it is listening. */
export function startPreview(log) {
  stopPreview();
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', String(PREVIEW_PORT), '--strictPort'], { cwd: ROOT });
    preview = child;
    const timer = setTimeout(() => reject(new Error('Preview server did not start within 20s')), 20000);
    const onData = (d) => {
      // eslint-disable-next-line no-control-regex -- strip terminal color codes
      const text = d.toString().replace(/\x1b\[[0-9;]*m/g, '');
      log(text);
      if (text.includes(`:${PREVIEW_PORT}`)) {
        clearTimeout(timer);
        resolve(`http://localhost:${PREVIEW_PORT}/`);
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', (code) => {
      if (preview === child) preview = null;
      clearTimeout(timer);
      if (code) reject(new Error(`Preview server exited with code ${code} (is port ${PREVIEW_PORT} busy?)`));
    });
  });
}
