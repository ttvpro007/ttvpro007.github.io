# Releasing: test → stage → live

Nothing reaches the public site until it has been built and checked. The admin's **Release** page walks through it; the same steps work by hand.

## 1. Test (local, always)

*Release → Build & test* validates every non-draft project, runs the production build, and serves `dist/` at `http://localhost:4173` — exactly what will be deployed (drafts excluded, media copied, minified).

The admin records a fingerprint of what was tested: every file under `content/`, the current commit, and uncommitted code changes. **Stage** and **Go live** stay locked until that fingerprint matches the current state, so any edit after testing requires a new test. The passed fingerprint is saved in `.release-tested.json` (gitignored), so restarting the dev server doesn't undo a Test.

By hand: `npm run build && npm run preview`.

## 2. Stage (optional)

Atelier deploys the staging site, a separate site for checking on real phones and browsers before going live. From the Atelier checkout (`Business/atelier`):

```bash
cd ../../Business/atelier
npm run atelier -- site deploy portfolio preview   # builds this checkout for staging, publishes dist/ to the staging repo, records the job
```

It asks for the studio secret-store passphrase. It builds with `BASE_PATH=/portfolio-staging/` and `SITE_ENV=staging`, so `dist/` afterwards holds the staging build: rebuild before a production `--dry-run`. A preview `--dry-run` doesn't build either; it compares whatever is in `dist/`, so it is only meaningful after a staging build (`BASE_PATH=/portfolio-staging/ SITE_ENV=staging npm run build`; from Git Bash prefix `MSYS_NO_PATHCONV=1` so the path isn't rewritten).

**Flags from PowerShell:** `npm run atelier -- … --dry-run` loses the `--` there, npm takes `--dry-run` as its own flag, and the command runs as a real deploy. Pass flags with `node packages/cli/bin/atelier.js site deploy portfolio preview --dry-run` instead (same folder), or run npm from Git Bash.

*Push to staging* in the admin commits `content/` and force-pushes the current commit to the `staging` branch. CI only lints, tests and builds it (with the staging base path, so a base-path break shows up there); it doesn't deploy. Until the admin calls Atelier, run the command above after it. The `staging` branch is a throwaway mirror, overwritten on every stage.

### Setup (done 2026-10-11)

GitHub Pages allows one site per repository, so staging lives in a second repo:

| Piece | Value |
|---|---|
| Staging repo | [ttvpro007/portfolio-staging](https://github.com/ttvpro007/portfolio-staging) (public, Pages from `gh-pages`) |
| Staging URL | https://ttvpro007.github.io/portfolio-staging/ |
| Atelier | `site_portfolio`'s host block has `preview: { repo: 'ttvpro007/portfolio-staging', basePath: '/portfolio-staging/' }`; the deploy uses the site's `github.token` secret in the studio store, the same one as production |
| This repo, variable | `STAGING_BASE_PATH` = `/portfolio-staging/`: CI's staging build check |

Staging builds set `SITE_ENV=staging`: the page gets `noindex, nofollow` and a `[staging]` title prefix so search engines skip it and a staging tab is easy to tell apart.

The build supports serving under a sub-path via `BASE_PATH`: media URLs, CSS assets and root-relative paths in `content/site/profile.json` follow it. Root-relative paths hard-coded in components would not — keep asset paths in content or CSS.

## 3. Go live

*Go live* (only on `master`) commits `content/` with your message, pushes `master`, then runs Atelier's release of that pushed commit:

```bash
cd ../../Business/atelier
node packages/cli/bin/atelier.js site release portfolio   # what Go live runs (release.liveCommand in loom.config.js)
```

The admin asks for the Atelier secret-store passphrase in a password field and hands it to that one command as `ATELIER_PASSPHRASE`; it isn't stored, logged or shown. (Start the admin with `ATELIER_PASSPHRASE` already set and it won't ask.) The release refuses unless this checkout is exactly the pushed `master`, builds it, and publishes `dist/` to this repo's `gh-pages` branch as a commit "Release Portfolio from <sha>", which serves https://ttvpro007.github.io/. Its output shows in the Release page's log. Atelier needs `Business/atelier` beside this repo as `../../Business/atelier` and `Business/atelier-studio` beside it (registration and token).

If the release fails (wrong passphrase, GitHub down…), `master` stays pushed and the page shows Atelier's error. Fix it and press Go live again: the push is then a no-op and only the release runs. Or run the command above by hand. CI lints, tests and builds `master` but never deploys.

To see what a release would change without publishing: `node packages/cli/bin/atelier.js site release portfolio --dry-run` in `Business/atelier` (not `npm run atelier -- … --dry-run` from PowerShell, which drops the flag and releases for real; see Stage).

Only `content/` is committed by the admin. Code changes (components, styles) are committed by you as usual; the Release page warns when there are uncommitted code changes, because Test includes them but Go live would not ship them.

## CI summary

| Event | Lint + test + build | Deploy |
|---|---|---|
| Pull request → `master` | ✓ | — |
| Push `staging` | ✓ (with `STAGING_BASE_PATH`, `SITE_ENV=staging`) | — (Atelier deploys, see Stage) |
| Push `master` | ✓ | — (Atelier deploys, see Go live) |

CI deploys nothing. Newer pushes cancel an in-progress run for the same branch.
