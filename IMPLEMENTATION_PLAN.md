# Implementation Plan

## Status

- Planning iterations: 4
- Build iterations: 18
- Last updated: 2026-03-12

## Gap Analysis

### Fully Implemented (specs: content-display, daily-practice, navigation-search, offline-pwa)

- [x] TypeScript `Concept` types + all 30 YAML concept files (`src/content/concepts/`)
- [x] YAML loader with Zod validation (`src/content/concepts/loader.ts`)
- [x] Base CSS with design system (`src/styles/main.css`)
- [x] Hash-based router (`src/core/router.ts`) — routes: `#/`, `#/catalog`, `#/concept/:id`
- [x] Concept detail view (`src/core/conceptView.ts`) with examples, related links, toggle
- [x] Text formatter (`src/utils/formatText.ts`)
- [x] Daily concept selection (`src/core/dailyConcept.ts`) — deterministic date seed
- [x] Reading history (`src/core/readingHistory.ts`) — localStorage persistence
- [x] Home view (`src/core/homeView.ts`) — daily card, progress, recent history
- [x] Catalog view (`src/core/catalogView.ts`) — search, category filter, read badges
- [x] Nav bar (`src/core/nav.ts`) — Home/Catalog links, online/offline status
- [x] PWA manifest + service worker (vite-plugin-pwa)
- [x] Install prompt (`src/core/installPrompt.ts`)
- [x] Responsive layout (≤320px)
- [x] Full practice system: meditations, prompts, paths, sutras, pujas, mantras

### Not Implemented — Sanskrit/Pali Enrichment (spec: specs/sanskrit-enrichment.md)

Phases 1–6 below. Data-only enrichment (types, YAML fields, validation) — no UI rendering required per spec acceptance criteria.

---

## Architectural Decisions

- **No UI framework** — vanilla TypeScript with DOM manipulation.
- **YAML loading** — Vite `import.meta.glob` with `yaml` package; all content bundled.
- **Routing** — hash-based client-side router.
- **CSS** — vanilla CSS with custom properties, mobile-first.
- **State** — plain TypeScript modules with localStorage persistence.
- **Practice section** mirrors existing patterns exactly (see `docs/practice-plan.md`).
- **Timer cleanup** — module-level `currentCleanup` callback in `main.ts` called before each route render.
- **Bell sound** — Web Audio API sine wave oscillator, `AudioContext` created lazily on first user interaction.

---

## Tasks

### Bug Fix

- [x] Fix failing nav test: `src/core/nav.test.ts` expects Home link text "Home" but nav renders brand name instead; update `nav.ts` or the test to match actual intended behavior (spec: navigation-search.md)

### Practice — Phase 1: Content Infrastructure

- [x] Create `src/content/meditations/index.ts` with `Meditation`, `MeditationStep`, `MeditationDuration` types and `MEDITATION_IDS` array (spec: docs/practice-plan.md)
- [x] Create `src/content/meditations/loader.ts` with Zod schema + `import.meta.glob` loader (mirrors `src/content/concepts/loader.ts`) (spec: docs/practice-plan.md)
- [x] Write `src/content/meditations/breath-awareness.yaml` with steps for 5/10/20 min durations (spec: docs/practice-plan.md)
- [x] Write remaining 4 meditation YAMLs: `metta.yaml` (10/15/20 min), `body-scan.yaml` (10/20 min), `vipassana.yaml` (10/20/30 min), `open-awareness.yaml` (10/20 min) (spec: docs/practice-plan.md)
- [x] Create `src/content/prompts/index.ts` with `Prompt`, `PromptDepth` types and `PROMPT_FILE_IDS` array (spec: docs/practice-plan.md)
- [x] Create `src/content/prompts/loader.ts` with Zod schema + `import.meta.glob` loader (spec: docs/practice-plan.md)
- [x] Write `src/content/prompts/anatta-prompts.yaml` with 3 prompts (beginner/intermediate/advanced) (spec: docs/practice-plan.md)
- [x] Write remaining 7 prompt YAMLs: `anicca`, `dukkha`, `metta`, `sunyata`, `dependent-origination`, `five-aggregates`, `four-noble-truths` (3-4 prompts each) (spec: docs/practice-plan.md)
- [x] Create `src/content/paths/index.ts` with `PracticePath`, `PathSession` types and `PATH_IDS` array (spec: docs/practice-plan.md)
- [x] Create `src/content/paths/loader.ts` with Zod schema + `import.meta.glob` loader (spec: docs/practice-plan.md)
- [x] Write `src/content/paths/seven-day-metta.yaml` (7 sessions combining concept study + prompts + meditations) (spec: docs/practice-plan.md)
- [x] Write remaining 2 path YAMLs: `foundations-of-mindfulness.yaml`, `exploring-non-self.yaml` (spec: docs/practice-plan.md)

### Practice — Phase 2: Data Layer

- [x] Create `src/core/practiceHistory.ts` — localStorage module tracking completed meditation sessions, sat-with prompts, path session completions (mirrors `readingHistory.ts`) (spec: docs/practice-plan.md)
- [x] Create `src/core/practice/dailyPrompt.ts` — deterministic daily prompt rotation using `daysSinceEpoch % totalPrompts` (mirrors `dailyConcept.ts`) (spec: docs/practice-plan.md)

### Practice — Phase 3: Audio + Timer

- [x] Create `src/core/practice/bellSound.ts` — Web Audio API bell tone (~800 Hz sine + harmonic, exponential gain ramp-down, lazy `AudioContext`) (spec: docs/practice-plan.md)
- [x] Create `src/core/practice/meditationTimer.ts` — timer state machine (idle → running → paused → completed) with step progression and bell-on-step callbacks (spec: docs/practice-plan.md)

### Practice — Phase 4: Routing + Nav

- [x] Extend `src/core/router.ts` with 7 new route types: `practice`, `practiceMediate`, `practiceMeditateSession`, `practicePrompts`, `practicePaths`, `practicePathDetail`, `practiceHistory` (spec: docs/practice-plan.md)
- [x] Extend `src/core/nav.ts` with "Practice" link; active when `route.type.startsWith('practice')` (spec: docs/practice-plan.md)
- [x] Extend `src/main.ts` with route cases for all 7 practice routes, add module-level `currentCleanup` mechanism (spec: docs/practice-plan.md)

### Practice — Phase 5: Views

- [x] Create `src/core/practice/practiceHubView.ts` — landing page with cards for Meditate / Prompts / Paths + practice summary stats (spec: docs/practice-plan.md)
- [x] Create `src/core/practice/meditationListView.ts` — browse all 5 meditations with title, duration options, description (spec: docs/practice-plan.md)
- [x] Create `src/core/practice/promptsView.ts` — daily prompt display + browse all prompts by concept/depth; "Sat with this" button persisted via `practiceHistory` (spec: docs/practice-plan.md)
- [x] Create `src/core/practice/pathsListView.ts` — list all 3 paths with title, session count, progress indicator (spec: docs/practice-plan.md)
- [x] Create `src/core/practice/pathDetailView.ts` — session list with completion checkboxes persisted via `practiceHistory` (spec: docs/practice-plan.md)
- [x] Create `src/core/practice/practiceHistoryView.ts` — log of all completed sessions (meditation + prompts + path sessions) with timestamps (spec: docs/practice-plan.md)
- [x] Create `src/core/practice/meditationSessionView.ts` — active timer UI with instruction display, step progression, pause/resume/stop controls, bell integration; returns cleanup function (spec: docs/practice-plan.md)

### Practice — Phase 6: Styles

- [x] Add practice CSS to `src/styles/main.css`: timer display, progress ring or countdown, prompt cards, path session list, practice hub cards, history list (spec: docs/practice-plan.md)

### Practice — Phase 7: Tests

- [x] Add tests for meditation and prompt loaders (validate all YAMLs load, IDs are valid, required fields present) (spec: docs/practice-plan.md)
- [x] Add tests for `practiceHistory.ts` and `dailyPrompt.ts` (mirrors existing test patterns) (spec: docs/practice-plan.md)
- [x] Add tests for `bellSound.ts` and `meditationTimer.ts` (mock AudioContext, use `vi.useFakeTimers`) (spec: docs/practice-plan.md)
- [x] Add view tests for all 7 practice views (mirror `homeView.test.ts` pattern) (spec: docs/practice-plan.md)
- [x] Add router tests for 7 new practice routes (spec: docs/practice-plan.md)

### Puja & Mantra — Phase 1: Content Infrastructure

- [x] Create `src/content/pujas/index.ts` with `Puja`, `PujaSection`, `RitualStep` types and `PUJA_IDS` array (spec: docs/plan-puja-mantra-sections.md)
- [x] Create `src/content/pujas/loader.ts` with Zod schema + `import.meta.glob` loader (mirrors `src/content/sutras/loader.ts`) (spec: docs/plan-puja-mantra-sections.md)
- [x] Write `src/content/pujas/sevenfold-puja.yaml` with sections (study) and ritualSteps (perform) for the Triratna Sevenfold Puja (spec: docs/plan-puja-mantra-sections.md)
- [x] Create `src/content/mantras/index.ts` with `Mantra`, `MantraSyllable` types and `MANTRA_IDS` array (spec: docs/plan-puja-mantra-sections.md)
- [x] Create `src/content/mantras/loader.ts` with Zod schema + `import.meta.glob` loader (spec: docs/plan-puja-mantra-sections.md)
- [x] Write `src/content/mantras/avalokiteshvara.yaml` with sanskrit, syllables, meaning, usage, defaultRepetitions (spec: docs/plan-puja-mantra-sections.md)

### Puja & Mantra — Phase 2: Data Layer

- [x] Extend `src/core/practiceHistory.ts` with `pujas: PujaSession[]` and `mantras: MantraSession[]` fields; add `logPujaSession()`, `getPujaSessions()`, `logMantraSession()`, `getMantraSessions()`; update `getTotalSessionCount()`; use `??` defaults for backward compatibility (spec: docs/plan-puja-mantra-sections.md)

### Puja & Mantra — Phase 3: Routing + Nav

- [x] Extend `src/core/router.ts` with 6 new route types: `practicePujas`, `practicePujaStudy`, `practicePujaPerform`, `practiceMantras`, `practiceMantraDetail`, `practiceMantraChant`; add `parseHash` matchers (match `/perform` and `/chant` before bare `/:id`) (spec: docs/plan-puja-mantra-sections.md)
- [x] Extend `src/main.ts` with 6 new route cases; `pujaPerformView` and `mantraChantView` assign to `currentCleanup` (spec: docs/plan-puja-mantra-sections.md)

### Puja & Mantra — Phase 4: Views

- [x] Create `src/core/practice/pujaListView.ts` — cards with title, tradition, description; links to study + perform (mirrors `meditationListView.ts`) (spec: docs/plan-puja-mantra-sections.md)
- [x] Create `src/core/practice/pujaStudyView.ts` — sections with original/translation/commentary/related concepts (mirrors `sutraStudyView.ts`) (spec: docs/plan-puja-mantra-sections.md)
- [x] Create `src/core/practice/pujaPerformView.ts` — step-by-step ritual flow with timer; returns cleanup function (mirrors `meditationSessionView.ts`) (spec: docs/plan-puja-mantra-sections.md)
- [x] Create `src/core/practice/mantraListView.ts` — cards with title, sanskrit, tradition (mirrors `meditationListView.ts`) (spec: docs/plan-puja-mantra-sections.md)
- [x] Create `src/core/practice/mantraDetailView.ts` — large mantra text, syllable breakdown, meaning, related concepts (spec: docs/plan-puja-mantra-sections.md)
- [x] Create `src/core/practice/mantraChantView.ts` — mala counter (42/108), large tap button, 108-dot circular mala visualization, haptic feedback via `navigator.vibrate?.(10)`, bell every 27 beads, completion logging; returns cleanup function (spec: docs/plan-puja-mantra-sections.md)
- [x] Update `src/core/practice/practiceHubView.ts` — add Puja and Mantra cards after Paths; add puja/mantra counts to stats summary (spec: docs/plan-puja-mantra-sections.md)

### Puja & Mantra — Phase 5: Styles

- [x] Add puja/mantra CSS to `src/styles/main.css`: `.puja-*` classes (reuse `.sutra-*` and `.meditation-*` patterns), `.mantra-detail` syllable grid, `.mala` / `.mala__bead` circular layout, `.mantra-chant__counter` / `.mantra-chant__tap-target` (spec: docs/plan-puja-mantra-sections.md)

### Puja & Mantra — Phase 6: Tests

- [x] Add loader tests: `src/content/pujas/loader.test.ts` and `src/content/mantras/loader.test.ts` (validate YAMLs load, IDs valid, required fields present) (spec: docs/plan-puja-mantra-sections.md)
- [x] Add view tests for all 6 new views: `pujaListView`, `pujaStudyView`, `pujaPerformView`, `mantraListView`, `mantraDetailView`, `mantraChantView` (mirror existing view test patterns) (spec: docs/plan-puja-mantra-sections.md)
- [x] Update `src/core/router.test.ts` with 6 new parse cases for puja/mantra routes (spec: docs/plan-puja-mantra-sections.md)
- [x] Update `src/core/practiceHistory.test.ts` with tests for `logPujaSession`, `getPujaSessions`, `logMantraSession`, `getMantraSessions`, updated `getTotalSessionCount` (spec: docs/plan-puja-mantra-sections.md)

### Sanskrit/Pali Enrichment — Phase 1: Types + Schemas

- [x] Add `SacredTerm` and `GlossEntry` types to `src/types/`; update Concept Zod schema with optional `terms` field; update Mantra schema with optional `phonetic`/`literal` on syllables and top-level `phonetic`; update Sutra/Puja section schema with optional `phonetic`, `audio`, `gloss`; ensure backward compat; run `npm run check` (spec: specs/sanskrit-enrichment.md)

### Sanskrit/Pali Enrichment — Phase 2: Concept YAMLs

- [x] Add `terms` (pali/sanskrit SacredTerm) to Three Marks concepts: anatta.yaml, anicca.yaml, dukkha.yaml (spec: specs/sanskrit-enrichment.md, example in docs/plan-sanskrit-enrichment.md)
- [x] Add `terms` to Foundational concepts: four-noble-truths.yaml, noble-eightfold-path.yaml, three-jewels.yaml, middle-way.yaml, three-marks.yaml (spec: specs/sanskrit-enrichment.md)
- [x] Add `terms` to Brahmaviharas concepts: metta.yaml, karuna.yaml, mudita.yaml, upekkha.yaml (spec: specs/sanskrit-enrichment.md)
- [x] Add `terms` to Mind & Practice concepts: sati.yaml, bhavana.yaml, samatha.yaml, vipassana.yaml, five-precepts.yaml, karma.yaml (spec: specs/sanskrit-enrichment.md)
- [x] Add `terms` to Buddhist Psychology concepts: five-aggregates.yaml, three-poisons.yaml, dependent-origination.yaml, twelve-links.yaml (spec: specs/sanskrit-enrichment.md)
- [x] Add `terms` to Mahayana concepts: sunyata.yaml, buddha-nature.yaml, bodhisattva.yaml, interbeing.yaml, prajna.yaml (spec: specs/sanskrit-enrichment.md)
- [x] Add `terms` to Liberation concepts: nirvana.yaml, samsara.yaml, awakening.yaml (spec: specs/sanskrit-enrichment.md)

### Sanskrit/Pali Enrichment — Phase 3: Mantras

- [x] Add `phonetic` + `literal` to each syllable and top-level `phonetic` in avalokiteshvara.yaml and green-tara.yaml (spec: specs/sanskrit-enrichment.md)

### Sanskrit/Pali Enrichment — Phase 4: Puja

- [x] Add `phonetic` and `gloss` word-by-word breakdowns to each section in sevenfold-puja.yaml (spec: specs/sanskrit-enrichment.md)

### Sanskrit/Pali Enrichment — Phase 5: Sutras

- [x] Add `phonetic` to all sections and `gloss` to key passages in heart-sutra.yaml (the-setting, form-is-emptiness, the-mantra) (spec: specs/sanskrit-enrichment.md)
- [x] Add `phonetic` to all sections and `gloss` to key passages in diamond-sutra.yaml (opening formula, closing verse) (spec: specs/sanskrit-enrichment.md)
- [x] Add `phonetic` to all sections and `gloss` to twin-verses opening in dhammapada.yaml (spec: specs/sanskrit-enrichment.md)

### Sanskrit/Pali Enrichment — Phase 6: Validation

- [x] Add/update loader tests to validate enriched YAML fields load correctly; verify all 30 concepts have `terms` with required SacredTerm fields; run full `npm run check` (spec: specs/sanskrit-enrichment.md)

---

## Completed

- [x] Install `yaml` package and create `src/content/concepts/loader.ts`
- [x] Add base CSS (`src/styles/main.css`) with reset, custom properties, layout primitives
- [x] Implement hash-based client-side router in `src/core/router.ts`
- [x] Create `src/core/conceptView.ts` — full concept detail page
- [x] Add `src/utils/formatText.ts` — paragraph/blockquote formatter
- [x] Render related concept IDs as clickable hash links
- [x] Create `src/core/dailyConcept.ts` — deterministic date-seed daily concept
- [x] Create `src/core/readingHistory.ts` — localStorage reading history service
- [x] Build home screen view (`src/core/homeView.ts`)
- [x] Add contemplated/revisit toggle in concept detail view
- [x] Build catalog view (`src/core/catalogView.ts`) with search + category filter
- [x] Add online/offline status indicator in nav bar
- [x] Add "Install app" prompt via `beforeinstallprompt`
- [x] Verify PWA offline support (all YAML bundled, cached by service worker)
- [x] Responsive CSS for ≤320px

## Notes

- All YAML content bundled at build time → auto-cached by service worker.
- `markViewed(id)` called automatically when concept detail view renders.
- Router is the integration point dispatching to all views.
- Practice content (meditations/prompts/paths) mirrors the concepts pattern: Zod schema + `import.meta.glob` + cache.
- Meditation session view is the most complex — implement last within Phase 5.
- Nav test failure: nav renders brand name as first link; test expects "Home" text — investigate before fixing to understand intent.
