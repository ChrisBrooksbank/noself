# Video Curation Prompt — noself

Use this prompt when selecting, evaluating, or adding YouTube videos to the noself app. The goal is to maintain a curated collection that feels like a trusted teacher's personal reading list — not a search engine's top results.

---

## The Curatorial Stance

You are selecting videos for a contemplative app used by people at different stages of engagement with Buddhist practice. Your taste should be that of a knowledgeable, non-sectarian dharma friend who:

- Respects the depth and precision of traditional teachings
- Values accessibility without dumbing down
- Prefers teachers who embody what they teach over those who merely explain it
- Would rather include one excellent video than three adequate ones
- Trusts the viewer's intelligence

---

## Teacher Selection Criteria

### Who belongs in this collection

**Monastics and long-term practitioners** with decades of practice and teaching. Every teacher should have a genuine lineage or deep immersion in a recognised tradition:

| Tier                         | Description                                                                               | Examples in collection                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Canonical voices**         | Universally respected across traditions; their talks are primary sources in themselves    | Thich Nhat Hanh, Bhikkhu Bodhi, Ajahn Brahm                 |
| **Senior Western teachers**  | 30+ years practice, founded or lead major centres, trained under recognised Asian masters | Joseph Goldstein, Sharon Salzberg, Tara Brach, Gil Fronsdal |
| **Living tradition holders** | Recognised tulkus, senior nuns/monks teaching in English from within a living lineage     | Yongey Mingyur Rinpoche, Sister Chan Duc, Geshe Namdak      |

### Who does NOT belong

- Celebrity mindfulness coaches or wellness influencers
- Channels that monetise Buddhism (course upsells, affiliate-heavy descriptions)
- Teachers without a discernible lineage or training
- Talks that mix Buddhism with New Age, manifestation, or self-help frameworks
- AI-generated narration or "ambient Buddhism" channels
- Academic lectures from non-practitioners (unless exceptionally rigorous, e.g. a Bodhi-tier scholar)

### Tradition balance

Maintain representation across four streams. No single tradition should dominate:

- **Theravada** — Pali Canon scholarship, forest tradition, vipassana (Bodhi, Brahm)
- **Zen/Chan** — Plum Village, Soto/Rinzai lineages (Thich Nhat Hanh)
- **Tibetan** — Kagyu, Gelug, Nyingma teachers working in English (Mingyur Rinpoche)
- **Insight/Western** — IMS-lineage teachers bridging East and West (Goldstein, Salzberg, Brach, Fronsdal)

When adding new videos, check the current tradition distribution first and favour underrepresented streams.

---

## Level Assignment

Each video maps to one of three experience levels. The level is determined by the **cognitive demand and assumed context**, not by the teacher's prestige:

### Level 1 — Exploring

- **Viewer assumption:** Curious beginner, possibly no meditation experience
- **Duration sweet spot:** 10–20 minutes (max ~30m)
- **Content character:** Warm, inviting, practical. Minimal jargon. The viewer should feel welcomed, not lectured at
- **Test:** Would you send this to a friend who just said "I'm curious about meditation"?
- **Examples:** Mingyur's "5 Most Important Things" (18m), TNH's "First 8 Exercises of Mindful Breathing" (15m), Sharon Salzberg's guided metta (10m)

### Level 2 — Deepening

- **Viewer assumption:** Has a practice, reads about Buddhism, wants to go further
- **Duration sweet spot:** 15–60 minutes
- **Content character:** More conceptual depth, can assume basic vocabulary (dukkha, sati, metta). May introduce Pali terms or doctrinal frameworks. Teacher can be more rigorous
- **Test:** Would this deepen understanding for someone who's been practising for a year?
- **Examples:** Goldstein's "Mindfulness: What it is and is Not" (1h15m), Brahm's "The Middle Way" (1h), Goldstein's guided mudita (15m)

### Level 3 — Immersed

- **Viewer assumption:** Serious practitioner or student of Buddhism. Comfortable with doctrinal detail, philosophical argument, canonical references
- **Duration sweet spot:** 45m–1h30m (long-form is expected and valued here)
- **Content character:** Scholarly, rigorous, canonical. Can reference specific suttas, use untranslated Pali/Sanskrit, engage with inter-school debates
- **Test:** Would a dharma study group find this substantive?
- **Examples:** Bodhi's Four Noble Truths lecture (1h15m), Goldstein's "Buddhism and Non-Self" (45m), TNH's "Reality Does Not Exist Independent from the Mind" (1h+)

---

## Video Quality Standards

### Must-have

- [ ] **English language.** The teacher speaks in English (not dubbed, not subtitled-only)
- [ ] **Legitimate channel.** Official teacher/sangha channel, or a well-known dharma archive (Plum Village, BSWA, BAUS, Be Here Now Network, Lion's Roar, IMC). Avoid rip/reupload channels
- [ ] **Working URL.** Verify the video loads and is not age-restricted, region-locked, or deleted
- [ ] **Audio/video quality.** Listenable. Minor imperfections are fine for older talks (TNH, Bodhi) — the teaching matters more than production value
- [ ] **Content integrity.** The talk is unedited or minimally edited. Not a fan-made compilation, not a "best of" montage with background music added

### Nice-to-have

- Talks given in a retreat or sangha setting (carries the energy of real practice)
- A teacher's own channel rather than a third-party upload
- Clear, descriptive titles (not clickbait)

### Red flags

- Titles with ALL CAPS excitement or "THIS WILL CHANGE YOUR LIFE"
- Channels that mix Buddhist content with unrelated content
- Thumbnails designed for viral engagement rather than dharma
- Comments disabled or heavily moderated in a way that suggests controversy
- Talks that are primarily promoting a book, course, or retreat registration

---

## Metadata Standards

Every video entry must include all fields. Follow these conventions:

```yaml
- id: teacher-lastname-short-topic # lowercase, hyphenated
  title: 'Exact YouTube Title' # match the video exactly, including punctuation
  teacher: Full Name # as they are known (Thich Nhat Hanh, not Nguyen Xuan Bao)
  channel: Channel Display Name # or @handle for verified channels
  channelUrl: https://.../@handle # link to the channel
  videoUrl: https://www.youtube.com/watch?v=XXXXXXXXXXX
  duration: '45m' # human-readable: '10m', '1h', '1h 30m'
  description: > # 1-2 sentences. What the talk IS, not what it means to you.
      # Describe the content and the teacher's approach.
  level: 1 # 1, 2, or 3
  tradition: Theravada # Theravada | Zen | Tibetan | Insight
  topics: [2-4 tags] # lowercase, hyphenated, from existing topic vocabulary
  relatedConcepts: [concept-ids] # must match actual concept IDs in src/content/concepts/
```

### Description voice

Write descriptions in **third person, present tense**, emphasising what the teacher does in the talk and what quality they bring:

- "Ajahn Brahm unpacks the chain of dependent origination with his characteristic clarity and humor."
- "A rigorous scholarly lecture on the Four Noble Truths by one of the foremost Pali Canon translators."
- "Mingyur Rinpoche offers a warm, practical explanation of the Four Noble Truths and their relevance to daily life."

Avoid: evaluative superlatives ("the best talk ever"), vague praise ("an amazing teaching"), or descriptions of what the viewer will feel.

---

## Pairing Videos with Meditations

Each meditation file (`src/content/meditations/*.yaml`) should have exactly **2 videos**:

1. **One guided practice** (`type: guided`) — the viewer follows along, eyes closed
2. **One teaching talk** (`type: teaching`) — the viewer learns context, technique, or philosophy behind the practice

This guided+teaching pairing gives users both experiential and intellectual entry points.

---

## Adding New Videos: Step-by-Step

1. **Identify the gap.** Which concepts or meditations lack video coverage? Which levels are thin? Check the current `videos.yaml` and `relatedConcepts` mappings
2. **Search with taste.** Search YouTube for talks from the approved teacher pool first. Only expand to new teachers if the existing pool doesn't cover the topic
3. **Watch before adding.** Watch at least the first 5 minutes and skim the middle and end. A good title does not guarantee a good talk
4. **Verify the URL.** Open the link in an incognito window. Confirm it loads, is the right video, and is not region-restricted
5. **Verify the language.** Confirm the teacher speaks in English throughout
6. **Write the metadata.** Follow the schema above exactly. Cross-reference `relatedConcepts` against existing concept IDs
7. **Check balance.** After adding, review: Is any teacher now over-represented? Is any tradition now dominant? Is the level distribution still reasonable?

---

## Current Collection Profile (for reference)

**30 videos** across 10 teachers, 4 traditions, 3 levels:

| Teacher                 | Count | Tradition | Signature quality                  |
| ----------------------- | ----- | --------- | ---------------------------------- |
| Bhikkhu Bodhi           | 5     | Theravada | Canonical rigour, Pali scholarship |
| Thich Nhat Hanh         | 4     | Zen       | Poetic clarity, interbeing lens    |
| Ajahn Brahm             | 4     | Theravada | Warmth, humour, accessibility      |
| Joseph Goldstein        | 4     | Insight   | Precision, phenomenological depth  |
| Yongey Mingyur Rinpoche | 4     | Tibetan   | Contemporary, relatable, joyful    |
| Tara Brach              | 1     | Insight   | Embodied compassion, RAIN method   |
| Gil Fronsdal            | 1     | Insight   | Clear, systematic mindfulness      |
| Sharon Salzberg         | 1     | Insight   | Metta authority                    |
| Sister Chan Duc         | 1     | Zen       | Ethics in modern context           |
| Geshe Namdak            | 1     | Tibetan   | Concise doctrinal clarity          |

When adding, consider: Who is missing? Which voice would enrich the collection without diluting it?
