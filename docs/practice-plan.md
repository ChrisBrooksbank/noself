# Practice Section — Implementation Plan

## Context

The noself PWA is a strong Buddhist learning tool with 30 concepts, daily rotation, and reading history. But it's primarily educational — the "practice" features are limited to marking concepts as "contemplated" or "revisit." Real Buddhist practice (meditation, contemplation, structured paths) is the biggest missing piece. This plan adds a full Practice section with three practice types: guided meditations, contemplation prompts, and structured multi-session paths.

## What We're Building

### Three Practice Types

1. **Guided Meditations** — Timer-based sessions with step-by-step instructions that change at intervals. Bell sounds via Web Audio API (no audio files). 5 meditations: breath awareness, metta, body scan, vipassana, open awareness.

2. **Contemplation Prompts** — Reflection questions tied to concepts (e.g., "Can you find a fixed self behind your thoughts?"). Daily prompt rotation. ~25 prompts across 8 concept areas, each with guidance text and depth level (beginner/intermediate/advanced).

3. **Structured Practice Paths** — Multi-session curricula combining concept study + prompts + meditations. 3 paths: 7-Day Metta, Foundations of Mindfulness, Exploring Non-Self.

### New Routes

| Route                      | View               | Purpose                                                  |
| -------------------------- | ------------------ | -------------------------------------------------------- |
| `#/practice`               | Practice Hub       | Landing page with cards for each type + practice summary |
| `#/practice/meditate`      | Meditation List    | Browse all guided meditations                            |
| `#/practice/meditate/{id}` | Meditation Session | Active timer with instructions + bells                   |
| `#/practice/prompts`       | Prompts            | Daily prompt + browse by concept/depth                   |
| `#/practice/paths`         | Paths List         | Browse paths with progress indicators                    |
| `#/practice/paths/{id}`    | Path Detail        | Session list with completion tracking                    |
| `#/practice/history`       | Practice History   | Log of all completed sessions                            |

## File Structure

```
src/
  content/
    meditations/
      index.ts                          # Types + ID array
      loader.ts                         # Zod schema + import.meta.glob loader
      breath-awareness.yaml             # 5/10/20 min
      metta.yaml                        # 10/15/20 min
      body-scan.yaml                    # 10/20 min
      vipassana.yaml                    # 10/20/30 min
      open-awareness.yaml               # 10/20 min
    prompts/
      index.ts
      loader.ts
      anatta-prompts.yaml               # 3 prompts
      anicca-prompts.yaml               # 3 prompts
      dukkha-prompts.yaml               # 3 prompts
      metta-prompts.yaml                # 3 prompts
      sunyata-prompts.yaml              # 3 prompts
      dependent-origination-prompts.yaml # 3 prompts
      five-aggregates-prompts.yaml      # 3 prompts
      four-noble-truths-prompts.yaml    # 4 prompts
    paths/
      index.ts
      loader.ts
      seven-day-metta.yaml
      foundations-of-mindfulness.yaml
      exploring-non-self.yaml
  core/
    practice/
      practiceHubView.ts
      meditationListView.ts
      meditationSessionView.ts          # Most complex — timer + bells + step progression
      promptsView.ts
      pathsListView.ts
      pathDetailView.ts
      practiceHistoryView.ts
      bellSound.ts                      # Web Audio API bell tone generator
      meditationTimer.ts                # Timer state machine (idle/running/paused/completed)
      dailyPrompt.ts                    # Daily rotation (mirrors dailyConcept.ts)
    practiceHistory.ts                  # localStorage module (mirrors readingHistory.ts)
```

## Key Patterns to Follow

All new code mirrors existing patterns exactly:

- **Content loaders** → follow `src/content/concepts/loader.ts` (Zod schema + `import.meta.glob` + cache)
- **localStorage** → follow `src/core/readingHistory.ts` (private load/save, exported functions)
- **Views** → follow `src/core/conceptView.ts` (function takes container, sets innerHTML, attaches event listeners)
- **Daily rotation** → follow `src/core/dailyConcept.ts` (daysSinceEpoch % total)
- **Nav** → extend `src/core/nav.ts` with "Practice" link, active when any practice route

## Key Architectural Decisions

### View Cleanup for Meditation Timer

The meditation timer creates intervals that must stop on navigation. Add a module-level cleanup callback in `main.ts`:

```typescript
let currentCleanup: (() => void) | null = null;
// Called before each route render; meditationSessionView returns cleanup fn
```

### Bell Sound (Web Audio API)

`bellSound.ts` creates a sine wave oscillator (~800 Hz + harmonic) with exponential gain ramp-down. `AudioContext` created lazily on first user interaction (browser autoplay policy). No audio files needed.

### Steps Keyed by Duration

Each meditation YAML has hand-crafted step sequences per duration (not dynamically scaled), so instruction pacing feels natural for each session length.

### Nav Active State

`renderNav` checks `activeType.startsWith('practice')` to highlight the Practice link for all practice sub-routes.

## Files to Modify

- `src/core/router.ts` — Add 7 new route types to `Route` union + `parseHash` patterns
- `src/main.ts` — Add switch cases for new routes, add cleanup mechanism, import new views
- `src/core/nav.ts` — Add "Practice" nav link with practice-prefixed active check
- `src/styles/main.css` — Add practice-specific styles (timer display, prompt cards, path sessions, etc.)

## Implementation Order

### Phase 1: Content Infrastructure

1. Meditation types/loader + 1 sample YAML to validate
2. Prompt types/loader + 1 sample YAML
3. Path types/loader + 1 sample YAML

### Phase 2: Data Layer

4. `practiceHistory.ts` — localStorage module
5. `dailyPrompt.ts` — daily rotation

### Phase 3: Audio + Timer

6. `bellSound.ts` — Web Audio API bell
7. `meditationTimer.ts` — timer state machine

### Phase 4: Routing + Nav

8. Extend `router.ts` with new routes
9. Extend `nav.ts` with Practice link
10. Extend `main.ts` with route cases + cleanup

### Phase 5: Views (simplest → most complex)

11. Practice hub view
12. Meditation list view
13. Prompts view (daily + browse)
14. Paths list view
15. Path detail view
16. Practice history view
17. Meditation session view (timer + bells — most complex, last)

### Phase 6: Content

18. Write all remaining YAML files (4 more meditations, 7 more prompt files, 2 more paths)

### Phase 7: Styles

19. Add practice CSS to `main.css`

### Phase 8: Tests

20. Content loader tests (validate all YAML loads, cross-reference IDs)
21. practiceHistory + dailyPrompt tests
22. bellSound + meditationTimer tests (mock AudioContext, use vi.useFakeTimers)
23. View tests (mirror existing homeView.test.ts pattern)
24. Router test extensions

## Verification

1. `npm run check` — typecheck + lint + format + knip passes
2. `npm run test:run` — all tests pass
3. `npm run dev` — manual testing:
    - Navigate to Practice hub from nav
    - Browse and start a guided meditation, verify timer/bells/instructions work
    - Browse prompts, verify daily rotation, mark "sat with"
    - Browse paths, complete sessions, verify progress tracking
    - Check practice history shows logged sessions
    - Test offline (PWA service worker caches new assets)
    - Verify nav highlights correctly on all practice routes
