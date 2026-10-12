// Drives `npm run content` (@loom/cli) against a throwaway copy of content/,
// so the real content is never touched.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const CLI = require.resolve('@loom/cli/cli.js');
// The copy has no node_modules, so its loom.config.js names the kit by file path
const KIT = require.resolve('@loom/kit-portfolio');
let root;
let scratch;

before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-cli-'));
  scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-cli-files-'));
  fs.cpSync(path.resolve('content/site'), path.join(root, 'content/site'), { recursive: true });
  fs.copyFileSync(path.resolve('content/theme.json'), path.join(root, 'content/theme.json'));
  fs.mkdirSync(path.join(root, 'content/projects'), { recursive: true });
  fs.writeFileSync(path.join(root, 'content/projects/order.json'), '[]\n');
  fs.writeFileSync(path.join(root, 'loom.config.js'), `export default { kit: ${JSON.stringify(KIT)} };\n`);
});

after(() => {
  fs.rmSync(root, { recursive: true, force: true });
  fs.rmSync(scratch, { recursive: true, force: true });
});

const cli = (args, input) => {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    env: { ...process.env, LOOM_ROOT: root }, input, encoding: 'utf8', cwd: scratch,
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
  const file = path.join(root, 'content/site/layout.json');
  const layoutJson = () => JSON.parse(fs.readFileSync(file, 'utf8'));
  const ids = (layout) => layout.pages.map((p) => p.id);
  const page = (layout, id) => layout.pages.find((p) => p.id === id);

  // reads: the whole tree in one call, one page, one section, the registry
  assert.deepEqual(ok(['layout']), layoutJson());
  assert.deepEqual(ok(['layout', 'show']), layoutJson());
  assert.equal(ok(['layout', 'show', 'home']).sections[0].type, 'hero');
  assert.deepEqual(ok(['layout', 'show', 'home', 'hero']), { type: 'hero', id: 'hero', enabled: true });
  const types = ok(['layout', 'types']);
  assert.equal(types.hero.options.profilePicSize.default, 'medium');
  assert.equal(types.hero.children, false);

  // pages: every edit prints the whole saved layout
  assert.deepEqual(ids(ok(['layout', 'page', 'add', 'blog', '--label', 'Blog', '--position', '1'])), ['home', 'blog', 'projects', 'resume', 'contact']);
  assert.deepEqual(ids(ok(['layout', 'page', 'move', 'blog', '3'])), ['home', 'projects', 'resume', 'blog', 'contact']);
  assert.equal(page(ok(['layout', 'page', 'disable', 'blog']), 'blog').enabled, false);
  assert.equal(page(ok(['layout', 'page', 'set', 'blog', '--slug', 'notes']), 'blog').slug, 'notes');
  assert.match(cli(['layout', 'page', 'add', 'home']).err, /already exists/);
  assert.match(cli(['layout', 'page', 'set', 'blog', '--slug', 'home']).err, /pages\[3\] "blog": duplicate slug "home"/);

  // sections: typed options, defaults not stored, move within and across pages
  let l = ok(['layout', 'section', 'add', 'blog', 'hero', '--set', 'profilePicSize=small', '--set', 'showSocialLinks=true']);
  assert.deepEqual(page(l, 'blog').sections[0], { type: 'hero', id: 'hero', enabled: true, options: { profilePicSize: 'small' } });
  assert.equal(page(ok(['layout', 'section', 'add', 'blog', 'hero']), 'blog').sections[1].id, 'hero-2');
  assert.deepEqual(page(ok(['layout', 'section', 'move', 'blog', 'hero-2', '0']), 'blog').sections.map((s) => s.id), ['hero-2', 'hero']);
  assert.equal(page(ok(['layout', 'section', 'disable', 'blog', '1']), 'blog').sections[1].enabled, false);
  assert.equal(page(ok(['layout', 'section', 'set', 'blog', 'hero', '--set', 'profilePicSize=large']), 'blog').sections[1].options.profilePicSize, 'large');
  assert.equal(page(ok(['layout', 'section', 'set', 'blog', 'hero', '--unset', 'profilePicSize']), 'blog').sections[1].options, undefined);
  l = ok(['layout', 'section', 'move', 'blog', 'hero-2', '0', '--to', 'contact']);
  assert.deepEqual(page(l, 'contact').sections.map((s) => s.id), ['hero-2', 'contactQuest']);
  assert.deepEqual(page(l, 'blog').sections.map((s) => s.id), ['hero']);
  assert.deepEqual(page(ok(['layout', 'section', 'move', 'contact', 'hero-2', '--to', 'blog']), 'blog').sections.map((s) => s.id), ['hero', 'hero-2']);
  assert.equal(page(ok(['layout', 'section', 'remove', 'blog', 'hero-2']), 'blog').sections.length, 1);

  // refusals leave the file alone and say how to fix it
  const before = fs.readFileSync(file, 'utf8');
  assert.match(cli(['layout', 'section', 'add', 'blog', 'nope']).err, /Unknown section type "nope" — use one of: hero/);
  assert.match(cli(['layout', 'section', 'set', 'blog', 'hero', '--set', 'profilePicSize=huge']).err, /must be one of small, medium, large/);
  assert.match(cli(['layout', 'section', 'set', 'blog', 'hero', '--set', 'colour=red']).err, /no option "colour" — its options are: profilePicSize, showSocialLinks/);
  assert.match(cli(['layout', 'section', 'remove', 'blog', 'ghost']).err, /its sections are: hero/);
  for (const id of ['home', 'projects', 'resume']) ok(['layout', 'page', 'disable', id]);
  const last = cli(['layout', 'page', 'disable', 'contact']);
  assert.equal(last.code, 1);
  assert.match(last.err, /content\/site\/layout\.json would be invalid — nothing saved[\s\S]*at least one page must be enabled/);
  assert.equal(cli(['layout', 'section', 'move', 'blog', 'hero', 'x']).code, 2);
  for (const id of ['home', 'projects', 'resume']) ok(['layout', 'page', 'enable', id]);
  ok(['layout', 'page', 'remove', 'blog']);
  assert.notEqual(fs.readFileSync(file, 'utf8'), before);
  assert.deepEqual(layoutJson(), JSON.parse(fs.readFileSync(path.resolve('content/site/layout.json'), 'utf8')), 'back to the default');

  // replace: whole file from stdin, validated and normalized
  const draft = layoutJson();
  draft.pages.reverse();
  draft.pages.find((p) => p.id === 'projects').sections[0].options = { showStats: true };
  const replaced = ok(['layout', 'replace', '-'], JSON.stringify(draft));
  assert.deepEqual(ids(replaced), ['home', 'projects', 'resume', 'contact'], 'order wins over array position');
  assert.equal(page(replaced, 'projects').sections[0].options, undefined, 'default-valued options dropped');
  draft.pages[0].sections[0].enable = true;
  assert.match(cli(['layout', 'replace', '-'], JSON.stringify(draft)).err, /pages\[0\] "contact"\.sections\[0\] "contactQuest": unknown key "enable"/);

  // validate reports a hand-broken layout
  const broken = layoutJson();
  broken.pages[0].sections.push({ type: 'carousel', id: 'x' });
  fs.writeFileSync(file, JSON.stringify(broken));
  assert.match(cli(['validate']).json.errors.join('\n'), /site\/layout\.json: pages\[0\] "home"\.sections\[5\] "x": unknown section type "carousel"/);
  fs.writeFileSync(file, before);
});

test('validate fails with errors on broken content', () => {
  fs.writeFileSync(path.join(root, 'content/projects/order.json'), '["star-game","ghost"]\n');
  const r = cli(['validate']);
  assert.equal(r.code, 1);
  assert.equal(r.json.ok, false);
  assert.match(r.json.errors.join('\n'), /unknown project "ghost"/);
});
