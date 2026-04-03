# Mobile Rebuild Status

## Implemented in this slice

- React + TypeScript app entry (`src/main.tsx`)
- Zustand store for app shell state and lightweight game persistence (`src/state/store.ts`)
- Feature-first structure:
  - `src/app/shell/*`
  - `src/features/today/*`
  - `src/features/quests/*`
  - `src/features/map/*`
  - `src/features/toolkit/*`
  - `src/features/profile/*`
  - `src/state/*`
- Mobile-first shell with:
  - compact HUD/top bar
  - bottom nav
  - Today / Quests / Map / Toolkit / Profile screens
  - compact expandable quest cards
  - minimap / chapter path screen
  - next-move card always available near the bottom shell

## Reused legacy logic/content

- `src/content.ts` remains the source of chapter, quest, class, rescue, and low-energy content.
- `src/defaults.ts` storage keys and default state are reused.
- Local storage compatibility is preserved for the current slot and the old slot1 fallback key.

## Still legacy / not yet migrated

- Old DOM-renderer modules still exist in the repo (`game.ts`, `ui.ts`, `rendering.ts`, `actions.ts`) as rollback/reference material.
- The new React shell currently reimplements only the Phase 1 flow needed for mobile use:
  - start quest
  - expand quest cards
  - toggle subquests
  - complete quest from required steps
  - current chapter / next move representation
- The following systems still need React-native migration if we keep pushing:
  - campaign setup / Chapter 0 wizard
  - bosses and boss actions
  - blocked / waiting modal flows
  - rogue / monk / wizard perk interactions beyond basic content presence
  - save-slot switching/import/export UI
  - richer reward / celebration / audio / particle systems
  - full PWA manifest + service worker/offline install experience

## Practical next slice

1. Add a real React setup flow for Chapter 0.
2. Bring boss progression into the Map + Quests screens.
3. Move blocked/waiting flows into bottom sheets.
4. Add PWA install/offline support.
