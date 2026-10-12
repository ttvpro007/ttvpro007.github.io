# Architecture

The architecture map is published at **https://claude.ai/artifact/X2MPxmnDAT8Yue6rJ6gQZK** (private to the owner until shared). Its source is [`architecture.html`](architecture.html) in this folder.

It covers the content pipeline (`content/` → `plugins/content.js` → `virtual:projects` → `toViewModel` → components), the site structure (`content/site/layout.json` → `visiblePages` → `SitePage` → section components), the media/link/field/theme/section registries, theming, the local admin and headless CLI (both on `admin/server/store.js`), and the release gate (test → stage → live).

## Updating it

1. Re-measure every figure it states (project count, media by type, pages and sections, registry sizes, API routes, CLI commands, test count, line counts, content size). Don't carry numbers forward.
2. Edit `architecture.html`, then republish **to the same URL** above. Never publish a second copy.
3. Re-pin the footer to the commit you measured at.

Which document owns what:

| Question | Where |
|---|---|
| How do I add/edit a project, media type, link type, theme? | [content.md](content.md) |
| How do I test and ship? | [release.md](release.md) |
| How does it fit together, and what's unresolved? | the architecture map (this) |
| Unity builds specifically | [unity-webgl.md](unity-webgl.md) |
