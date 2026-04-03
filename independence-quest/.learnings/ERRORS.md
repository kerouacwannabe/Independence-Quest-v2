# Errors

Command failures and integration errors.

---

## [ERR-20260403-001] npm-install-react-plugin

**Logged**: 2026-04-03T04:09:00Z
**Priority**: medium
**Status**: pending
**Area**: config

### Summary
Installing latest @vitejs/plugin-react failed because the repo is on Vite 5 and plugin-react 6 expects Vite 8.

### Error
```
peer vite@"^8.0.0" from @vitejs/plugin-react@6.0.1
```

### Context
- Command attempted: npm install -D @types/react @types/react-dom @vitejs/plugin-react
- Existing project dependency: vite ^5.4.10
- Fix is to install a Vite-5-compatible plugin-react release.

### Suggested Fix
Pin @vitejs/plugin-react to a Vite 5 compatible version (e.g. 4.x) instead of latest.

### Metadata
- Reproducible: yes
- Related Files: package.json

---
