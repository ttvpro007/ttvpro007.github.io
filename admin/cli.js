#!/usr/bin/env node
/**
 * Headless content editor — the admin GUI's operations without a browser or dev server.
 *
 *   npm run content -- <command> [args] [--options]
 *   npm run content -- --help            all commands
 *   npm run content -- <command> --help  one command
 *
 * Success prints JSON on stdout (exit 0). Failures print a message on stderr and exit
 * 1 (validation / operation failed) or 2 (bad usage). Writes go through
 * admin/server/store.js, the same module the admin API uses.
 *
 * PORTFOLIO_ROOT points it at another checkout (the tests use a temp copy); file
 * arguments are resolved against the directory you ran it from.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const CWD = process.cwd();
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// store.js and plugins/content.js resolve content/ from the working directory at import time
process.chdir(process.env.PORTFOLIO_ROOT ? path.resolve(process.env.PORTFOLIO_ROOT) : REPO);
const store = await import('./server/store.js');
const { PROJECT_FIELDS, validateProject } = await import('../src/lib/content/projectSchema.js');
const { testState, stopPreview } = await import('./server/release.js');

const { fail } = store;
const usage = (message) => Object.assign(new Error(message), { usage: true });

/* ── helpers ──────────────────────────────────────────────────────────── */

const out = (data) => process.stdout.write(JSON.stringify(data, null, 2) + '\n');
const log = (text) => process.stderr.write(text);
const userPath = (p) => path.resolve(CWD, p);

/** File contents, or stdin for "-". */
const readInput = (src) => (src === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(userPath(src), 'utf8'));

const readJsonInput = (src) => {
  const text = readInput(src);
  try { return JSON.parse(text); } catch (e) { throw fail(400, `${src === '-' ? 'stdin' : src} is not valid JSON: ${e.message}`); }
};

/** "a=b" → ["a", "b"] (only the first = splits). */
const splitAssignment = (s) => {
  const i = s.indexOf('=');
  if (i <= 0) throw usage(`--set expects field=value, got "${s}"`);
  return [s.slice(0, i), s.slice(i + 1)];
};

/** Untyped values: JSON when it parses (numbers, true/false, null, arrays, objects, "quoted"), else the raw string. */
const looseValue = (raw) => { try { return JSON.parse(raw); } catch { return raw; } };

const FIELD_KIND = Object.fromEntries(PROJECT_FIELDS.map((f) => [f.key, f.kind]));
const PROJECT_KEYS = [...PROJECT_FIELDS.map((f) => f.key), 'cover', 'media', 'links'];

/** Project values follow PROJECT_FIELDS kinds, so `year=2024`, `draft=false`, `tech=Unity, C#` just work. */
const projectValue = (key, raw) => {
  switch (FIELD_KIND[key]) {
    case 'number': {
      const n = Number(raw);
      if (raw.trim() === '' || Number.isNaN(n)) throw usage(`${key} must be a number, got "${raw}"`);
      return n;
    }
    case 'boolean':
      if (/^(true|yes|1)$/i.test(raw)) return true;
      if (/^(false|no|0)$/i.test(raw)) return false;
      throw usage(`${key} must be true or false, got "${raw}"`);
    case 'list':
      if (raw.trim().startsWith('[')) return looseValue(raw);
      return raw.split(',').map((s) => s.trim()).filter(Boolean);
    case 'text':
    case 'textarea':
    case 'select':
      return raw;
    default:
      return looseValue(raw);
  }
};

const pathKeys = (dotted) => dotted.split('.').map((k) => (/^\d+$/.test(k) ? Number(k) : k));

/** Set a dotted path ("colors.primary", "media.0.caption"), creating objects/arrays on the way. */
const setPath = (obj, dotted, value) => {
  const keys = pathKeys(dotted);
  let cur = obj;
  for (const [i, k] of keys.slice(0, -1).entries()) {
    if (cur[k] === null || typeof cur[k] !== 'object') cur[k] = typeof keys[i + 1] === 'number' ? [] : {};
    cur = cur[k];
  }
  cur[keys.at(-1)] = value;
  return obj;
};

const unsetPath = (obj, dotted) => {
  const keys = pathKeys(dotted);
  const parent = keys.slice(0, -1).reduce((o, k) => (o == null ? o : o[k]), obj);
  if (parent == null) return obj;
  if (Array.isArray(parent) && typeof keys.at(-1) === 'number') parent.splice(keys.at(-1), 1);
  else delete parent[keys.at(-1)];
  return obj;
};

const getPath = (obj, dotted) => pathKeys(dotted).reduce((o, k) => (o == null ? undefined : o[k]), obj);

/** Apply --json (merge, or replace with --replace), then --set / --unset, to a JSON document. */
const editDocument = (doc, opts, { coerce = (_k, raw) => looseValue(raw) } = {}) => {
  let next = structuredClone(doc);
  if (opts.json !== undefined) {
    const input = readJsonInput(opts.json);
    const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
    next = opts.replace || !isObject(input) || !isObject(next) ? input : { ...next, ...input };
  }
  for (const s of opts.set || []) {
    const [key, raw] = splitAssignment(s);
    setPath(next, key, key.includes('.') ? looseValue(raw) : coerce(key, raw));
  }
  for (const key of opts.unset || []) unsetPath(next, key);
  return next;
};

const hasEdits = (opts) => opts.json !== undefined || opts.set?.length || opts.unset?.length;

const editOptions = {
  set: { type: 'string', multiple: true },
  unset: { type: 'string', multiple: true },
  json: { type: 'string' },
  replace: { type: 'boolean' },
};

/* ── commands ─────────────────────────────────────────────────────────── */

const commands = {
  list: {
    summary: 'List projects (slug, title, draft, errors)',
    help: `list [--full]

  One row per project in display order: slug, title, category, year, draft,
  featured, media count and validation errors. --full prints whole projects
  (as "show" does) instead.`,
    options: { full: { type: 'boolean' } },
    run: (_args, opts) => {
      const projects = store.listProjects();
      if (opts.full) return projects;
      return projects.map((p) => ({
        slug: p.slug, title: p.title, category: p.category, year: p.year,
        draft: !!p.draft, featured: !!p.featured, media: (p.media || []).length, errors: p.errors,
      }));
    },
  },

  show: {
    summary: 'Print one project (fields, overview, media files, errors)',
    help: `show <slug> [--field <path>]

  The project as stored plus "slug", "overview" (overview.md text or null),
  "mediaFiles" (files under media/) and "errors" (validation problems).
  --field prints just one value, e.g. --field title or --field media.0.src.`,
    options: { field: { type: 'string' } },
    run: ([slug], opts) => {
      if (!slug) throw usage('show needs a <slug>');
      const p = store.getProject(slug);
      return opts.field ? getPath(p, opts.field) ?? null : p;
    },
  },

  create: {
    summary: 'Create a draft project from a title',
    help: `create <title> [--set field=value …] [--json <file|->]

  Creates content/projects/<slug>/ with an empty draft project.json and puts it
  first in order.json. The slug is the slugified title (-2, -3… if taken).
  --set / --json fill fields right away (same rules as "update").`,
    options: editOptions,
    run: (args, opts) => {
      const title = args.join(' ').trim();
      if (!title) throw usage('create needs a <title>');
      const { slug } = store.createProject(title);
      if (hasEdits(opts)) return { slug, ...updateProject(slug, opts) };
      return { slug, project: store.getProject(slug) };
    },
  },

  update: {
    summary: 'Change project fields (--set field=value, --json file|-)',
    help: `update <slug> [--set field=value …] [--unset field …] [--json <file|->] [--replace] [--force]

  --set field=value   Repeatable. Values follow the field's kind in projectSchema.js:
                        number   year=2024
                        boolean  draft=false   featured=true
                        list     tech="Unity, C#"   or   tech='["Unity","C#"]'
                        text     description="Any text"
                      Other keys (cover, media, links) and dotted paths take JSON,
                      falling back to a plain string: media.0.caption="Boss fight",
                      links='[{"type":"github","url":"https://github.com/…"}]'.
  --unset field       Remove a key (or dotted path / array index).
  --json <file|->     Merge a JSON object into the project (stdin with -).
  --replace           With --json: replace project.json entirely.
  --force             Save even if a non-draft project fails validation, and allow
                      keys that are not in the schema.

  Refuses (exit 1, nothing written) when a published (non-draft) project would
  fail validation, or a --set key is not a known field. Prints the saved project.`,
    options: { ...editOptions, force: { type: 'boolean' } },
    run: ([slug], opts) => {
      if (!slug) throw usage('update needs a <slug>');
      if (!hasEdits(opts)) throw usage('update needs --set, --unset or --json');
      return updateProject(slug, opts);
    },
  },

  rename: {
    summary: 'Rename a project folder (its slug)',
    help: `rename <old-slug> <new-slug>

  Renames content/projects/<old>/ and updates order.json. The new name is
  slugified. Fails if the target exists.`,
    run: ([from, to]) => {
      if (!from || !to) throw usage('rename needs <old-slug> <new-slug>');
      return store.renameProject(from, to);
    },
  },

  delete: {
    summary: 'Move a project to .trash/ (recoverable)',
    help: `delete <slug>

  Moves the project folder to .trash/ (not committed, recoverable) and removes
  it from order.json.`,
    run: ([slug]) => {
      if (!slug) throw usage('delete needs a <slug>');
      return store.deleteProject(slug);
    },
  },

  overview: {
    summary: 'Read or write a project\'s overview.md',
    help: `overview <slug> [--raw]
overview <slug> --file <path|->
overview <slug> --clear

  No flags: prints { slug, overview } (overview is null when there is none);
  --raw prints the markdown itself. --file writes overview.md from a file or
  stdin (-); empty text deletes it, as does --clear. overview.md can reference
  its own media as ![alt](media/shot.png).`,
    options: { file: { type: 'string' }, clear: { type: 'boolean' }, raw: { type: 'boolean' } },
    run: ([slug], opts) => {
      if (!slug) throw usage('overview needs a <slug>');
      if (opts.clear) return { slug, ...store.writeOverview(slug, '') };
      if (opts.file !== undefined) {
        const text = readInput(opts.file);
        store.writeOverview(slug, text);
        return { slug, overview: text.trim() ? text : null };
      }
      const text = store.readOverview(slug);
      if (opts.raw) { process.stdout.write(text ?? ''); return undefined; }
      return { slug, overview: text };
    },
  },

  media: {
    summary: 'Add, remove or list a project\'s media',
    help: `media list <slug>
media add <slug> <file|folder|url> [--type <type>] [--caption <text>] [--title <text>] [--cover] [--no-optimize]
media remove <slug> <index|src>

  add, like the admin's Media panel:
    file    Copied into media/ under a slugified, unique name; the type comes from
            the extension (image, video). Large PNG/JPEG are resized to ≤2400px and
            converted to WebP unless --no-optimize.
    folder  A Unity WebGL build: must have index.html at its top level; copied to
            media/<folder>/ and added as { type: "unity", src: "<folder>/index.html" }.
    url     https:// link: youtube (detected) or embed (--type embed).
    --caption  gallery caption; --title  tab title for playable items (Unity);
    --cover    make this image the card cover.
  remove: by list index (0-based, see "media list") or src. Clears "cover" if it
    pointed there; the file (or build folder) goes to .trash/ once unused.`,
    options: {
      type: { type: 'string' }, caption: { type: 'string' }, title: { type: 'string' },
      cover: { type: 'boolean' }, 'no-optimize': { type: 'boolean' },
    },
    run: async ([action, slug, target], opts) => {
      if (!slug) throw usage('media needs list|add|remove and a <slug>');
      switch (action) {
        case 'list': {
          const p = store.getProject(slug);
          return { slug, cover: p.cover ?? null, media: p.media || [], files: p.mediaFiles };
        }
        case 'add':
          if (!target) throw usage('media add needs <slug> <file|folder|url>');
          return store.addMedia(slug, /^(https?:)?\/\//.test(target) ? target : userPath(target), {
            type: opts.type, caption: opts.caption, title: opts.title, cover: opts.cover, optimize: !opts['no-optimize'],
          });
        case 'remove':
          if (target === undefined) throw usage('media remove needs <slug> <index|src>');
          return store.removeMedia(slug, target);
        default:
          throw usage(`Unknown media action "${action}" (list, add, remove)`);
      }
    },
  },

  order: {
    summary: 'Get or set the project display order',
    help: `order
order set <slug> <slug> …      (or --json <file|->)
order move <slug> <position>   (0 = first)

  set takes the full list; projects you leave out are shown last, newest first.
  Unknown or duplicate slugs are refused.`,
    options: { json: { type: 'string' } },
    run: ([action, ...rest], opts) => {
      if (!action) return store.readOrder();
      const known = new Set(store.listProjects().map((p) => p.slug));
      const check = (order) => {
        const bad = order.filter((s) => !known.has(s));
        if (bad.length) throw fail(400, `Unknown project(s): ${bad.join(', ')}`);
        if (new Set(order).size !== order.length) throw fail(400, 'Order has duplicate slugs');
        store.saveOrder(order);
        return store.readOrder();
      };
      switch (action) {
        case 'set':
          if (opts.json !== undefined) return check(readJsonInput(opts.json));
          if (!rest.length) throw usage('order set needs slugs (or --json)');
          return check(rest);
        case 'move': {
          const [slug, pos] = rest;
          if (!slug || !/^\d+$/.test(pos ?? '')) throw usage('order move needs <slug> <position>');
          if (!known.has(slug)) throw fail(404, `No project "${slug}"`);
          const order = store.readOrder().filter((s) => s !== slug);
          order.splice(Number(pos), 0, slug);
          return check(order);
        }
        default:
          throw usage(`Unknown order action "${action}" (set, move)`);
      }
    },
  },

  theme: {
    summary: 'Get the theme, switch the active preset, edit presets',
    help: `theme                                      whole theme.json
theme active <preset>                      switch the active preset
theme preset <name>                        print one preset
theme preset <name> --set colors.primary=#EEB64B --set radius=12 …
theme preset <name> --json <file|-> [--replace]   create/merge a preset
theme preset <name> --delete               remove a preset (not the active one)

  Preset shape: { label, colors: { primary, secondary, accent, highlight, success,
  background, surface, surfaceAlt, text, textMuted, border }, fonts: { heading,
  body }, radius }. --set takes dotted paths; values are JSON or plain strings.`,
    options: { ...editOptions, delete: { type: 'boolean' } },
    run: ([action, name], opts) => {
      const theme = store.readTheme();
      if (!action) return theme;
      switch (action) {
        case 'active':
          if (!name) return { active: theme.active };
          if (!theme.presets?.[name]) throw fail(404, `No preset "${name}" (have: ${Object.keys(theme.presets || {}).join(', ')})`);
          store.saveTheme({ ...theme, active: name });
          return { active: name };
        case 'preset': {
          if (!name) throw usage('theme preset needs a <name>');
          const presets = { ...theme.presets };
          if (opts.delete) {
            if (!presets[name]) throw fail(404, `No preset "${name}"`);
            if (theme.active === name) throw fail(400, `"${name}" is the active preset — switch first`);
            delete presets[name];
            store.saveTheme({ ...theme, presets });
            return { deleted: name };
          }
          if (!hasEdits(opts)) {
            if (!presets[name]) throw fail(404, `No preset "${name}"`);
            return presets[name];
          }
          presets[name] = editDocument(presets[name] || { label: name, colors: {}, fonts: {} }, opts);
          store.saveTheme({ ...theme, presets });
          return { [name]: presets[name] };
        }
        default:
          throw usage(`Unknown theme action "${action}" (active, preset)`);
      }
    },
  },

  site: {
    summary: 'Get or edit content/site/<id>.json',
    help: `site                                        list site files
site <id>                                   print one (profile, navigation, uiContent, contact)
site <id> --field <path>                    print one value
site <id> --set path=value … [--unset path]  edit values (dotted paths, JSON or plain strings)
site <id> --json <file|-> [--replace]       merge (or replace) the whole file`,
    options: { ...editOptions, field: { type: 'string' } },
    run: ([id], opts) => {
      if (!id) return store.SITE_FILES;
      const data = store.readSite(id);
      if (!hasEdits(opts)) return opts.field ? getPath(data, opts.field) ?? null : data;
      const next = editDocument(data, opts);
      store.saveSite(id, next);
      return next;
    },
  },

  validate: {
    summary: 'Check all content (exit 1 on errors)',
    help: `validate

  Schema errors (published projects block; drafts are warnings), missing local
  media files, order.json problems, unparseable site/theme JSON and a dangling
  theme.active. Prints { ok, projects, errors, warnings }; exits 1 when not ok.`,
    run: () => {
      const result = store.validateAll();
      if (!result.ok) {
        out(result);
        throw Object.assign(fail(422, `Content has ${result.errors.length} error(s)`, result.errors), { printed: true });
      }
      return result;
    },
  },

  release: {
    summary: 'Test / stage / publish (the admin\'s release flow)',
    help: `release status
release test [--serve]
release stage [-m <message>]
release publish [-m <message>]

  test     Validate + production build, then mark exactly this content as tested
           (Stage / Go live require it). --serve keeps the preview running at
           http://localhost:4173/ until Ctrl+C.
  stage    Commit content/ and force-push HEAD to the "staging" branch.
  publish  Go live: on master only, commit content/ and push master.
  Logs go to stderr; the result is JSON on stdout. See docs/release.md.`,
    options: { serve: { type: 'boolean' }, message: { type: 'string', short: 'm' } },
    run: async ([action], opts) => {
      switch (action) {
        case 'status':
        case undefined:
          return testState();
        case 'test': {
          const result = await store.releaseTest(log, { serve: !!opts.serve });
          if (!opts.serve) return { tested: true, ...result };
          out({ tested: true, ...result });
          log('Preview running — Ctrl+C to stop.\n');
          await new Promise((resolve) => process.once('SIGINT', resolve));
          stopPreview();
          return undefined;
        }
        case 'stage':
          await store.releaseStage(opts.message, log);
          return { staged: true };
        case 'publish':
          await store.releasePublish(opts.message, log);
          return { published: true };
        default:
          throw usage(`Unknown release action "${action}" (status, test, stage, publish)`);
      }
    },
  },
};

/** Shared by create/update: apply edits, validate, save. */
function updateProject(slug, opts) {
  const current = store.getProject(slug);
  const stored = Object.fromEntries(Object.entries(current).filter(([k]) => !['slug', 'overview', 'mediaFiles', 'errors'].includes(k)));
  if (!opts.force) {
    const unknown = (opts.set || []).map((s) => splitAssignment(s)[0].split('.')[0]).filter((k) => !PROJECT_KEYS.includes(k));
    if (unknown.length) throw fail(400, `Unknown project field(s): ${unknown.join(', ')} (known: ${PROJECT_KEYS.join(', ')}; --force to add anyway)`);
  }
  const next = editDocument(stored, opts, { coerce: projectValue });
  const errors = validateProject(next);
  if (errors.length && !next.draft && !opts.force) {
    throw fail(422, `${slug} would fail validation — nothing saved (keep draft=true while incomplete, or --force)`, errors);
  }
  store.saveProject(slug, next);
  return { project: store.getProject(slug) };
}

/* ── main ─────────────────────────────────────────────────────────────── */

const globalHelp = () => {
  const width = Math.max(...Object.keys(commands).map((c) => c.length));
  return `Headless content editor for content/ (same operations as the admin GUI).

Usage: npm run content -- <command> [args] [--options]

Commands:
${Object.entries(commands).map(([name, c]) => `  ${name.padEnd(width)}  ${c.summary}`).join('\n')}

Run "npm run content -- <command> --help" for details. Output is JSON on stdout;
errors go to stderr with exit code 1 (failed) or 2 (bad usage).
Docs: docs/content.md → "Agent / CLI editing".
`;
};

async function main(argv) {
  const [name, ...rest] = argv;
  if (!name || name === '--help' || name === '-h' || name === 'help') {
    const target = name === 'help' && commands[rest[0]];
    process.stdout.write(target ? target.help + '\n' : globalHelp());
    return 0;
  }
  const command = commands[name];
  if (!command) throw usage(`Unknown command "${name}". Run with --help for the list.`);
  if (rest.includes('--help') || rest.includes('-h')) {
    process.stdout.write(command.help + '\n');
    return 0;
  }
  let parsed;
  try {
    parsed = parseArgs({ args: rest, options: command.options || {}, allowPositionals: true, strict: true });
  } catch (e) {
    throw usage(`${e.message}\n\n${command.help}`);
  }
  const result = await command.run(parsed.positionals, parsed.values);
  if (result !== undefined) out(result);
  return 0;
}

main(process.argv.slice(2)).then(
  (code) => { process.exitCode = code; },
  (err) => {
    if (!err.printed) {
      process.stderr.write(`error: ${err.message}\n`);
      for (const d of err.details || []) process.stderr.write(`  - ${d}\n`);
    } else {
      process.stderr.write(`error: ${err.message}\n`);
    }
    process.exitCode = err.usage ? 2 : 1;
  },
);
