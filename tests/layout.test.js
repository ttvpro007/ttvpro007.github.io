// Site structure: the committed layout.json, the section registry and the layout helpers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import '@loom/kit-portfolio';
import {
  SECTION_TYPES, OPTION_KINDS, sectionOptions, parseOptionValue, compactOptions,
  validateLayout, visiblePages, normalizeLayout, addPage, movePage, removePage, updatePage,
  addSection, removeSection, moveSection, updateSection, transferSection, normalizeNode,
} from '@loom/core';

const committed = JSON.parse(fs.readFileSync('content/site/layout.json', 'utf8'));

const page = (id, sections = [], extra = {}) => ({ id, label: id, slug: id, enabled: true, sections, ...extra });
const section = (type, extra = {}) => ({ type, id: type, enabled: true, ...extra });

test('committed layout.json is valid and stored in order', () => {
  assert.deepEqual(validateLayout(committed), []);
  assert.deepEqual(normalizeLayout(committed), committed);
});

test('default layout reproduces the original site: Home, Projects, Resume, Contact', () => {
  const pages = visiblePages(committed);
  assert.deepEqual(pages.map((p) => p.label), ['Home', 'Projects', 'Resume', 'Contact']);
  assert.deepEqual(pages[0].sections.map((s) => s.type), ['hero', 'timeline', 'flipCards', 'funFacts', 'showAndTell']);
  assert.deepEqual(sectionOptions(pages[0].sections[0]), { profilePicSize: 'medium', showSocialLinks: true });
});

test('every section type has a component and a well-formed option schema', () => {
  const registry = fs.readFileSync(path.join(path.dirname(createRequire(import.meta.url).resolve('@loom/kit-portfolio')), 'components.jsx'), 'utf8');
  const components = [...registry.matchAll(/^ {2}(\w+): /gm)].map((m) => m[1]);
  for (const [type, t] of Object.entries(SECTION_TYPES)) {
    assert.ok(components.includes(type), `${type} has no entry in SECTION_COMPONENTS`);
    assert.ok(['stack', 'resume', 'page'].includes(t.frame), `${type}: bad frame`);
    assert.ok(t.label && t.icon && Array.isArray(t.reads), `${type}: label, icon and reads are required`);
    for (const [key, o] of Object.entries(t.options)) {
      assert.ok(OPTION_KINDS.includes(o.kind), `${type}.${key}: bad kind`);
      assert.ok('default' in o, `${type}.${key}: needs a default`);
      if (o.kind === 'select') assert.ok(o.values.includes(o.default), `${type}.${key}: default not in values`);
    }
  }
});

test('validation: unknown types and options, duplicate ids and slugs, no enabled page', () => {
  const errors = (layout) => validateLayout(layout).join('\n');
  assert.match(errors({ pages: [page('a', [section('nope')])] }), /pages\[0\] "a"\.sections\[0\] "nope": unknown section type "nope" — use one of: hero/);
  assert.match(errors({ pages: [page('a', [section('hero', { options: { size: 1 } })])] }), /unknown option "size" for hero — its options are: profilePicSize, showSocialLinks/);
  assert.match(errors({ pages: [page('a', [section('hero', { options: { profilePicSize: 'huge' } })])] }), /profilePicSize must be one of/);
  assert.match(errors({ pages: [page('a'), page('a')] }), /duplicate page id "a"/);
  assert.match(errors({ pages: [page('a'), page('b', [], { slug: 'a' })] }), /pages\[1\] "b": duplicate slug "a"/);
  assert.match(errors({ pages: [page('a', [section('hero'), section('hero')])] }), /duplicate section id "hero"/);
  assert.match(errors({ pages: [page('a', [], { enabled: false })] }), /at least one page must be enabled/);
  assert.match(errors({ pages: [page('Bad Id')] }), /id "Bad Id" is not valid — use lowercase letters, digits and dashes, e\.g\. "bad-id"/);
  assert.match(errors({ pages: [{ id: 'a', slug: 'a', sections: [] }] }), /label \(the nav text\) is required, e\.g\. "label": "A"/);
  assert.deepEqual(validateLayout({ pages: [page('a', [section('hero', { options: { showSocialLinks: false } })])] }), []);
});

test('visiblePages skips disabled pages and sections and sorts by order', () => {
  const layout = {
    pages: [
      page('b', [section('hero'), section('timeline', { enabled: false })], { order: 1 }),
      page('a', [], { order: 0 }),
      page('c', [], { order: 2, enabled: false }),
    ],
  };
  const pages = visiblePages(layout);
  assert.deepEqual(pages.map((p) => p.id), ['a', 'b']);
  assert.deepEqual(pages[1].sections.map((s) => s.id), ['hero']);
});

test('page edits keep order numbers in sync', () => {
  let l = { pages: [page('a', [], { order: 0 }), page('b', [], { order: 1 })] };
  l = addPage(l, { id: 'c', label: 'C', position: 0 });
  assert.deepEqual(l.pages.map((p) => [p.id, p.order]), [['c', 0], ['a', 1], ['b', 2]]);
  assert.equal(l.pages[0].slug, 'c');
  l = movePage(l, 'c', 5);
  assert.deepEqual(visiblePages(l).map((p) => p.id), ['a', 'b', 'c']);
  l = updatePage(l, 'b', { enabled: false });
  assert.deepEqual(visiblePages(l).map((p) => p.id), ['a', 'c']);
  l = removePage(l, 'a');
  assert.deepEqual(l.pages.map((p) => [p.id, p.order]), [['b', 0], ['c', 1]]);
  assert.throws(() => addPage(l, { id: 'b', label: 'B' }), /already exists/);
  assert.throws(() => movePage(l, 'zzz', 0), /No page "zzz"/);
});

test('section edits: unique ids, move, toggle, options', () => {
  let l = { pages: [page('home', [section('hero')])] };
  l = addSection(l, 'home', { type: 'hero' });
  l = addSection(l, 'home', { type: 'timeline', position: 0 });
  assert.deepEqual(l.pages[0].sections.map((s) => s.id), ['timeline', 'hero', 'hero-2']);
  l = moveSection(l, 'home', 'timeline', 2);
  assert.deepEqual(l.pages[0].sections.map((s) => s.id), ['hero', 'hero-2', 'timeline']);
  l = updateSection(l, 'home', 1, (s) => ({ ...s, enabled: false, options: { profilePicSize: 'large' } }));
  assert.equal(l.pages[0].sections[1].enabled, false);
  assert.equal(sectionOptions(l.pages[0].sections[1]).profilePicSize, 'large');
  l = removeSection(l, 'home', 'hero-2');
  assert.deepEqual(l.pages[0].sections.map((s) => s.id), ['hero', 'timeline']);
  assert.deepEqual(validateLayout(l), []);
  assert.throws(() => addSection(l, 'home', { type: 'nope' }), /Unknown section type/);
  assert.throws(() => removeSection(l, 'home', 'missing'), /no section "missing"/);
});

test('parseOptionValue types CLI strings by option kind', () => {
  assert.equal(parseOptionValue({ kind: 'boolean' }, 'false'), false);
  assert.equal(parseOptionValue({ kind: 'number' }, '3'), 3);
  assert.equal(parseOptionValue({ kind: 'select', values: ['a', 'b'] }, 'b'), 'b');
  assert.throws(() => parseOptionValue({ kind: 'select', values: ['a'] }, 'c'), /must be one of a/);
  assert.throws(() => parseOptionValue({ kind: 'boolean' }, 'maybe'), /true or false/);
});

test('validation: typos in keys, notes allowed, children only where the type accepts them', () => {
  const errors = (layout) => validateLayout(layout).join('\n');
  assert.match(errors({ pages: [page('a', [], { lable: 'x' })] }), /pages\[0\] "a": unknown key "lable" — a page has id, label/);
  assert.match(errors({ pages: [page('a', [section('hero', { enable: false })])] }), /unknown key "enable" — a section has type, id, enabled, options, children/);
  assert.match(errors({ pages: [page('a')], extra: 1 }), /extra: unknown top-level key/);
  assert.deepEqual(validateLayout({ _note: 'x', pages: [page('a', [section('hero', { _why: 'notes are kept' })], { _todo: 'x' })] }), []);
  assert.match(errors({ pages: [page('a', [section('hero', { children: [] })])] }), /hero does not hold child blocks — remove "children"/);
  // a type that accepts children validates them with the same node rules
  SECTION_TYPES.hero.children = true;
  try {
    assert.match(errors({ pages: [page('a', [section('hero', { children: [section('nope')] })])] }), /sections\[0\] "hero"\.children\[0\] "nope": unknown section type/);
    assert.deepEqual(validateLayout({ pages: [page('a', [section('hero', { children: [section('timeline')] })])] }), []);
  } finally {
    SECTION_TYPES.hero.children = false;
  }
});

test('stored shape: canonical key order, only non-default options', () => {
  assert.deepEqual(compactOptions('hero', { profilePicSize: 'medium', showSocialLinks: false }), { showSocialLinks: false });
  assert.equal(compactOptions('hero', { profilePicSize: 'medium' }), undefined);
  assert.deepEqual(compactOptions('hero', { typo: 1 }), { typo: 1 }, 'unknown keys are kept so validation reports them');
  const node = normalizeNode({ enabled: true, options: { profilePicSize: 'medium' }, id: 'hero', type: 'hero' });
  assert.deepEqual(Object.keys(node), ['type', 'id', 'enabled']);
  const l = normalizeLayout({ pages: [{ sections: [], enabled: true, slug: 'a', label: 'A', id: 'a' }] });
  assert.deepEqual(Object.keys(l.pages[0]), ['id', 'label', 'slug', 'enabled', 'order', 'sections']);
});

test('transferSection moves a section to another page with a unique id', () => {
  let l = { pages: [page('a', [section('hero'), section('timeline')]), page('b', [section('hero')])] };
  l = transferSection(l, 'a', 'hero', 'b', 0);
  assert.deepEqual(l.pages[0].sections.map((s) => s.id), ['timeline']);
  assert.deepEqual(l.pages[1].sections.map((s) => s.id), ['hero-2', 'hero']);
  l = transferSection(l, 'b', 'hero-2', 'b');
  assert.deepEqual(l.pages[1].sections.map((s) => s.id), ['hero', 'hero-2']);
  assert.throws(() => transferSection(l, 'a', 'timeline', 'zzz'), /No page "zzz" in layout.json — pages are: a, b/);
});
