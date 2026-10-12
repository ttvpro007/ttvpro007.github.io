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
3. **Stage** *(optional)* — *Push to staging* deploys to a separate staging site for checking on real phones. One-time setup in [docs/release.md](docs/release.md).
4. **Go live** — unlocks only after Test passes for the exact current content. Commits `content/`, pushes `master`, GitHub Actions deploys.

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
| `src/lib/content/` | Registries: media types, link types, section types, project schema |
| `plugins/content.js` | Vite plugin turning `content/` into site data and serving media |
| `admin/` | The local admin (UI + dev-server API; never shipped) |

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
