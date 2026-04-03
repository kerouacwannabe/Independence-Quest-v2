# Independence Quest migration breadcrumbs

This app was migrated from a single-file HTML build to a Vite + TypeScript app.

## Rollback anchors

- **Pre-refactor git tag:** `independence-quest-pre-vite`
- **Refactor commit:** `b5c589a` — `Refactor Independence Quest into Vite TypeScript app`
- **Original single-file source kept at:**
  - `/root/.openclaw/workspace/independence-campaign.html`
  - `/root/.openclaw/workspace/artifacts/2026-04-02/independence-campaign.html`

## Fast rollback options

### Option 1: revert the refactor commit

```bash
git revert b5c589a
```

That is the cleanest full rollback because it restores:
- the old `docs/` Pages output
- the old Pages workflow behavior
- the pre-Vite structure

### Option 2: inspect the pre-refactor snapshot without changing anything

```bash
git show independence-quest-pre-vite:docs/index.html | head
```

You can also diff the old version against the new source:

```bash
git diff independence-quest-pre-vite..HEAD -- docs independence-quest .github/workflows/deploy-pages.yml
```

## Why the original file was kept

The root-level `independence-campaign.html` remains in place as a human-readable fallback snapshot of the pre-module game structure, so this migration is not a one-way door.
