# Sanskrit/Pali YAML Enrichment Plan

## Design Principles

1. **One reusable shape** — a `SacredTerm` object used everywhere Sanskrit/Pali appears
2. **Pronunciation-first** — every term gets a phonetic guide; audio is optional progressive enhancement
3. **Backward-compatible** — existing simple string fields stay valid; enriched metadata lives in new optional fields
4. **No duplication** — inline prose terms reference the concept glossary, not their own copies

---

## The Core Type: `SacredTerm`

The atomic unit — used for concept names, mantra syllables, and glossary entries:

```typescript
/** Metadata for a single Sanskrit or Pali term/phrase */
interface SacredTerm {
    text: string; // The term itself: "Anattā", "Pratītyasamutpāda"
    language: 'pali' | 'sanskrit' | 'hybrid';
    literal: string; // Bare literal meaning: "not-self"
    etymology?: string; // Root breakdown: "an (not) + attā (self)"
    phonetic: string; // English phonetic: "ah-NAHT-tah" (stress caps)
    ipa?: string; // IPA for precision: "/ənɐt̪ːɑː/"
    audio?: string; // Path to curated audio: "audio/terms/anatta.mp3"
}
```

**Why this shape:**

- `literal` is the must-have — users see this in tooltips and inline
- `phonetic` enables the "hear it in your head" experience even without audio
- `etymology` is the "aha" moment — seeing `paṭicca (dependent) + samuppāda (arising)` teaches more than any paragraph
- `ipa` and `audio` are optional progressive enhancement
- `language` disambiguates the many terms that exist in both (e.g. "nibbāna" vs "nirvāṇa")

---

## How Each Content Type Gets Enriched

### 1. Concepts — new `terms` field

**Before:**

```yaml
pali: Anattā
sanskrit: Anātman
```

**After:**

```yaml
pali: Anattā # keep for backward compat / simple display
sanskrit: Anātman # keep for backward compat / simple display

terms:
    pali:
        text: Anattā
        language: pali
        literal: not-self
        etymology: 'an (not) + attā (self)'
        phonetic: ah-NAHT-tah
    sanskrit:
        text: Anātman
        language: sanskrit
        literal: not-self
        etymology: 'an (not) + ātman (self, soul)'
        phonetic: ah-NAHT-mahn
```

**Why keep both old and new:** The old `pali`/`sanskrit` string fields are used in dozens of places for simple display (catalog cards, search indexing, concept headers). The new `terms` object adds depth without breaking anything. Views that want rich data read `terms`; views that want a label read `pali`/`sanskrit`.

### 2. Sutras & Pujas — enrich sections

These already have `original` + `originalLanguage` + `translation`. Add a **word-level gloss** for study:

**Before:**

```yaml
- id: going-for-refuge
  original: >
      Buddham saranam gacchami.
      Dhammam saranam gacchami.
      Sangham saranam gacchami.
  originalLanguage: Pali
  translation: >
      I go for refuge to the Buddha.
      I go for refuge to the Dharma.
      I go for refuge to the Sangha.
```

**After:**

```yaml
- id: going-for-refuge
  original: >
      Buddham saranam gacchami.
      Dhammam saranam gacchami.
      Sangham saranam gacchami.
  originalLanguage: Pali
  translation: >
      I go for refuge to the Buddha.
      I go for refuge to the Dharma.
      I go for refuge to the Sangha.
  phonetic: >
      BOOD-dahm SAH-rah-nahm GAHCH-ah-mee.
      DAHM-mahm SAH-rah-nahm GAHCH-ah-mee.
      SAHNG-hahm SAH-rah-nahm GAHCH-ah-mee.
  audio: audio/puja/going-for-refuge.mp3
  gloss:
      - word: Buddham
        meaning: the Buddha (accusative)
        phonetic: BOOD-dahm
      - word: saranam
        meaning: refuge, shelter
        phonetic: SAH-rah-nahm
      - word: gacchami
        meaning: I go (to)
        phonetic: GAHCH-ah-mee
      - word: Dhammam
        meaning: the Dharma, the teaching
        phonetic: DAHM-mahm
      - word: Sangham
        meaning: the Sangha, the community
        phonetic: SAHNG-hahm
```

**Key decisions:**

- `phonetic` at section level = full passage pronunciation (for chanting along)
- `gloss` = word-by-word breakdown (for study). Not every section needs a full gloss — short puja verses and mantra lines benefit most; long sutra passages can omit it
- `audio` = optional curated recording per section

### 3. Mantras — enrich syllables and top level

**Before:**

```yaml
syllables:
    - text: Om
      meaning: >-
          The sacred syllable representing the body, speech, and mind of all buddhas.
```

**After:**

```yaml
syllables:
    - text: Om
      phonetic: OHM
      literal: sacred syllable
      meaning: >-
          The sacred syllable representing the body, speech, and mind of all buddhas.
          It purifies pride and the obscurations of the body.
```

Also add to the mantra top level:

```yaml
sanskrit: 'Om Mani Padme Hum'
phonetic: 'OHM MAH-nee PAHD-may HOOM'
audio: audio/mantras/om-mani-padme-hum.mp3
```

Mantras are the highest-value target for audio since they're meant to be chanted aloud.

---

## Spoken Sanskrit: Technical Design

**Strategy: two tiers**

| Tier              | Source                          | Quality                    | Coverage                                        |
| ----------------- | ------------------------------- | -------------------------- | ----------------------------------------------- |
| **Phonetic text** | YAML `phonetic` field           | Good — user reads it aloud | 100% of all terms                               |
| **Curated audio** | `.mp3` files in `public/audio/` | Excellent                  | Mantras first, then puja verses, then key terms |

**Why not Web Speech API?** Sanskrit/Pali aren't supported languages. Hindi (`hi-IN`) is the closest but mangles Pali and gets diacriticals wrong. The phonetic text approach is better: users read `ah-NAHT-tah` and can pronounce it themselves. Curated audio files are added where hearing the real pronunciation matters most (mantras, puja chanting).

**Audio file convention:**

```
public/audio/
  mantras/
    om-mani-padme-hum.mp3
    om-tare-tuttare-ture-soha.mp3
  puja/
    worship.mp3
    salutation.mp3
    going-for-refuge.mp3
    ...
  terms/           # future: individual term pronunciations
    anatta.mp3
    ...
```

**Phonetic convention** (consistent across all YAML):

- Stressed syllable in CAPS: `ah-NAHT-tah`
- Syllables separated by hyphens
- English approximation (not IPA — IPA goes in optional `ipa` field)
- Long vowels doubled: `AH` vs `ah`, or noted explicitly

---

## Updated TypeScript Types

```typescript
/** Reusable metadata for any Sanskrit/Pali term */
interface SacredTerm {
    text: string;
    language: 'pali' | 'sanskrit' | 'hybrid';
    literal: string;
    etymology?: string;
    phonetic: string;
    ipa?: string;
    audio?: string;
}

/** Word-level gloss entry for passage study */
interface GlossEntry {
    word: string;
    meaning: string;
    phonetic?: string;
}

/** Updated concept type (additive — no breaking changes) */
interface Concept {
    // ... existing fields unchanged ...
    pali: string | null;
    sanskrit: string | null;
    terms?: {
        // NEW — optional, enriched metadata
        pali?: SacredTerm;
        sanskrit?: SacredTerm;
    };
}

/** Updated sutra/puja section */
interface SutraSection {
    // ... existing fields unchanged ...
    original: string;
    originalLanguage: string;
    translation: string;
    phonetic?: string; // NEW — full passage pronunciation
    audio?: string; // NEW — curated audio file path
    gloss?: GlossEntry[]; // NEW — word-by-word breakdown
}

/** Updated mantra syllable */
interface MantraSyllable {
    text: string;
    meaning: string;
    phonetic?: string; // NEW
    literal?: string; // NEW — short label vs longer meaning
}

/** Updated mantra */
interface Mantra {
    // ... existing fields unchanged ...
    sanskrit: string;
    phonetic?: string; // NEW — full mantra pronunciation
    audio?: string; // NEW — curated chanting audio
}
```

---

## Enrichment Work Plan

All new fields are optional, so this can be done incrementally without breaking anything.

### Phase 1: Concepts (30 files) — highest volume, most visible

1. Add `terms.pali` and/or `terms.sanskrit` to each concept YAML
2. Each term needs: `text`, `language`, `literal`, `etymology`, `phonetic`
3. Group by category to maintain consistency within related concepts:
    - Three marks (3): anatta, anicca, dukkha
    - Foundational (5): four-noble-truths, noble-eightfold-path, three-jewels, middle-way, three-marks
    - Brahmaviharas (4): metta, karuna, mudita, upekkha
    - Mind & practice (6): sati, bhavana, samatha, vipassana, five-precepts, karma
    - Buddhist psychology (4): five-aggregates, three-poisons, dependent-origination, twelve-links
    - Mahayana (5): sunyata, buddha-nature, bodhisattva, interbeing, prajna
    - Liberation (3): nirvana, samsara, awakening

### Phase 2: Mantras (2 files) — highest audio value

1. Add `phonetic` + `literal` to each syllable
2. Add top-level `phonetic` to each mantra
3. Source or record audio files for both mantras

### Phase 3: Puja (1 file, 7 sections) — meant to be chanted

1. Add `phonetic` to each section's original text
2. Add `gloss` word-by-word breakdowns (puja verses are short — very feasible)
3. Source audio for each section

### Phase 4: Sutras (3 files, ~25 sections) — longest passages

1. Add `phonetic` to each section
2. Add `gloss` selectively — focus on the most famous/chanted passages:
    - Heart Sutra: the-setting, form-is-emptiness, the-mantra (gate gate...)
    - Diamond Sutra: opening formula, closing verse
    - Dhammapada: twin-verses opening
3. Audio is lower priority here (sutras are studied more than chanted)

---

## Example: Fully Enriched Concept

```yaml
id: metta
title: Loving-Kindness
pali: Mettā
sanskrit: Maitrī
category: brahmaviharas

terms:
    pali:
        text: Mettā
        language: pali
        literal: loving-kindness, goodwill
        etymology: 'mitta (friend) + abstract suffix -ā'
        phonetic: MET-tah
    sanskrit:
        text: Maitrī
        language: sanskrit
        literal: friendliness, benevolence
        etymology: 'mitra (friend) + abstract suffix -ī'
        phonetic: MY-tree

# ... rest of file unchanged ...
```

---

## What This Enables in the UI (future)

- **Tooltips**: tap any term → see `literal`, `phonetic`, `etymology`
- **Chanting mode**: puja/mantra views show `phonetic` below original text
- **Glossary page**: auto-generated from all `terms` across concepts
- **Audio playback**: speaker icon wherever `audio` field exists
- **Guide page**: links from tooltips to a pronunciation/history reference
