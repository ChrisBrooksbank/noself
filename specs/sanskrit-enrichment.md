# Sanskrit/Pali YAML Enrichment

## Overview

Enrich all YAML content files with structured Sanskrit/Pali metadata — pronunciation guides, etymologies, literal meanings, and word-level glosses — so users can learn to read, pronounce, and understand sacred terms.

## Source Spec

Full design: `docs/plan-sanskrit-enrichment.md`

## Core Type: SacredTerm

```typescript
interface SacredTerm {
    text: string; // "Anatta", "Pratityasamutpada"
    language: 'pali' | 'sanskrit' | 'hybrid';
    literal: string; // "not-self"
    etymology?: string; // "an (not) + atta (self)"
    phonetic: string; // "ah-NAHT-tah" (stress caps)
    ipa?: string; // optional IPA
    audio?: string; // optional audio path
}
```

## Requirements

### Phase 1: Types + Zod Schemas (infrastructure)

- [ ] Add `SacredTerm` and `GlossEntry` types to shared types
- [ ] Update Concept Zod schema: add optional `terms` field (`{ pali?: SacredTerm, sanskrit?: SacredTerm }`)
- [ ] Update Mantra Zod schema: add optional `phonetic` to top level, add optional `phonetic` + `literal` to syllables
- [ ] Update Sutra/Puja section Zod schema: add optional `phonetic`, `audio`, `gloss` fields
- [ ] Ensure all schema changes are backward-compatible (new fields optional)

### Phase 2: Concept YAML Enrichment (30 files)

Add `terms.pali` and/or `terms.sanskrit` to each concept YAML with `text`, `language`, `literal`, `etymology`, `phonetic`.

Grouped by category:

- [ ] Three marks (3): anatta, anicca, dukkha
- [ ] Foundational (5): four-noble-truths, noble-eightfold-path, three-jewels, middle-way, three-marks
- [ ] Brahmaviharas (4): metta, karuna, mudita, upekkha
- [ ] Mind & practice (6): sati, bhavana, samatha, vipassana, five-precepts, karma
- [ ] Buddhist psychology (4): five-aggregates, three-poisons, dependent-origination, twelve-links
- [ ] Mahayana (5): sunyata, buddha-nature, bodhisattva, interbeing, prajna
- [ ] Liberation (3): nirvana, samsara, awakening

### Phase 3: Mantra Enrichment (2 files)

- [ ] Add `phonetic` + `literal` to each syllable in avalokiteshvara.yaml
- [ ] Add `phonetic` + `literal` to each syllable in green-tara.yaml
- [ ] Add top-level `phonetic` to each mantra

### Phase 4: Puja Enrichment (1 file, 7 sections)

- [ ] Add `phonetic` to each section's original text in sevenfold-puja.yaml
- [ ] Add `gloss` word-by-word breakdowns for each section

### Phase 5: Sutra Enrichment (3 files, ~25 sections)

- [ ] Add `phonetic` to each section in heart-sutra.yaml
- [ ] Add `gloss` to key Heart Sutra passages (the-setting, form-is-emptiness, the-mantra)
- [ ] Add `phonetic` to each section in diamond-sutra.yaml
- [ ] Add `gloss` to key Diamond Sutra passages (opening formula, closing verse)
- [ ] Add `phonetic` to each section in dhammapada.yaml
- [ ] Add `gloss` to Dhammapada twin-verses opening

## Acceptance Criteria

- [ ] All existing tests still pass (backward compatible)
- [ ] Zod schemas validate enriched YAML correctly
- [ ] Every concept has at least one `terms.pali` or `terms.sanskrit` entry with `text`, `language`, `literal`, `etymology`, `phonetic`
- [ ] Both mantras have syllable-level `phonetic` + `literal`
- [ ] Puja sections have `phonetic` and `gloss`
- [ ] Key sutra passages have `phonetic` and `gloss`
- [ ] Phonetic convention: stressed syllable in CAPS, hyphens between syllables

## Out of Scope

- UI changes (tooltips, chanting mode, glossary page) — separate spec
- Audio file sourcing/recording — `audio` fields can be added later
- IPA transcriptions — optional, can be added incrementally
