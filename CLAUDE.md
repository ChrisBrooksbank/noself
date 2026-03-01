# CLAUDE.md — noself

## Project

Buddhist contemplation PWA built with TypeScript + Vite.

## Commands

- `npm run check` — typecheck + lint + format:check + knip (run before committing)
- `npm run test:run` — run tests once
- `npm run dev` — start dev server

## Structure

```
src/
  api/        — API module (@api/*)
  config/     — Zod-validated config (@config/*)
  core/       — Domain logic (@core/*)
  types/      — Shared types (@types/*)
  utils/      — Logger, helpers (@utils/*)
  content/    — YAML concept files
```

## Path Aliases

`@/*`, `@api/*`, `@core/*`, `@utils/*`, `@config/*`, `@types/*` — configured in tsconfig.json and vite.config.ts.

## Features

- **Logger** (`@utils/logger`) — leveled logging with timestamps and debug mode
- **Helpers** (`@utils/helpers`) — retryWithBackoff, debounce, throttle, IntervalManager
- **Zod Config** (`@config/*`) — validated app config via `loadConfig()` / `getConfig()`
- **PWA** — vite-plugin-pwa with service worker and manifest

## Conventions

- ESLint 9 flat config + Prettier (4-space indent, single quotes, trailing commas)
- Husky pre-commit: typecheck + lint-staged
- Knip for dead code detection
- Vitest with jsdom environment
