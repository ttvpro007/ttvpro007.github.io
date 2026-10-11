# Content model

Everything a visitor sees comes from `content/`. The admin (`npm run admin`) edits these files; you can also edit them by hand — the dev server reloads either way.

## Projects

One folder per project: `content/projects/<slug>/`. The folder name is the project's id and URL slug (`/?project=<slug>` opens its modal).

```jsonc
// content/projects/predictive-projectile-motion/project.json
{
  "title": "Predictive Projectile Motion",
  "description": "Short text for cards",
  "longDescription": "Shown in the modal when there is no overview.md",
  "category": "Game Dev",
  "year": 2024,
  "tech": ["Unity", "C#"],
  "roles": ["Game Developer"],
  "features": ["…"],
  "cover": null,                    // media file for the card; null = first image
  "media": [                         // ordered; first gallery item shows first
    { "type": "youtube", "src": "https://www.youtube.com/watch?v=t8yccMvoEUc" },
    { "type": "image",   "src": "ppm-1.png", "caption": "optional" },
    { "type": "unity",   "src": "unity/index.html", "title": "Play in browser" }
  ],
  "links": [
    { "type": "github", "url": "https://github.com/…" }
  ],
  "featured": false,                 // the hero slot on the Projects page
  "showOnResume": false,
  "resumeOrder": 2,
  "draft": false                     // drafts show locally, never in builds
}
```

- Local `src` values are relative to the project's `media/` folder. Absolute `https://` URLs also work.
- `overview.md` can reference its own media: `![screenshot](media/ppm-1.png)`.
- Order: `content/projects/order.json` (array of slugs). Projects not listed go last, newest first.
- Field definitions, validation and the site view model: [`src/lib/content/projectSchema.js`](../src/lib/content/projectSchema.js). Adding a field to `PROJECT_FIELDS` makes it editable in the admin automatically.

## Media types

Registry: [`src/lib/content/mediaTypes.js`](../src/lib/content/mediaTypes.js). Renderers: [`src/components/features/projects/media/renderers.jsx`](../src/components/features/projects/media/renderers.jsx).

| type | source | where it shows |
|---|---|---|
| `image` | uploaded file | modal carousel; first one is the card cover |
| `video` | uploaded mp4/webm | modal carousel |
| `youtube` | URL (any YouTube link form) | modal carousel |
| `embed` | URL for an iframe (Sketchfab, itch.io embed…) | modal carousel |
| `unity` | uploaded build folder | its own tab in the modal + a Live Demo button |

**Adding a type** (e.g. `model3d`): add an entry to `MEDIA_TYPES` (label, icon, `placement: 'gallery' | 'playable'`, `source: 'file' | 'folder' | 'url'`, extensions), then add `{ View, Thumb }` to `MEDIA_RENDERERS`. The admin's upload panel and the modal pick it up from there.

Uploads: large PNG/JPEG are resized to ≤2400px and converted to WebP (toggle in the admin; uses `sharp`). A Unity build is uploaded as a folder and must contain `index.html` at its top level.

## Link types

Registry: [`src/lib/content/linkTypes.js`](../src/lib/content/linkTypes.js) — `demo`, `github`, `itchio`, `steam`, `appstore`, `website`, `docs`. Each link becomes a button in the modal, ordered as in the registry. Pasting a URL in the admin guesses its type. Add a type with one entry.

## Theme

`content/theme.json` holds named presets and the `active` one:

```jsonc
{
  "active": "arcade-gold",
  "presets": {
    "arcade-gold": {
      "label": "Arcade Gold",
      "colors": { "primary": "#EEB64B", "secondary": "#FC9460", "accent": "#E54264", "highlight": "#A92F5F",
                  "success": "#64A47F", "background": "#181622", "surface": "#221B36", "surfaceAlt": "#442261",
                  "text": "#F3F3F3", "textMuted": "#B8B8B8", "border": "#3A3A3A" },
      "fonts": { "heading": "Orbitron", "body": "Rajdhani" },
      "radius": 16
    }
  }
}
```

[`src/lib/theme/applyTheme.js`](../src/lib/theme/applyTheme.js) maps these onto CSS custom properties at startup and loads the Google Fonts. Every stylesheet reads colors from those properties (shades via `color-mix()`), so a preset restyles the whole site. The admin's Theme page edits presets with a live preview at phone/tablet/laptop/wide sizes and checks text contrast.

**Rule for code changes:** never hard-code a theme color in a component — use `var(--color-primary)` etc., or `color-mix(in srgb, var(--color-primary) 30%, transparent)` for a translucent shade. Token → variable mapping is `THEME_TOKENS`.

## Site text

`content/site/profile.json` (bio, skills, journey, socials, home cards), `navigation.json`, `uiContent.json` (labels and messages), `contact.json` (contact form). Edited as JSON in the admin's *Site content* page.

## Agent / CLI editing

`npm run content -- <command>` edits `content/` without a browser or dev server — the same operations as the admin, through the same module ([`admin/server/store.js`](../admin/server/store.js), which the admin API also calls). Built for agents and scripts:

- Success prints **JSON on stdout** (exit 0). Failures print `error: …` (plus detail lines) on **stderr** and exit **1** (validation/operation failed, nothing written) or **2** (bad usage).
- `npm run content -- --help` lists commands; `npm run content -- <command> --help` documents one. Use `npm run -s content -- …` to keep npm's banner out of stdout.
- File arguments are relative to where you run it; `-` means stdin.

| command | what it does |
|---|---|
| `list [--full]` | projects in display order with draft flag and validation errors |
| `show <slug> [--field path]` | one project, incl. `overview`, `mediaFiles`, `errors` |
| `create <title> [--set …]` | new **draft** project, first in `order.json` |
| `update <slug> --set field=value … / --unset field / --json file\|- [--replace] [--force]` | change fields (see below) |
| `rename <old> <new>` | rename the folder/slug, update `order.json` |
| `delete <slug>` | move to `.trash/` (recoverable), drop from `order.json` |
| `overview <slug> [--raw] / --file file\|- / --clear` | read or write `overview.md` |
| `media list <slug>` | media list, cover and files on disk |
| `media add <slug> <file\|folder\|url> [--type --caption --title --cover --no-optimize]` | upload like the admin: images → WebP (≤2400px), a folder must be a Unity build with `index.html` on top, URLs become `youtube`/`embed` |
| `media remove <slug> <index\|src>` | remove an item; clears `cover`, trashes the file/build folder once unused |
| `order` · `order set <slug…>` · `order move <slug> <pos>` | display order (unknown/duplicate slugs refused) |
| `theme` · `theme active <preset>` · `theme preset <name> [--set colors.primary=#hex …] [--json …] [--delete]` | theme presets |
| `site` · `site <id> [--field path] [--set path=value …] [--json …]` | `content/site/<id>.json` |
| `validate` | everything `npm test` checks about content, plus schema errors; exit 1 if not ok |
| `release status` · `release test [--serve]` · `release stage -m …` · `release publish -m …` | the admin's Test → Stage → Go live gate ([release.md](release.md)) |

**`--set` values** follow the field's kind in `PROJECT_FIELDS`: `year=2024`, `draft=false`, `tech="Unity, C#"` (comma list, or a JSON array), text as-is. Other keys (`cover`, `media`, `links`) and dotted paths (`media.0.caption=Boss fight`) take JSON, falling back to a plain string — quote a JSON string (`'"2024"'`) to force text. Theme and site `--set` work the same way on dotted paths.

**Guard rails:** `update` refuses unknown fields (typos) and refuses to save a non-draft project that fails validation — keep `draft=true` until `title`, `description`, `category` and `year` are filled, then `--set draft=false`. `--force` overrides both.

Typical agent session:

```bash
npm run -s content -- create "Orbit Runner" --set category="Game Dev" --set description="Endless runner on a tiny planet" --set tech="Unity, C#"
npm run -s content -- media add orbit-runner ./shots/title.png --cover
npm run -s content -- media add orbit-runner ./Builds/WebGL          # Unity build folder
npm run -s content -- overview orbit-runner --file ./orbit-overview.md
npm run -s content -- update orbit-runner --set draft=false
npm run -s content -- order move orbit-runner 0
npm run -s content -- validate
npm run -s content -- release test     # then: release stage / release publish (on master)
```

`PORTFOLIO_ROOT=<dir>` points the CLI at another checkout's `content/` (the tests in `tests/content-cli.test.js` run it against a temp copy).
