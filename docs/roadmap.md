# Roadmap

The milestone plan for the site builder is a living plan: [docs/roadmap.html](roadmap.html), published at <https://claude.ai/artifact/78AnkdAhofw8UWt4qQs8tm>.

- **The plan** (milestones, deliverables, risks, scope, revisions) lives in `roadmap.html`. Regenerate it and republish it to the same URL, and add a row to its revision log whenever the plan changes shape.
- **Progress** (ticks, status, target dates, notes) lives in the artifact's own store, keyed by the task and milestone ids in `roadmap.html`. **Never write progress state into the HTML**, and never rename an id: a renamed id orphans its tick.
- Milestone `mx` (coded MX, between M4 and M5) is the split of this prototype into Loom and `@loom/kit-portfolio`. It is not numbered, so M5–M8 keep their names. After MX, engine and kit work lands in the private repos under `GitHub/Business` (`loom`, `loom-kit-portfolio`); this repo only bumps package versions and edits `content/` and its own `blocks/`. Formats follow the Loom contracts in `Business/loom/docs/contracts/`.
- Task-level detail is in git history and the Claude session named on each milestone. The plan is authoritative for milestones, deliverables and risks.
