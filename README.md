# 🎮 Vi Tiet's Portfolio — [live](https://ttvpro007.github.io/)

A gamer-themed portfolio built with React 19 + Vite 7. All content — projects, media, site text, and the theme — lives in [`content/`](content/) and is edited through a local admin GUI. The site rebuilds from that folder; no code changes are needed to add a project or restyle the site.

## Quick start

```bash
npm install
npm run admin      # site at http://localhost:5173, admin opens at /admin/
```

Node 20+. `npm run dev` runs the site without opening the admin (the admin is still at `/admin/`).

## Everyday workflow

1. **Edit** — `npm run admin`. Create or edit projects, drop in images/videos, upload a Unity WebGL build folder, paste YouTube links, write the overview in Markdown, pick or tweak a theme. Every save shows up immediately in the site tab.
2. **Test** — *Release → Build & test* builds the production site and serves it at `http://localhost:4173`. Click through it.
3. **Stage** *(optional)* — commits `content/`, pushes the `staging` branch, then runs Atelier's preview deploy (`node packages/cli/bin/atelier.js site deploy portfolio preview` in `Business/atelier`) to a separate staging site (https://ttvpro007.github.io/portfolio-staging/) for checking on real phones, asking for the Atelier passphrase. CI only checks it. Details in [docs/release.md](docs/release.md).
4. **Go live** — unlocks only after Test passes for the exact current content. Commits `content/`, pushes `master`, then runs Atelier's release of that commit (`node packages/cli/bin/atelier.js site release portfolio` in `Business/atelier`), asking for the Atelier passphrase. CI only checks it.

## Where things live

| Path | What |
|---|---|
| `content/projects/<slug>/project.json` | One project: text fields, ordered `media` list, `links` |
| `content/projects/<slug>/overview.md` | Optional long-form write-up shown in the project modal |
| `content/projects/<slug>/media/` | That project's images, videos, Unity builds |
| `content/projects/order.json` | Display order (drag to reorder in the admin) |
| `content/theme.json` | Theme presets and which one is live |
| `content/site/layout.json` | Site structure: pages in the nav and each page's ordered sections (admin → Site map) |
| `content/site/*.json` | Profile, navigation, UI text, contact form |
| `loom.config.js` | Names the kit (`@loom/kit-portfolio`) the engine loads |
| `src/main.jsx` | Entry point: global styles, the live theme, the kit's site shell |

The engine and the kit are installed packages, not code in this repo: `@loom/core` (registries, the content plugin, the store and the release gate), `@loom/blocks` (general components, the site shell, global styles, `applyTheme`), `@loom/builder` (the local admin; never shipped), `@loom/cli` (`npm run content`) and `@loom/kit-portfolio` (the project schema, Unity/embed media, every section and page). Their source is in the private `loom` and `loom-kit-portfolio` repos.

They are private packages on GitHub Packages (`@ttvpro007/loom-*`), installed under their `@loom/*` names through npm aliases in `package.json`; `.npmrc` points the `@ttvpro007` scope at `npm.pkg.github.com`. Installing needs a `read:packages` token in `NODE_AUTH_TOKEN`, e.g. `NODE_AUTH_TOKEN=$(gh auth token --user ttvpro007) npm install` (full steps: loom `docs/guides/installing-packages.md`). CI uses the job token, so each package grants this repo Actions read access.

Architecture map: [docs/architecture.md](docs/architecture.md) · Details: [docs/content.md](docs/content.md) (content model, adding media/link types, theming) · [docs/release.md](docs/release.md) (test → stage → live, CI) · [docs/unity-webgl.md](docs/unity-webgl.md) · [docs/css-analysis.md](docs/css-analysis.md)

## Scripts

| Command | Does |
|---|---|
| `npm run admin` | Dev server + opens the admin |
| `npm run dev` | Dev server |
| `npm run build` | Production build to `dist/` (drafts excluded) |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |

## Easter egg

↑ ↑ ↓ ↓ ← → ← → B A

## Credits

[Kenney](https://kenney.nl) cursor pack · Framer Motion · Vite
