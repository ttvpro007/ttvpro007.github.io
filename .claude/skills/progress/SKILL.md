---
name: progress
description: Report where the portfolio site builder stands — the in-flight milestone (by the reader's ticks and by the repo), what each milestone can show for itself in git, every task that can be started right now, and drift between the roadmap's ticks, the commits and the branches — then ask which task to start. Read-only. Takes an optional scope, `/progress m4`, `/progress cli`, `/progress admin` (modules cli, admin, site, format, release, or a milestone m1–m8); omit it for the whole roadmap. Use when asked "where are we", "what's next", "status", "progress", "show the roadmap", "how is the CLI doing", "what should I work on", or when picking this repo up cold.
---

# Progress

Four steps in order: **scope**, **gather**, **report**, **ask**. Do not stop after the report — the
point is to end with the user choosing the next task and you starting it.

This is a read-only survey. It ticks nothing, writes nothing to the roadmap store or to
`docs/roadmap.html`, publishes nothing, builds nothing and fetches nothing.

## 0. Scope

The invocation may carry a name: `/progress cli`. With no argument the scope is the whole roadmap.

| Scope | Aliases | Owns (paths) |
|---|---|---|
| `cli` | agent, content-cli | `admin/cli.js`, `admin/server/store.js`, `tests/content-cli.test.js` |
| `admin` | gui, editor, ux | `admin/src/`, `admin/index.html`, `admin/server/api.js` |
| `site` | render, frontend | `src/`, `plugins/content.js` |
| `format` | content, schema, layout | `content/`, `src/lib/content/`, `docs/content.md` |
| `release` | gate, deploy, staging | `admin/server/release.js`, `.github/workflows/`, `docs/release.md` |
| `m1` … `m8` | `M1` … | One milestone of `docs/roadmap.html` |

**Binding:** task ids are milestone-keyed (`m4-cli`), so module membership is **inferred** from path
ownership and declared per task in [probes.json](probes.json) (`tasks.<id>.modules`; a task may
sit in two modules). Say *inferred* on a module-scoped report. A task id in the roadmap with no
entry there is reported as **unassigned**, never dropped and never guessed.

The gather script resolves the name: exact name, then alias, then a unique prefix. **An unknown or
ambiguous name exits 2 and lists the known scopes — relay that and stop.** Never widen to the whole
roadmap.

**Scope narrows what is reported, never what is gathered.** The script always reads everything;
filter at the report step using `scope.tasks`. That is how a scoped report can say "this module is
waiting on M3, which lives in `admin`".

## 1. Gather

Five sources. Three come from one script; the store comes from two reads.

| # | Source | Exact path or command | Authoritative for |
|---|---|---|---|
| 1 | Plan (also the task list) | `docs/roadmap.html`, the `var MILESTONES = [` array — found by name | Milestones, task ids and text, `depends`, acceptance, the revision's evidence line |
| 2 | Tracked state | Artifact store of <https://claude.ai/artifact/78AnkdAhofw8UWt4qQs8tm>, collections `tracking`, `milestones` | The user's ticks and milestone status/target/note |
| 3 | Artifact of record | Per-task probes in [probes.json](probes.json), run against git refs and worktrees | Whether the code a task adds exists, and where: main, an unmerged branch, or uncommitted |
| 4 | Version control | `git` branches, worktrees, `master`/`staging`, commits since the last `docs/roadmap.html` commit | Unmerged work, what is in flight, what landed since the plan was written |
| 5 | Checks | `npm test` and `npm run content -- validate` | Whether the main checkout's working tree passes, now |

**Step 1 — the store (read only).** Load `ArtifactData`, then two reads into a scratch directory:

```
ArtifactData action:"list" url:"https://claude.ai/artifact/78AnkdAhofw8UWt4qQs8tm" collection:"tracking"   out_dir:"<scratchpad>/roadmap-db"
ArtifactData action:"list" url:"https://claude.ai/artifact/78AnkdAhofw8UWt4qQs8tm" collection:"milestones" out_dir:"<scratchpad>/roadmap-db"
```

Shapes: `tracking/<task-id>` → `{done, at}`; `milestones/<milestone-id>` → `{status, target, note, at}`,
status one of `not_started | in_progress | blocked | done`. If a list says "No documents matched",
the user has not ticked anything yet — say so in one line; the report's tick columns are then all
zero, which is true, not missing. If a read fails, say the store was unreadable and run the script
without `--db`. Never `set`, `update` or `batch`, and never republish the page to read it.

**Step 2 — everything else**, from the repo root (allow ~30 s; `npm test` is ~4 s of it):

```bash
node .claude/skills/progress/gather.mjs [scope] --db "<scratchpad>/roadmap-db"
```

It prints one JSON document: `overall`, `milestones[]`, `tasks[]` (each with `ticked`, `evidence`:
`main | branch | uncommitted | none | human-only | unassigned`, `onBranches`, `uncommitted`,
`human`), `startable.byTicks` / `startable.byRepo`, `drift`, `git` (worktrees, unmerged branches
with their commits, `sinceRevision`, `release`), and `checks` (`tests`, `validate`, and which tree
they ran on). Add `--no-test` only when the user asked for a quick look, and then say tests were not
run.

### Reading the evidence

The artifact of record here is **the code itself, located by probe**: each task in
[probes.json](probes.json) names a file that must exist or a pattern that must match in named
paths (`m4-format` → `content/site/layout.json`; `m4-cli` → a `layout:` command in
`admin/cli.js`; `m3-merge` → `admin/src/ui.jsx` on main only; `m1-master` → main is an ancestor of
`origin/master`). Probes run against `content-admin-restructure`, every branch not merged into it,
and every worktree with uncommitted changes.

- `main` — the code is on `content-admin-restructure`. Strongest evidence this repo has.
- `branch` — only on an unmerged branch (named). Built, not integrated.
- `uncommitted` — only in a dirty worktree (named). Someone is on it right now.
- `none` — no trace anywhere.
- `human-only` — no probe can show it (an agent trial, the user's review, a staging round). Only
  the user's tick speaks for it; report the tick, and say nothing in git can confirm it.

A probe hit is **evidence the code exists, not that the acceptance test passes.** Quote the
milestone's `accept` line next to its count. Tasks with a `human` note have a probe *and* a part
only a person can judge (R1 node shape, R5 readability) — report both halves.

The `evidence` line inside each milestone of `docs/roadmap.html` is what the repo showed when that
revision was written (`plan.revisions`). It is neither a tick nor current; when it disagrees with
the probes, the probes are newer.

## 2. Report

Keep it to about a screen. Lead with the numbers.

1. **Overall, in two readings.** `ticked / total` by the user's ticks, and `onMain / total` by the
   repo, with the in-flight milestone under each: `inFlightByTicks` (first milestone whose store
   status is not `done` — the page's own rule) and `inFlightByRepo` (first milestone whose probed
   code is not all on main; the release step and human-only tasks do not hold it back). When they
   differ, that gap is the headline. **When scoped, these lines stay whole-roadmap**, followed by
   the scope's own `ticked / onMain / total`.
2. **One row per milestone** — code, name, ticked `x / y`, on main `x / probed`, store status,
   target if set. When scoped to a module, show only milestones holding a task in scope, count only
   those, and mark the row **partial**: `M4 · 1 / 1 in scope (5 elsewhere)`.
3. **The in-flight milestone expanded in full** — every task in scope: id, tick, evidence (with the
   branch or worktree named). If the two in-flight readings differ, expand the repo's one and give
   the ticks' one a line. Never trim this to the options you will offer.
4. **What each milestone can show.** For each milestone with any evidence: the commits behind it
   (from `git.unmerged[].commits`, `sinceRevision`, or the hashes in the plan's evidence line),
   the checks (`checks.tests`: "17 / 17 pass on the main checkout's working tree, just now";
   `checks.validate`: projects and error count), and the branch it is waiting on. Show, briefly —
   one line per milestone, `git log --oneline` style.
5. **Startable now** — every task in `startable.byRepo`, and separately `startable.byTicks` if it
   differs ("by your ticks only M1 is open, because no milestone is marked Done"). Split code tasks
   from waiting ones (`waiting: true` — an agent trial, a review, a staging round): a waiting task
   costs a minute to start and then runs beside code work.
6. **Drift** — only the entries that are non-empty:
   - `tickedNoCommit` — ticked, but the code is not on main (name where it is, if anywhere).
   - `committedNotTicked` — on main, unticked. Ordinary; list it so the user can tick it. Never tick
     it for them.
   - `inFlightElsewhere` and `unmergedBranches` — branch, ahead/behind main, worktree, dirty count,
     and which tasks live there. A branch `behind` main is missing main's commits (R4).
   - `mainNotInMaster` — commits on main that are not live; this is `m1-master`'s real state.
   - `statusVsTicks` — milestone status `done` with unticked tasks, or every task ticked and status
     not `done`. Show both sides.
   - `skipped` — unticked tasks in a milestone before the ticks' in-flight one.
   - `orphanTicks`, `orphanMilestoneState` — store ids not in the plan (a renamed id).
   - `unassignedTasks`, `staleProbes` — plan and probes.json out of step; the fix is an edit to
     probes.json, which this report names but does not make.
   - `dirtyMain` — uncommitted files in the main checkout; the checks ran on them.
7. **Cross-module blocking, scoped runs only.** If a task in scope sits in a milestone whose
   `depends` are not met, name the blocking milestone and the module its open tasks belong to. If
   nothing in scope is startable for that reason, say so first.

### Which tasks are concurrent

Dependencies exist only between milestones (`depends: "M2, M3"`); tasks inside a milestone carry
none. So inside a milestone whose dependencies are met, **every unticked task without evidence is
startable at once** — say that, rather than implying an order the plan does not contain.

Take a task out of the set, and say why, when:

- **It is already in flight** — `evidence` is `uncommitted` or `branch`. Name the worktree or
  branch; another session (in `.claude/worktrees/`) is likely on it.
- **It collides with another open task.** The real collisions here: `admin/server/store.js` is
  shared by the CLI and the admin API, so a `cli` task and an `admin` task that both add validation
  meet there; `content/site/layout.json` and `src/lib/content/sectionTypes.js` are touched by every
  M4–M6 format, site and CLI task; `admin/src/App.jsx` by every admin task. Two writers on those
  need one worktree each and a merge plan.
- **A tick is a lie** — ticked with no code on main, so its dependents are not really unblocked.
- **It waits on a merge.** M4 depends on M3, which is built on `claude/admin-ux-refine-dbb226` and
  not merged; until `m3-merge` lands, M4 work sits on a branch that had to merge M3 itself.

If everything open in scope is a waiting task, say so and name what opens next.

Figures are as of this run: tests and validate ran on the main checkout's working tree at
`checks.tree` (including its uncommitted files); remote refs (`origin/master`, `origin/staging`)
are as of the last `git fetch`, which this skill never runs. The plan's own figures ("17 tests
pass", "7 projects, 0 errors") are as of its revision date.

## 3. Ask

One `AskUserQuestion`, one question: **which task to start.**

- Draw from `startable.byRepo` in roadmap order; skipped work first, then the first open task,
  marked *(Recommended)*.
- If the set holds a waiting task and a code task, offer at least one of each.
- Label options with the task id; the description says what shipping it means.
- Four options at most. Name every startable id left off the ballot in the line under it.
- Scoped: offer only tasks in scope; if none is startable, offer the nearest task that unblocks it
  and name its module. Do not widen the scope to fill the list.

## After they choose

1. Quote the task id and its text from `docs/roadmap.html` verbatim.
2. Read what it touches first: `docs/content.md` (content model, "Agent / CLI editing"),
   `docs/architecture.md`, `docs/release.md` for release tasks, and `docs/roadmap.html`'s risks
   (R1–R7) for the milestone. Writers work in their own worktree when another session is on the
   branch.
3. Done means: `npm test` passes, `npm run content -- validate` is clean, `npm run lint` passes,
   and, for anything the site or admin renders, it was checked in the browser preview.
4. **Ticks are the user's.** Tell them which boxes in the roadmap to tick; never write the store,
   and never put progress into `docs/roadmap.html` (`docs/roadmap.md`). If the plan itself changes
   shape, that is a new roadmap revision through the living-plan skill, republished to the same
   URL. If a new task id is added to the plan, add its entry to `probes.json` in the same change.

## Local quirks

- **The store starts empty.** Until the user ticks, the ticks' reading puts everything at M1 while
  the repo is two or three milestones on. That gap is the finding, not an error in either source.
- **`m1-master` is about the main line, not the old merge.** `master` already holds PR #1
  (`b737ec2`, the first M1 work); later main commits are not live. Report the count of main commits
  missing from `origin/master`, not "M1 merged".
- **The M4 branch contains M3.** `claude/beautiful-bose-7f6dc8` (session "Content-driven site
  layout") merged `claude/admin-ux-refine-dbb226` into itself, so M3 probes hit on both branches.
  That is one piece of work in two places, not two.
- **Probe traps already in the tree:** `admin/src/ThemeEditor.jsx` posts messages to a preview
  iframe and previews at phone/tablet/desktop, and the admin already drags projects and media — so
  `postMessage`, `tablet` and `drag` are not evidence for M5/M7. The probes avoid them; keep it that
  way when editing probes.json.
- **`npm test` is safe to run here**: the CLI tests write only under `os.tmpdir()` via
  `PORTFOLIO_ROOT`. `npm run content -- release` is not — it builds, deploys to staging or pushes
  `master`.
- **The main checkout often has an uncommitted content edit** (e.g. `content/projects/order.json`
  from the admin). The checks include it; say so when `dirtyMain` is non-empty.
- `.release-tested.json` (gitignored) holds the last passed Test; the admin's gate reads it. The
  report does not.
- Another session may be committing on `content-admin-restructure` while you report; if `main.sha`
  in the output is not `git rev-parse --short HEAD` afterwards, say the report is one commit behind.

## Never

- Never tick anything, and never write to the artifact store (`set`, `update`, `delete`, `batch`)
  or to `docs/roadmap.html`. Reporting observes; the ticks are the user's.
- Never invent tick state. An empty store is reported as empty.
- Never rename a task id. It is the join key between the plan, the store and probes.json.
- Never resolve drift silently. Show both sides.
- Never shorten the in-flight milestone's task list to the four that fit the question.
- Never widen an unresolved scope name to the whole roadmap.
- Never report a scoped milestone count without marking it partial.
- Never call a probe hit "done": it shows the code exists, not that the acceptance test passes.
- Never run `npm run build`, `npm run content -- release`, `git fetch`, `git pull` or a deploy to
  produce a report.
- Never republish the roadmap artifact to read its store.
