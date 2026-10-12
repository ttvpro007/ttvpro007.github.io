#!/usr/bin/env node
// Read-only survey for the progress skill. Prints one JSON document on stdout.
//
//   node .claude/skills/progress/gather.mjs [scope] [--db <dir>] [--no-test]
//
// scope   optional module or milestone (cli, admin, site, format, release, split, m1..m8, mx, or an alias).
//         An unknown scope exits 2 and lists the known names. Scope never narrows what is
//         gathered, only the `scope` block in the output.
// --db    a directory holding the roadmap store, as ArtifactData list writes it with out_dir:
//         <dir>/tracking/<task-id>.json and <dir>/milestones/<milestone-id>.json.
//         Missing or empty means "no ticks recorded"; nothing is invented.
// --no-test  skip `npm test` (validate still runs).
//
// It never writes to the repo, the roadmap HTML or the store. It runs git read commands,
// `npm test` (tests work in os.tmpdir()) and `npm run content -- validate`.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAIN = 'content-admin-restructure';
const NOT_WORK = new Set(['master', 'gh-pages', 'staging', MAIN]);
const HERE = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const scopeArg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--db') || null;

function run(cmd, argv, { cwd = ROOT, input } = {}) {
  const r = spawnSync(cmd, argv, { cwd, input, encoding: 'utf8', maxBuffer: 64 << 20, shell: cmd.startsWith('npm ') });
  return { code: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}
const git = (...a) => run('git', a);
const ROOT = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: HERE, encoding: 'utf8' }).stdout.trim();

// ---------- plan: MILESTONES from docs/roadmap.html, found by name ----------
const html = fs.readFileSync(path.join(ROOT, 'docs/roadmap.html'), 'utf8');
function arrayLiteral(src, name) {
  const at = src.indexOf(`var ${name} = [`);
  if (at < 0) throw new Error(`${name} not found in docs/roadmap.html`);
  let i = src.indexOf('[', at), depth = 0, q = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (q) { if (c === '\\') j++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'") q = c;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return src.slice(i, j + 1);
  }
  throw new Error(`${name} is not closed`);
}
const MILESTONES = Function(`return ${arrayLiteral(html, 'MILESTONES')}`)();
const revs = [...html.matchAll(/Rev (\d+) &middot; ([^<]+)</g)].map((m) => ({ rev: +m[1], date: m[2].trim() }));
const probes = JSON.parse(fs.readFileSync(path.join(HERE, 'probes.json'), 'utf8'));

// ---------- scope ----------
function resolveScope(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  const ms = MILESTONES.find((m) => m.id === n || m.code.toLowerCase() === n);
  if (ms) return { kind: 'milestone', name: ms.code, tasks: ms.tasks.map((t) => t.id) };
  const mods = probes.modules;
  let hit = Object.keys(mods).find((k) => k === n) || Object.keys(mods).find((k) => mods[k].aliases.includes(n));
  if (!hit) {
    const pre = Object.keys(mods).filter((k) => k.startsWith(n));
    if (pre.length === 1) hit = pre[0];
    else if (pre.length > 1) return { error: `"${name}" is ambiguous: ${pre.join(', ')}` };
  }
  if (!hit) return { error: `unknown scope "${name}"` };
  const tasks = MILESTONES.flatMap((m) => m.tasks).filter((t) => probes.tasks[t.id]?.modules.includes(hit)).map((t) => t.id);
  return { kind: 'module', name: hit, owns: mods[hit].owns, binding: 'inferred (path ownership, declared in probes.json)', tasks };
}
const scope = resolveScope(scopeArg);
if (scope?.error) {
  const known = [...Object.entries(probes.modules).map(([k, v]) => `${k} (${v.aliases.join(', ')})`), ...MILESTONES.map((m) => m.code.toLowerCase())];
  console.error(`${scope.error}. Known scopes: ${known.join('; ')}`);
  process.exit(2);
}

// ---------- store (reader's ticks), read from files ArtifactData wrote ----------
function readCollection(dir) {
  const out = {};
  if (!dir || !fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    out[path.basename(f, '.json')] = j.data ?? j.fields ?? j;
  }
  return out;
}
const dbDir = opt('--db');
const tracking = readCollection(dbDir && path.join(dbDir, 'tracking'));
const msState = readCollection(dbDir && path.join(dbDir, 'milestones'));
// ArtifactData writes no directory for an empty collection, so a passed --db means "read, and empty".
const storeRead = !!dbDir;

// ---------- git: refs, branches, worktrees ----------
const sha = (ref) => { const r = git('rev-parse', '--verify', '-q', ref); return r.code === 0 ? r.out : null; };
const mainSha = sha(MAIN);
const isAncestor = (a, b) => git('merge-base', '--is-ancestor', a, b).code === 0;

const worktrees = [];
{
  let cur = null;
  for (const line of git('worktree', 'list', '--porcelain').out.split(/\r?\n/)) {
    if (line.startsWith('worktree ')) worktrees.push(cur = { path: line.slice(9), branch: null });
    else if (line.startsWith('branch ')) cur.branch = line.slice(7).replace('refs/heads/', '');
  }
  for (const w of worktrees) {
    const s = run('git', ['status', '--short', '--untracked-files=all'], { cwd: w.path }).out;
    w.dirty = s ? s.split(/\r?\n/).filter((l) => !/ \.claude\//.test(l)) : [];
  }
}

const branchRefs = git('for-each-ref', '--format=%(refname:short)\t%(objectname)\t%(committerdate:iso-strict)\t%(subject)', 'refs/heads', 'refs/remotes')
  .out.split(/\r?\n/).filter(Boolean).map((l) => { const [ref, id, date, subject] = l.split('\t'); return { ref, sha: id, date, subject }; })
  .filter((b) => !b.ref.endsWith('/HEAD') && b.ref !== 'origin' && !NOT_WORK.has(b.ref.replace(/^origin\//, '')));
const unmerged = [];
for (const b of branchRefs) {
  if (isAncestor(b.sha, mainSha)) continue;
  const same = unmerged.find((u) => u.sha === b.sha);
  if (same) { same.alsoAt.push(b.ref); continue; }
  const [behind, ahead] = git('rev-list', '--left-right', '--count', `${MAIN}...${b.ref}`).out.split(/\s+/).map(Number);
  const wt = worktrees.find((w) => w.branch === b.ref);
  unmerged.push({ ...b, alsoAt: [], ahead, behind, worktree: wt?.path || null, dirtyFiles: wt?.dirty.length || 0,
    commits: git('log', '--format=%h %s', `${MAIN}..${b.ref}`).out.split(/\r?\n/).filter(Boolean) });
}
// Local branches that point at main's commits but carry uncommitted work still matter.
for (const w of worktrees) if (w.dirty.length && w.branch && !unmerged.some((u) => u.ref === w.branch) && w.branch !== MAIN)
  unmerged.push({ ref: w.branch, sha: sha(w.branch), ahead: 0, behind: null, alsoAt: [], worktree: w.path, dirtyFiles: w.dirty.length, commits: [] });

const roadmapCommit = git('log', '-1', '--format=%h\t%cI\t%s', MAIN, '--', 'docs/roadmap.html').out.split('\t');
const sinceRevision = { revisionCommit: roadmapCommit[0], at: roadmapCommit[1], subject: roadmapCommit[2],
  onMain: git('log', '--format=%h %cI %s', `${roadmapCommit[0]}..${MAIN}`).out.split(/\r?\n/).filter(Boolean),
  onBranches: Object.fromEntries(unmerged.map((u) => [u.ref, git('log', '--format=%h %cI %s', `${roadmapCommit[0]}..${u.ref}`).out.split(/\r?\n/).filter(Boolean)])) };

const masterRef = sha('origin/master') ? 'origin/master' : 'master';
const release = {
  master: masterRef, mainInMaster: isAncestor(mainSha, sha(masterRef)),
  mainAheadOfMaster: git('log', '--format=%h %s', `${masterRef}..${MAIN}`).out.split(/\r?\n/).filter(Boolean),
  staging: sha('origin/staging') ? git('log', '-1', '--format=%h %cI %s', 'origin/staging').out : null,
  remoteRefsAsOf: 'last git fetch (the survey does not fetch)',
};

// ---------- evidence probes ----------
const fileCache = new Map();
function refFiles(ref, p) {
  const key = `${ref}\0${p}`;
  if (!fileCache.has(key)) fileCache.set(key, git('ls-tree', '-r', '--name-only', ref, '--', p).out.split(/\r?\n/).filter(Boolean));
  return fileCache.get(key);
}
const blobCache = new Map();
function refRead(ref, file) {
  const key = `${ref}:${file}`;
  if (!blobCache.has(key)) { const r = git('show', key); blobCache.set(key, r.code === 0 ? r.out : ''); }
  return blobCache.get(key);
}
function walk(abs) {
  if (!fs.existsSync(abs)) return [];
  if (fs.statSync(abs).isFile()) return [abs];
  return fs.readdirSync(abs, { withFileTypes: true }).filter((d) => d.name !== 'node_modules')
    .flatMap((d) => walk(path.join(abs, d.name)));
}
function probeRef(p, ref) {
  if (p.file) return refFiles(ref, p.file).length > 0;
  const re = new RegExp(p.grep, "m");
  return p.paths.some((q) => refFiles(ref, q).some((f) => re.test(refRead(ref, f))));
}
function probeDir(p, dir) {
  if (p.file) return fs.existsSync(path.join(dir, p.file));
  const re = new RegExp(p.grep, "m");
  return p.paths.some((q) => walk(path.join(dir, q)).some((f) => re.test(fs.readFileSync(f, 'utf8'))));
}

const tasks = [];
for (const m of MILESTONES) for (const t of m.tasks) {
  const spec = probes.tasks[t.id];
  const row = { id: t.id, milestone: m.code, text: t.text, hot: !!t.hot, modules: spec?.modules || null,
    ticked: !!tracking[t.id]?.done, tickedAt: tracking[t.id]?.at || null, human: spec?.human || null, probe: spec?.probe ? 'ok' : 'none' };
  const p = spec?.probe;
  if (p?.mainInMaster) { row.onMain = release.mainInMaster; row.onBranches = []; row.uncommitted = []; }
  else if (p) {
    row.onMain = probeRef(p, MAIN);
    row.onBranches = p.mainOnly || row.onMain ? [] : unmerged.filter((u) => u.ahead > 0 && probeRef(p, u.ref)).map((u) => u.ref);
    row.uncommitted = p.mainOnly || row.onMain ? [] : worktrees.filter((w) => w.dirty.length && probeDir(p, w.path) && !probeRef(p, w.branch || 'HEAD'))
      .map((w) => ({ worktree: w.path, branch: w.branch }));
  }
  row.evidence = !p ? (spec ? 'human-only' : 'unassigned') : row.onMain ? 'main' : row.onBranches.length ? 'branch' : row.uncommitted.length ? 'uncommitted' : 'none';
  tasks.push(row);
}

// ---------- milestones, in-flight, startable, drift ----------
const statusOf = (id) => msState[id]?.status || 'not_started';
const byCode = Object.fromEntries(MILESTONES.map((m) => [m.code, m]));
const depsOf = (m) => (m.depends || '').split(/[,\s]+/).filter((d) => byCode[d]);
// A milestone counts as met by the repo when its code is on main. Human-only tasks and the
// release step (main merged to master) do not hold back code work that depends on it.
const evidenced = (m) => tasks.filter((t) => t.milestone === m.code && t.evidence !== 'human-only' && !probes.tasks[t.id]?.probe?.mainInMaster).every((t) => t.evidence === 'main');

const milestones = MILESTONES.map((m) => {
  const ts = tasks.filter((t) => t.milestone === m.code);
  return { id: m.id, code: m.code, name: m.name, size: m.size, depends: depsOf(m), status: statusOf(m.id),
    target: msState[m.id]?.target || null, note: msState[m.id]?.note || null,
    ticked: ts.filter((t) => t.ticked).length, total: ts.length,
    onMain: ts.filter((t) => t.evidence === 'main').length, probed: ts.filter((t) => t.probe === 'ok').length,
    depsMetByTicks: depsOf(m).every((d) => statusOf(byCode[d].id) === 'done'),
    depsMetByRepo: depsOf(m).every((d) => evidenced(byCode[d])),
    planEvidence: m.evidence, accept: m.accept };
});
const inFlightByTicks = milestones.find((m) => m.status !== 'done')?.code || null;
const inFlightByRepo = milestones.find((m) => !evidenced(byCode[m.code]))?.code || null;

const busy = (t) => t.evidence === 'uncommitted' || t.evidence === 'branch';
const startable = (basis) => tasks.filter((t) => {
  const m = milestones.find((x) => x.code === t.milestone);
  if (t.ticked || m.status === 'done' || busy(t) || t.evidence === 'main') return false;
  return basis === 'ticks' ? m.depsMetByTicks : m.depsMetByRepo;
}).map((t) => ({ id: t.id, milestone: t.milestone, modules: t.modules, waiting: !!t.human && t.probe === 'none' }));

const order = MILESTONES.map((m) => m.code);
const drift = {
  tickedNoCommit: tasks.filter((t) => t.ticked && t.probe === 'ok' && !t.onMain).map((t) => ({ id: t.id, evidence: t.evidence, onBranches: t.onBranches })),
  committedNotTicked: tasks.filter((t) => !t.ticked && t.evidence === 'main').map((t) => t.id),
  inFlightElsewhere: tasks.filter(busy).map((t) => ({ id: t.id, evidence: t.evidence, onBranches: t.onBranches, uncommitted: t.uncommitted })),
  statusVsTicks: milestones.filter((m) => (m.status === 'done') !== (m.ticked === m.total && m.total > 0)).map((m) => ({ code: m.code, status: m.status, ticked: `${m.ticked}/${m.total}` })),
  skipped: inFlightByTicks ? tasks.filter((t) => !t.ticked && order.indexOf(t.milestone) < order.indexOf(inFlightByTicks)).map((t) => t.id) : [],
  orphanTicks: Object.keys(tracking).filter((id) => !tasks.some((t) => t.id === id)),
  orphanMilestoneState: Object.keys(msState).filter((id) => !MILESTONES.some((m) => m.id === id)),
  unassignedTasks: tasks.filter((t) => t.evidence === 'unassigned').map((t) => t.id),
  staleProbes: Object.keys(probes.tasks).filter((id) => !tasks.some((t) => t.id === id)),
  unmergedBranches: unmerged.map((u) => ({ ref: u.ref, ahead: u.ahead, behind: u.behind, worktree: u.worktree, dirtyFiles: u.dirtyFiles })),
  mainNotInMaster: release.mainAheadOfMaster.length,
  dirtyMain: worktrees.find((w) => w.branch === MAIN)?.dirty || [],
};

// ---------- checks: tests and validate (working tree of this checkout) ----------
const checkedTree = { checkout: ROOT, branch: git('branch', '--show-current').out, dirty: worktrees.find((w) => path.resolve(w.path) === path.resolve(ROOT))?.dirty || [] };
let tests = { skipped: true };
if (!flag('--no-test')) {
  const r = run('npm test --silent', []);
  const num = (k) => +(`${r.out}\n${r.err}`.match(new RegExp(`ℹ ${k} (\\d+)`))?.[1] ?? NaN);
  tests = { exit: r.code, tests: num('tests'), pass: num('pass'), fail: num('fail'),
    failing: `${r.out}`.split(/\r?\n/).filter((l) => /^✖/.test(l.trim())).slice(0, 20) };
}
const v = run('node', ['node_modules/@loom/cli/cli.js', 'validate']);
let validate;
try { validate = { exit: v.code, ...JSON.parse(v.out) }; } catch { validate = { exit: v.code, raw: (v.out || v.err).slice(0, 2000) }; }

console.log(JSON.stringify({
  asOf: new Date().toISOString(), main: { branch: MAIN, sha: mainSha?.slice(0, 7) },
  plan: { file: 'docs/roadmap.html', revisions: revs, milestones: MILESTONES.length, tasks: tasks.length },
  store: { read: storeRead, ticks: Object.keys(tracking).length, milestoneDocs: Object.keys(msState).length },
  scope, overall: { ticked: tasks.filter((t) => t.ticked).length, total: tasks.length, onMain: tasks.filter((t) => t.evidence === 'main').length, inFlightByTicks, inFlightByRepo },
  milestones, tasks, startable: { byTicks: startable('ticks'), byRepo: startable('repo') }, drift,
  git: { worktrees: worktrees.map((w) => ({ path: w.path, branch: w.branch, dirty: w.dirty.length })), unmerged, sinceRevision, release },
  checks: { tree: checkedTree, tests, validate },
}, null, 2));
