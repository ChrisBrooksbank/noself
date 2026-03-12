# Sanskrit/Pali UI — Interactive Term Display

## Overview

Surface the existing Sanskrit/Pali term metadata (already in YAML) through interactive UI elements — clickable term spans with popovers showing pronunciation, meaning, etymology, and cross-language equivalents.

## Source Spec

Full design: `sanskritTranslate.md`

## Prerequisites

All data-layer work is complete (specs/sanskrit-enrichment.md). Terms, phonetics, glosses, and etymologies are already in YAML and validated by Zod schemas.

## Requirements

### Phase 1: Wire up the data

- [ ] Extract shared `sacredTermSchema` from concepts loader to a shared location so all loaders can reuse it
- [ ] Add `terms` field to Sutra types + loaders (currently silently dropped from YAML)
- [ ] Add `terms` field to Puja types + loaders (currently silently dropped from YAML)
- [ ] Add loader tests to verify terms are parsed for sutras and pujas

### Phase 2: Popover component

- [ ] Create `renderSacredTermSpan()` — returns an interactive `<span>` with data attributes for phonetic, literal, etymology, counterpart language
- [ ] Create `initSacredTermTooltips()` — delegated click/tap listener that shows a singleton popover with: pronunciation (phonetic), English literal meaning, etymology breakdown, equivalent in the other language (Pali ↔ Sanskrit)
- [ ] Add CSS — dotted underline on terms, positioned popover using existing design tokens

### Phase 3: Integrate into views

- [ ] Concept view — replace flat `concept.pali · concept.sanskrit` string with interactive sacred-term spans + init popovers
- [ ] Sutra study view — make sutra title term interactive, surface word-by-word gloss data in expandable sections
- [ ] Puja study view — same pattern as sutra
- [ ] Mantra detail view — add phonetic display alongside syllables (already has syllable-level data, just needs rendering)

### Phase 4: Terms detail card

- [ ] Sacred Terms section in concept detail — a visible card showing both Pali and Sanskrit with all metadata at a glance, no interaction needed. Complements inline popovers.

### Phase 5: Testing

- [ ] Unit tests for popover rendering and keyboard/accessibility handling
- [ ] Update existing view tests to verify terms display

## Key Decisions

- **Singleton popover** — one at a time, dismiss on outside click/Escape
- **Data attributes** — keeps rendering pure (HTML strings), consistent with existing patterns
- **Graceful fallback** — if `terms` is missing, existing flat display is preserved
- **No new route** — metadata surfaces in-place within existing views
- **Popover not tooltip** — PWA targets mobile; click/tap popovers work everywhere

## Acceptance Criteria

- [ ] All existing tests still pass
- [ ] Sacred terms in concept view are clickable and show popover with pronunciation, meaning, etymology
- [ ] Sutra/puja views surface terms and gloss data
- [ ] Mantra detail shows phonetic alongside syllables
- [ ] Popover dismisses on outside click and Escape key
- [ ] Graceful fallback when `terms` data is absent
- [ ] Accessible: keyboard navigable, proper ARIA attributes

## Implementation Order

Phase 1 → Phase 2 → Phase 3 (concept view first) → Phase 4 → Phase 3 (sutra/puja/mantra) → Phase 5

## Critical Files

- `src/types/sacred-terms.ts` — SacredTerm interface; may co-locate shared Zod schema here
- `src/content/concepts/loader.ts` — has sacredTermSchema to extract/share
- `src/content/sutras/index.ts` + `loader.ts` — needs terms field added
- `src/content/pujas/index.ts` + `loader.ts` — needs terms field added
- `src/core/conceptView.ts` — primary view to integrate terms display
- `src/styles/main.css` — all new popover and sacred-term styles

## Out of Scope

- New routes or standalone glossary page
- Audio playback
- IPA transcriptions
