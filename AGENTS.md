# AGENTS.md - Operational Guide

Keep this file under 60 lines. It's loaded every iteration.

## Build Commands

```bash
npm run build          # Production build (Vite)
npm run dev            # Development server
```

## Test Commands

```bash
npm run test:run       # Run tests once (Vitest + jsdom)
```

## Validation (run before committing)

```bash
npm run check          # typecheck + lint + format:check + knip
```

## Project Structure

```
src/
  api/        — API module (@api/*)
  config/     — Zod-validated config (@config/*)
  core/       — Domain logic (@core/*)
  types/      — Shared types (@types/*)
  utils/      — Logger, helpers (@utils/*)
  content/    — YAML concept files (30 Buddhist concepts)
```

## Path Aliases

`@/*`, `@api/*`, `@core/*`, `@utils/*`, `@config/*`, `@types/*`

## Conventions

- TypeScript strict mode
- ESLint 9 flat config + Prettier (4-space indent, single quotes, trailing commas)
- Vitest with jsdom environment
- Knip for dead code detection — remove unused exports

## Content Schema

Each YAML concept has: id, title, pali, sanskrit, category, related[], brief, essentials, deep, examples[{source, text, commentary}]

## Project Notes

- PWA already configured via vite-plugin-pwa
- Logger and helpers (retry, debounce, throttle) already implemented
- Zod config system already in place
