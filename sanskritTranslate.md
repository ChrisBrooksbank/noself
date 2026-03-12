# Plan: Surface Sanskrit/Pali Term Metadata in the UI

## Current State

- `SacredTerm` type and `sacredTermSchema` already exist
- Concepts loader parses `terms` — but **sutra and puja loaders silently drop it**
- `conceptView.ts` renders Pali/Sanskrit as flat strings, ignoring the rich metadata
- No tooltip/popover component exists anywhere

---

## Phase 1: Wire up the data

1. **Extract shared `sacredTermSchema`** — it's currently inline in the concepts loader. Move to a shared location so all loaders can use it.
2. **Add `terms` to Sutra and Puja types + loaders** — mirror what concepts already do. Currently the YAML data is being silently dropped.
3. **Add loader tests** to verify terms are parsed.

## Phase 2: Popover component

4. **Create `renderSacredTermSpan()`** — returns an interactive `<span>` with data attributes for phonetic, literal, etymology, counterpart language.
5. **Create `initSacredTermTooltips()`** — delegated click/tap listener that shows a singleton popover with:
    - Pronunciation (phonetic)
    - English literal meaning
    - Etymology breakdown
    - Equivalent in the other language (Pali ↔ Sanskrit)
6. **CSS** — dotted underline on terms, positioned popover using existing design tokens.

**Why popover not tooltip?** This is a PWA — hover tooltips don't work on mobile. Click/tap popovers work everywhere.

## Phase 3: Integrate into views

7. **Concept view** — replace flat `concept.pali · concept.sanskrit` string with interactive sacred-term spans + init popovers.
8. **Sutra study view** — make the sutra title term interactive, surface word-by-word gloss data in expandable sections.
9. **Puja study view** — same pattern as sutra.
10. **Mantra detail view** — add phonetic display alongside syllables (already has syllable-level data, just needs rendering).

## Phase 4: Terms detail card (levels 2-3)

11. **Sacred Terms section** in concept detail — a visible card showing both Pali and Sanskrit with all metadata at a glance, no interaction needed. Complements the inline popovers.

## Phase 5: Testing

12. Unit tests for popover rendering and keyboard/accessibility handling. Update existing view tests to verify terms display.

---

## Implementation Order

1 → 2 → 3 → 4/5/6 → 7 → 11 → 8/9 → 10 → 12

## Key Decisions

- **Singleton popover** — one at a time, dismiss on outside click/Escape
- **Data attributes** — keeps rendering pure (HTML strings), consistent with existing patterns
- **Graceful fallback** — if `terms` is missing, existing flat display is preserved
- **No new route** — metadata surfaces in-place within existing views

## Critical Files

- `src/types/sacred-terms.ts` — SacredTerm interface; may co-locate shared Zod schema here
- `src/content/concepts/loader.ts` — has sacredTermSchema to extract/share
- `src/content/sutras/index.ts` + `loader.ts` — needs terms field added
- `src/content/pujas/index.ts` + `loader.ts` — needs terms field added
- `src/core/conceptView.ts` — primary view to integrate terms display
- `src/styles/main.css` — all new popover and sacred-term styles
