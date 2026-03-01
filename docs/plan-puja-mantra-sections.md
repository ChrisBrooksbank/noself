# Plan: Add Puja and Mantra Sections

## Context

The app currently has Meditate, Contemplate, and Paths under the Practice hub. The user wants to add two new practice modalities:

- **Puja** — devotional liturgies (starting with the Triratna Sevenfold Puja) with both a study view (like sutra study) and a follow-along ritual mode (like meditation sessions)
- **Mantras** — a reference catalog of mantras plus a chanting practice mode with mala bead counter

Both live under Practice (`#/practice/pujas`, `#/practice/mantras`).

---

## 1. Content Layer — YAML + Zod + Loaders

### Pujas (`src/content/pujas/`)

Create `index.ts`, `loader.ts`, and a placeholder `sevenfold-puja.yaml`.

**YAML schema:**

```yaml
id: sevenfold-puja
title: The Sevenfold Puja
tradition: Triratna
description: '...'
sections: # study mode — same shape as sutra sections
    - id: worship
      order: 1
      title: Worship
      original: 'Vandami buddham...'
      originalLanguage: Sanskrit
      translation: '...'
      commentary: '...'
      relatedConcepts: [three-jewels]
ritualSteps: # perform mode — same shape as meditation steps + title/sectionRef
    - id: opening
      order: 1
      title: Opening
      instruction: 'Light candles and incense...'
      durationSeconds: 60
      sectionRef: null
```

Loader follows `src/content/sutras/loader.ts` pattern exactly (Zod schemas, `import.meta.glob`, cache).

### Mantras (`src/content/mantras/`)

Create `index.ts`, `loader.ts`, and a placeholder `avalokiteshvara.yaml`.

**YAML schema:**

```yaml
id: avalokiteshvara
title: Avalokiteshvara Mantra
sanskrit: 'Om Mani Padme Hum'
pali: null
tradition: Mahayana
description: '...'
syllables:
    - text: Om
      meaning: '...'
meaning: '...'
usage: '...'
defaultRepetitions: 108
relatedConcepts: [compassion]
```

---

## 2. Routing (`src/core/router.ts`)

Add 6 route types and `parseHash` matchers:

| Route type             | Hash                         | Notes       |
| ---------------------- | ---------------------------- | ----------- |
| `practicePujas`        | `/practice/pujas`            | List        |
| `practicePujaStudy`    | `/practice/puja/:id`         | Study view  |
| `practicePujaPerform`  | `/practice/puja/:id/perform` | Ritual flow |
| `practiceMantras`      | `/practice/mantras`          | List        |
| `practiceMantraDetail` | `/practice/mantra/:id`       | Reference   |
| `practiceMantraChant`  | `/practice/mantra/:id/chant` | Chanting    |

Match `/perform` and `/chant` sub-routes before bare `/:id` to avoid capture.

---

## 3. Views

### Practice Hub (`src/core/practice/practiceHubView.ts`)

- Add Puja and Mantra cards after Paths card
- Add puja/mantra counts to stats summary

### Puja Views (new files in `src/core/practice/`)

| File                 | Based on                   | Description                                                        |
| -------------------- | -------------------------- | ------------------------------------------------------------------ |
| `pujaListView.ts`    | `meditationListView.ts`    | Cards with title, tradition, description; links to study + perform |
| `pujaStudyView.ts`   | `sutraStudyView.ts`        | Sections with original/translation/commentary/related concepts     |
| `pujaPerformView.ts` | `meditationSessionView.ts` | Step-by-step ritual flow with timer; returns cleanup fn            |

### Mantra Views (new files in `src/core/practice/`)

| File                  | Based on                | Description                                                      |
| --------------------- | ----------------------- | ---------------------------------------------------------------- |
| `mantraListView.ts`   | `meditationListView.ts` | Cards with title, sanskrit, tradition                            |
| `mantraDetailView.ts` | (new layout)            | Large mantra text, syllable breakdown, meaning, related concepts |
| `mantraChantView.ts`  | (new — most novel)      | Mala bead counter, tap target, 108-bead circle visualization     |

**Mala bead chanting UI:**

- Large counter display (e.g. "42 / 108")
- Mantra text for reference
- Large tap button to increment
- Circular mala visualization — 108 small dots positioned with CSS `transform: rotate() translateY()`
- Haptic feedback via `navigator.vibrate?.(10)`
- Bell sound every 27 beads (quarter mala) via existing `playBell()`
- Completion: bell + message + log session
- Returns cleanup function for timers

---

## 4. Practice History (`src/core/practiceHistory.ts`)

Add to `PracticeStore`:

```typescript
pujas: PujaSession[];     // { pujaId, completedAt }
mantras: MantraSession[]; // { mantraId, repetitions, completedAt }
```

Add `logPujaSession()`, `getPujaSessions()`, `logMantraSession()`, `getMantraSessions()`.

Use `??` defaults in `load()` for backward compatibility with existing localStorage.

Update `getTotalSessionCount()` to include puja + mantra counts.

---

## 5. Main App Wiring (`src/main.ts`)

- Import 6 new view functions
- Add 6 switch cases (`pujaPerformView` and `mantraChantView` assign to `currentCleanup`)

---

## 6. Styles (`src/styles/main.css`)

- `.puja-*` classes — reuse `.sutra-*` patterns for study, `.meditation-*` patterns for perform
- `.mantra-detail` — syllable grid, large centered text
- `.mala` / `.mala__bead` — circular bead layout
- `.mantra-chant__counter` / `.mantra-chant__tap-target` — chanting interface

---

## 7. Tests

New test files mirroring existing patterns:

- `src/content/pujas/loader.test.ts`
- `src/content/mantras/loader.test.ts`
- View tests for each of the 6 new views
- Update `router.test.ts` with 6 new parse cases

---

## File Summary

**New files (~12):**

- `src/content/pujas/index.ts`, `loader.ts`, `sevenfold-puja.yaml`
- `src/content/mantras/index.ts`, `loader.ts`, `avalokiteshvara.yaml`
- `src/core/practice/pujaListView.ts`, `pujaStudyView.ts`, `pujaPerformView.ts`
- `src/core/practice/mantraListView.ts`, `mantraDetailView.ts`, `mantraChantView.ts`

**Modified files (~5):**

- `src/core/router.ts`
- `src/core/practice/practiceHubView.ts`
- `src/core/practiceHistory.ts`
- `src/main.ts`
- `src/styles/main.css`

---

## Verification

1. `npm run dev` — navigate to Practice hub, confirm new cards appear
2. Click through puja list → study view → perform mode; verify timer works
3. Click through mantra list → detail view → chanting mode; verify counter/mala
4. Check practice history logs puja and mantra sessions
5. `npm run check` — typecheck + lint + format + knip pass
6. `npm run test:run` — all tests pass
