// Drives `npm run content` (admin/cli.js) against a throwaway copy of content/,
// so the real content is never touched.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const CLI = path.resolve('admin/cli.js');
let root;
let scratch;

before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-cli-'));
  scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-cli-files-'));
  fs.cpSync(path.resolve('content/site'), path.join(root, 'content/site'), { recursive: true });
  fs.copyFileSync(path.resolve('content/theme.json'), path.join(root, 'content/theme.json'));
  fs.mkdirSync(path.join(root, 'content/projects'), { recursive: true });
  fs.writeFileSync(path.join(root, 'content/projects/order.json'), '[]\n');
});

after(() => {
  fs.rmSync(root, { recursive: true, force: true });
  fs.rmSync(scratch, { recursive: true, force: true });
});

const cli = (args, input) => {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    env: { ...process.env, PORTFOLIO_ROOT: root }, input, encoding: 'utf8', cwd: scratch,
  });
  let json;
  try { json = JSON.parse(r.stdout); } catch { /* not JSON */ }
  return { code: r.status, out: r.stdout, err: r.stderr, json };
};

const ok = (args, input) => {
  const r = cli(args, input);
  assert.equal(r.code, 0, `${args.join(' ')} failed: ${r.err}`);
  return r.json;
};

const projectJson = (slug) => JSON.parse(fs.readFileSync(path.join(root, 'content/projects', slug, 'project.json'), 'utf8'));
const order = () => JSON.parse(fs.readFileSync(path.join(root, 'content/projects/order.json'), 'utf8'));

test('help: global and per command', () => {
  assert.match(cli(['--help']).out, /Commands:[\s\S]*media/);
  assert.match(cli(['update', '--help']).out, /--set field=value/);
  assert.equal(cli(['nope']).code, 2);
  assert.equal(cli(['list', '--bogus']).code, 2);
});

test('create → draft project, first in order', () => {
  assert.deepEqual(ok(['create', 'Space', 'Game']).slug, 'space-game');
  assert.equal(ok(['create', 'Space Game']).slug, 'space-game-2');
  assert.deepEqual(order(), ['space-game-2', 'space-game']);
  assert.equal(projectJson('space-game').draft, true);
  assert.equal(ok(['list']).length, 2);
  ok(['delete', 'space-game-2']);
});

test('update coerces values by field kind', () => {
  const { project } = ok(['update', 'space-game', '--set', 'year=2023', '--set', 'tech=Unity, C#', '--set', 'featured=yes',
    '--set', 'description=A game about space', '--set', 'links=[{"type":"github","url":"https://github.com/x/y"}]']);
  assert.equal(project.year, 2023);
  assert.deepEqual(project.tech, ['Unity', 'C#']);
  assert.equal(project.featured, true);
  assert.equal(projectJson('space-game').links[0].type, 'github');
  assert.equal('slug' in projectJson('space-game'), false, 'derived keys are not stored');
});

test('update refuses bad input without writing', () => {
  const before = fs.readFileSync(path.join(root, 'content/projects/space-game/project.json'), 'utf8');
  assert.equal(cli(['update', 'space-game', '--set', 'year=soon']).code, 2);
  const typo = cli(['update', 'space-game', '--set', 'titel=x']);
  assert.equal(typo.code, 1);
  assert.match(typo.err, /Unknown project field/);
  // publishing an incomplete project fails validation
  const r = cli(['update', 'space-game', '--set', 'draft=false']);
  assert.equal(r.code, 1);
  assert.match(r.err, /Category is required/);
  assert.equal(fs.readFileSync(path.join(root, 'content/projects/space-game/project.json'), 'utf8'), before);
  assert.equal(cli(['show', 'missing']).code, 1);
});

test('update --json merges from stdin; show --field reads back', () => {
  ok(['update', 'space-game', '--json', '-'], JSON.stringify({ category: 'Game Dev', draft: false }));
  assert.equal(ok(['show', 'space-game', '--field', 'category']), 'Game Dev');
  assert.equal(projectJson('space-game').draft, false);
  assert.equal(projectJson('space-game').title, 'Space Game');
});

test('overview: write from stdin, read, clear', () => {
  ok(['overview', 'space-game', '--file', '-'], '# Space\n\nHello');
  assert.equal(ok(['overview', 'space-game']).overview, '# Space\n\nHello');
  assert.equal(cli(['overview', 'space-game', '--raw']).out, '# Space\n\nHello');
  ok(['overview', 'space-game', '--clear']);
  assert.equal(ok(['overview', 'space-game']).overview, null);
});

test('media add: large PNG → WebP, URL, Unity folder check; remove trashes unused files', async () => {
  const png = path.join(scratch, 'Big Shot.png');
  fs.writeFileSync(png, await sharp(crypto.randomBytes(2600 * 1200 * 3), { raw: { width: 2600, height: 1200, channels: 3 } }).png().toBuffer());
  const img = ok(['media', 'add', 'space-game', 'Big Shot.png', '--caption', 'Orbit', '--cover']);
  assert.deepEqual(img.added, { type: 'image', src: 'big-shot.webp', caption: 'Orbit' });
  assert.equal(projectJson('space-game').cover, 'big-shot.webp');

  assert.equal(ok(['media', 'add', 'space-game', 'https://youtu.be/t8yccMvoEUc']).added.type, 'youtube');
  assert.equal(cli(['media', 'add', 'space-game', 'https://example.com/x', '--type', 'youtube']).code, 1);

  const bad = path.join(scratch, 'NotABuild');
  fs.mkdirSync(path.join(bad, 'Build'), { recursive: true });
  fs.writeFileSync(path.join(bad, 'Build/game.wasm'), 'x');
  const r = cli(['media', 'add', 'space-game', bad]);
  assert.equal(r.code, 1);
  assert.match(r.err, /no index\.html/);

  fs.writeFileSync(path.join(bad, 'index.html'), '<html></html>');
  const unity = ok(['media', 'add', 'space-game', bad]);
  assert.deepEqual(unity.added, { type: 'unity', src: 'notabuild/index.html', title: 'Play in browser' });
  assert.ok(fs.existsSync(path.join(root, 'content/projects/space-game/media/notabuild/Build/game.wasm')));

  assert.equal(ok(['validate']).ok, true);

  const removed = ok(['media', 'remove', 'space-game', 'big-shot.webp']);
  assert.ok(removed.trashed.startsWith('.trash'));
  assert.equal(projectJson('space-game').cover, null);
  ok(['media', 'remove', 'space-game', '1']); // the unity build (youtube is now index 0)
  assert.ok(!fs.existsSync(path.join(root, 'content/projects/space-game/media/notabuild')));
  assert.deepEqual(ok(['media', 'list', 'space-game']).media.map((m) => m.type), ['youtube']);
});

test('rename, order set/move, delete', () => {
  ok(['create', 'Other']);
  assert.equal(ok(['rename', 'space-game', 'Star Game']).slug, 'star-game');
  assert.deepEqual(order(), ['other', 'star-game']);
  assert.deepEqual(ok(['order', 'move', 'other', '1']), ['star-game', 'other']);
  assert.deepEqual(ok(['order', 'set', 'other', 'star-game']), ['other', 'star-game']);
  assert.equal(cli(['order', 'set', 'other', 'ghost']).code, 1);
  ok(['delete', 'other']);
  assert.deepEqual(order(), ['star-game']);
  assert.ok(fs.readdirSync(path.join(root, '.trash')).some((f) => f.endsWith('-other')));
});

test('theme: active and preset edits', () => {
  const theme = ok(['theme']);
  ok(['theme', 'preset', 'test-dark', '--set', 'label=Test Dark', '--set', 'colors.primary=#112233', '--set', 'radius=4']);
  const preset = ok(['theme', 'preset', 'test-dark']);
  assert.deepEqual([preset.colors.primary, preset.radius], ['#112233', 4]);
  assert.deepEqual(ok(['theme', 'active', 'test-dark']), { active: 'test-dark' });
  assert.equal(cli(['theme', 'active', 'ghost']).code, 1);
  assert.equal(cli(['theme', 'preset', 'test-dark', '--delete']).code, 1, 'active preset cannot be deleted');
  ok(['theme', 'active', theme.active]);
  ok(['theme', 'preset', 'test-dark', '--delete']);
  assert.deepEqual(ok(['theme']), theme);
});

test('site: get, set dotted path, unknown id', () => {
  assert.ok(ok(['site']).includes('profile'));
  ok(['site', 'contact', '--set', 'cliTest.value=hello']);
  assert.equal(ok(['site', 'contact', '--field', 'cliTest.value']), 'hello');
  ok(['site', 'contact', '--unset', 'cliTest']);
  assert.equal(ok(['site', 'contact', '--field', 'cliTest']), null);
  assert.equal(cli(['site', 'nope']).code, 1);
});

test('layout: pages and sections, validated', () => {
  const layoutJson = () => JSON.parse(fs.readFileSync(path.join(root, 'content/site/layout.json'), 'utf8'));
  assert.deepEqual(ok(['layout']).pages.map((p) => p.id), ['home', 'projects', 'resume', 'contact']);
  assert.ok(ok(['layout', 'types']).hero.options.profilePicSize);
  assert.equal(ok(['layout', 'show', 'home']).sections[0].type, 'hero');

  // pages: add, move, disable, set
  assert.equal(ok(['layout', 'page', 'add', 'blog', '--label', 'Blog', '--position', '1'])[1].id, 'blog');
  assert.deepEqual(ok(['layout', 'page', 'move', 'blog', '3']).map((p) => p.id), ['home', 'projects', 'resume', 'blog', 'contact']);
  assert.equal(ok(['layout', 'page', 'disable', 'blog']).find((p) => p.id === 'blog').enabled, false);
  ok(['layout', 'page', 'set', 'blog', '--slug', 'notes']);
  assert.equal(layoutJson().pages.find((p) => p.id === 'blog').slug, 'notes');
  assert.equal(cli(['layout', 'page', 'add', 'home']).code, 1, 'duplicate page id');
  assert.equal(cli(['layout', 'page', 'set', 'blog', '--slug', 'home']).code, 1, 'duplicate slug');

  // sections: add (typed options), move, toggle, set, remove
  const blog = ok(['layout', 'section', 'add', 'blog', 'hero', '--set', 'profilePicSize=small', '--set', 'showSocialLinks=false']);
  assert.deepEqual(blog.sections[0], { id: 'hero', type: 'hero', enabled: true, options: { profilePicSize: 'small', showSocialLinks: false } });
  assert.equal(ok(['layout', 'section', 'add', 'blog', 'hero']).sections[1].id, 'hero-2');
  assert.deepEqual(ok(['layout', 'section', 'move', 'blog', 'hero-2', '0']).sections.map((s) => s.id), ['hero-2', 'hero']);
  assert.equal(ok(['layout', 'section', 'disable', 'blog', '1']).sections[1].enabled, false);
  assert.equal(ok(['layout', 'section', 'set', 'blog', 'hero', '--set', 'profilePicSize=large']).sections[1].options.profilePicSize, 'large');
  assert.equal(ok(['layout', 'section', 'set', 'blog', 'hero', '--unset', 'profilePicSize', '--unset', 'showSocialLinks']).sections[1].options, undefined);
  assert.equal(ok(['layout', 'section', 'remove', 'blog', 'hero-2']).sections.length, 1);

  // refusals leave the file alone
  const before = fs.readFileSync(path.join(root, 'content/site/layout.json'), 'utf8');
  assert.equal(cli(['layout', 'section', 'add', 'blog', 'nope']).code, 1);
  assert.match(cli(['layout', 'section', 'set', 'blog', 'hero', '--set', 'profilePicSize=huge']).err, /must be one of small, medium, large/);
  assert.match(cli(['layout', 'section', 'set', 'blog', 'hero', '--set', 'colour=red']).err, /no option "colour"/);
  assert.equal(cli(['layout', 'section', 'remove', 'blog', 'ghost']).code, 1);
  for (const id of ['home', 'projects', 'resume']) ok(['layout', 'page', 'disable', id]);
  const last = cli(['layout', 'page', 'disable', 'contact']);
  assert.equal(last.code, 1);
  assert.match(last.err, /at least one page must be enabled/);
  assert.equal(cli(['layout', 'section', 'move', 'blog', 'hero', 'x']).code, 2);
  for (const id of ['home', 'projects', 'resume']) ok(['layout', 'page', 'enable', id]);
  ok(['layout', 'page', 'remove', 'blog']);
  assert.notEqual(fs.readFileSync(path.join(root, 'content/site/layout.json'), 'utf8'), before);
  assert.deepEqual(layoutJson(), JSON.parse(fs.readFileSync(path.resolve('content/site/layout.json'), 'utf8')), 'back to the default');

  // validate reports a hand-broken layout
  const broken = layoutJson();
  broken.pages[0].sections.push({ id: 'x', type: 'carousel' });
  fs.writeFileSync(path.join(root, 'content/site/layout.json'), JSON.stringify(broken));
  assert.match(cli(['validate']).json.errors.join('\n'), /unknown section type "carousel"/);
  fs.writeFileSync(path.join(root, 'content/site/layout.json'), before);
});

test('validate fails with errors on broken content', () => {
  fs.writeFileSync(path.join(root, 'content/projects/order.json'), '["star-game","ghost"]\n');
  const r = cli(['validate']);
  assert.equal(r.code, 1);
  assert.equal(r.json.ok, false);
  assert.match(r.json.errors.join('\n'), /unknown project "ghost"/);
});
