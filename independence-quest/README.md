# Independence Quest

Vite + TypeScript source for the Independence Campaign / Independence Quest static site.

## Commands

- `npm install` — install dev dependencies
- `npm run dev` — start the local Vite dev server
- `npm run build` — build the production site into `../docs`
- `npm run preview` — preview the production build locally

## Structure

- `src/main.ts` — app entrypoint
- `src/styles.css` — extracted game styles
- `src/appMarkup.ts` — extracted game HTML shell
- `src/content.ts` — campaign data, classes, chapters, rewards, rescue content
- `src/defaults.ts` — storage keys and default app state factories
- `src/formatting.ts` — date and HTML-escaping helpers
- `src/moduleContext.ts` — live proxy bridge for shared mutable game state across modules
- `src/rendering.ts` — DOM rendering for the header, quests, panels, and setup flow
- `src/actions.ts` — quest, boss, save-slot, audio, celebration, and mutation logic
- `src/ui.ts` — event wiring, modal handling, and flow controls
- `src/game.ts` — mount/wiring layer plus core selectors and storage helpers
- `scripts/postbuild.mjs` — copies the built `index.html` to `404.html` and restores `.nojekyll`

## Deployment

GitHub Pages deploys from the repository `docs/` directory. The workflow now rebuilds `docs/` from this source app before deploying.

## Rollback breadcrumbs

- pre-refactor tag: `independence-quest-pre-vite`
- refactor commit: `b5c589a`
- migration notes: `MIGRATION.md`
- preserved single-file fallback: `../independence-campaign.html`
