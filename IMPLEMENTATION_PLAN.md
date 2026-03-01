# Implementation Plan

## Status

- Planning iterations: 1
- Build iterations: 0
- Last updated: 2026-03-01

## Gap Analysis

### Already Implemented

- [x] TypeScript `Concept` / `ConceptExample` / `ConceptCategory` / `ConceptId` types (`src/content/concepts/index.ts`)
- [x] All 30 YAML concept files in `src/content/concepts/`
- [x] PWA manifest + icons (vite-plugin-pwa configured, icons in `public/`)
- [x] Service worker auto-generation via vite-plugin-pwa
- [x] Config / logger / helpers infrastructure

### Not Implemented (everything UI and feature logic)

- No YAML loader / concept data service
- No UI rendering (no framework, no components, no CSS)
- No routing between views
- No daily concept selection
- No localStorage reading history / progress
- No catalog / search / filter views
- No online/offline state handling

---

## Architectural Decisions

- **No UI framework** — use vanilla TypeScript with DOM manipulation. Project has no React/Vue deps and is intentionally minimal.
- **YAML loading** — use Vite's `import.meta.glob` with `?raw` or install a YAML parser (`yaml` package). Import all 30 at build time so content is bundled and auto-cached by service worker.
- **Routing** — simple hash-based client-side router (`#/`, `#/concept/:id`, `#/catalog`). No external router dependency.
- **CSS** — vanilla CSS with custom properties. Mobile-first, no framework.
- **State** — plain TypeScript module with localStorage persistence. No state library.

---

## Tasks

### Foundation

- [x] Install `yaml` package and create `src/content/concepts/loader.ts` that imports all 30 YAML files via `import.meta.glob` and parses + validates them into `Concept[]` (spec: content-display.md)
- [x] Add base CSS (`src/styles/main.css`) with reset, custom properties (colors, typography), and layout primitives; link from `index.html` (spec: navigation-search.md)
- [x] Implement hash-based client-side router in `src/core/router.ts` supporting routes: `#/` (home), `#/catalog`, `#/concept/:id`; wire into `main.ts` (spec: navigation-search.md)

### Content Display

- [x] Create `src/core/conceptView.ts` that renders a full concept detail page (title + pali/sanskrit header, brief, essentials, deep, examples with source/commentary) to DOM (spec: content-display.md)
- [x] Add `src/utils/formatText.ts` helper that converts paragraph breaks and block-quote markers in YAML text fields into HTML (spec: content-display.md)
- [x] Render related concept IDs as clickable hash links in the concept view (spec: content-display.md)

### Daily Practice

- [x] Create `src/core/dailyConcept.ts` with a deterministic date-seed algorithm: `dayIndex = daysSinceEpoch % 30`, returns concept for today and is stable for the same calendar date (spec: daily-practice.md)
- [x] Create `src/core/readingHistory.ts` localStorage service: `markViewed(id)`, `isViewed(id)`, `getViewedIds()`, `markContemplated(id)`, `getStatus(id)` (spec: daily-practice.md)
- [x] Build home screen view in `src/core/homeView.ts`: daily concept card (title, brief, link to full view) + progress counter ("X of 30 concepts explored") + recent history list (spec: daily-practice.md)
- [x] Add contemplated / revisit toggle button in the concept detail view, persisted via `readingHistory` (spec: daily-practice.md)

### Navigation & Search

- [x] Build catalog view in `src/core/catalogView.ts`: list all 30 concepts with title, pali name, brief; show read/unread badge using `readingHistory` (spec: navigation-search.md)
- [x] Add live text search input to catalog view that filters by title, pali, sanskrit, and brief as user types (debounced via existing `debounce` helper) (spec: navigation-search.md)
- [x] Add category filter buttons to catalog view; filter list to selected category; allow "All" to show everything (spec: navigation-search.md)
- [x] Create shared `src/core/nav.ts` navigation bar component (Home / Catalog links) rendered on all views (spec: navigation-search.md)
- [ ] Ensure all views use responsive CSS: single-column on ≤320px, no horizontal overflow (spec: navigation-search.md)

### PWA & Offline

- [ ] Verify vite-plugin-pwa `globPatterns` includes bundled JS (which contains all YAML content); add smoke test that loads a concept with network disabled (spec: offline-pwa.md)
- [ ] Add online/offline status indicator in nav bar: subtle banner or icon that updates on `window` `online`/`offline` events (spec: offline-pwa.md)
- [ ] Add "Install app" prompt/instructions shown once when `beforeinstallprompt` fires (spec: offline-pwa.md)

---

## Completed

<!-- Completed tasks move here -->

## Notes

- All YAML content bundled at build time → auto-cached by service worker; no separate cache config needed for YAML files.
- `markViewed(id)` should be called automatically when the concept detail view renders.
- The router is the integration point: it dispatches to homeView, catalogView, or conceptView based on hash.
- `readingHistory` module is a shared dependency for catalog badges, home progress counter, and concept detail toggle.
