// Checks the committed content the way a build would read it, so broken JSON,
// missing media files or a stale order.json fail CI instead of the live site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadProjects, CONTENT_DIR, PROJECTS_DIR, ORDER_FILE } from '../plugins/content.js';

const isUrl = (src) => /^https?:\/\//.test(src);
const projects = loadProjects();

test('every project has a title', () => {
  assert.ok(projects.length > 0);
  for (const p of projects) assert.ok(p.title, `${p.slug} has no title`);
});

test('every local cover and media file exists', () => {
  for (const p of projects) {
    const srcs = [p.cover, ...(p.media || []).map((m) => m.src)].filter((s) => s && !isUrl(s));
    for (const src of srcs) {
      assert.ok(fs.existsSync(path.join(PROJECTS_DIR, p.slug, 'media', src)), `${p.slug}: missing media/${src}`);
    }
  }
});

test('order.json lists only existing projects, once each', () => {
  const order = JSON.parse(fs.readFileSync(ORDER_FILE, 'utf8'));
  const slugs = new Set(projects.map((p) => p.slug));
  for (const slug of order) assert.ok(slugs.has(slug), `order.json lists unknown project "${slug}"`);
  assert.equal(new Set(order).size, order.length, 'order.json has duplicates');
});

test('site and theme JSON parse', () => {
  const files = [...fs.readdirSync(path.join(CONTENT_DIR, 'site')).map((f) => path.join('site', f)), 'theme.json'];
  for (const f of files) assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')), f);
});
