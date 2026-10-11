# Releasing: test → stage → live

Nothing reaches the public site until it has been built and checked. The admin's **Release** page walks through it; the same steps work by hand.

## 1. Test (local, always)

*Release → Build & test* validates every non-draft project, runs the production build, and serves `dist/` at `http://localhost:4173` — exactly what will be deployed (drafts excluded, media copied, minified).

The admin records a fingerprint of what was tested: every file under `content/`, the current commit, and uncommitted code changes. **Stage** and **Go live** stay locked until that fingerprint matches the current state, so any edit after testing requires a new test.

By hand: `npm run build && npm run preview`.

## 2. Stage (optional, needs one-time setup)

*Push to staging* commits `content/` and force-pushes the current commit to the `staging` branch. CI builds it and publishes it to a separate staging site, so you can check it on real phones and browsers before going live. The `staging` branch is a throwaway mirror — it is overwritten on every stage.

### One-time setup

GitHub Pages allows one site per repository, so staging lives in a second repo:

1. Create an empty public repo, e.g. `ttvpro007/portfolio-staging`. In its *Settings → Pages*, set the source to the `gh-pages` branch (it appears after the first deploy).
2. Create a fine-grained personal access token with **Contents: read & write** on that repo only.
3. In this repo (*Settings → Secrets and variables → Actions*):
   - secret `STAGING_DEPLOY_TOKEN` = the token
   - variable `STAGING_REPO` = `ttvpro007/portfolio-staging`
   - variable `STAGING_BASE_PATH` = `/portfolio-staging/`
4. Stage once from the admin. The site appears at `https://ttvpro007.github.io/portfolio-staging/`.

Until `STAGING_REPO` is set, pushes to `staging` are only linted and built (still a useful CI check).

The build supports serving under a sub-path via `BASE_PATH`: media URLs, CSS assets and root-relative paths in `content/site/profile.json` follow it. Root-relative paths hard-coded in components would not — keep asset paths in content or CSS.

## 3. Go live

*Go live* (only on `master`) commits `content/` with your message and pushes `master`. The workflow in `.github/workflows/deploy.yml` lints, builds and publishes `dist/` to this repo's `gh-pages` branch, which serves https://ttvpro007.github.io/. Watch it under the repo's *Actions* tab (linked from the Release page).

Only `content/` is committed by the admin. Code changes (components, styles) are committed by you as usual; the Release page warns when there are uncommitted code changes, because Test includes them but Go live would not ship them.

## CI summary

| Event | Lint + build | Deploy |
|---|---|---|
| Pull request → `master` | ✓ | — |
| Push `staging` | ✓ (with `STAGING_BASE_PATH`) | staging repo, if configured |
| Push `master` | ✓ | live site |

Newer pushes cancel an in-progress run for the same branch.
