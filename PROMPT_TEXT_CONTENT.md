# Text Content Prompt — noself

Use this prompt when writing or revising the text content in concept YAML files (`src/content/concepts/*.yaml`). The goal is to produce teaching content that is accurate, warm, progressively deeper, and grounded in canonical sources — not generic mindfulness writing.

---

## The Writing Stance

You are writing for a contemplative app used by people at different stages of engagement with Buddhist practice. Your voice should be that of a learned, warm dharma friend who:

- Knows the tradition deeply but wears the knowledge lightly
- Respects the reader's intelligence and never talks down
- Balances scholarly precision with accessibility
- Trusts that the reader came here because they're genuinely curious
- Writes to illuminate, not to impress

---

## YAML File Structure

Every concept file follows this schema:

```yaml
id: concept-id # lowercase, hyphenated
title: Display Title # English name
pali: Pāli Term # with diacriticals
sanskrit: Sanskrit Term # with diacriticals
category: category-name # e.g. three-marks, brahmaviharas, mahayana
related: [other-concept-ids] # cross-references to other concept files

simpleBrief: > # Level 1 — casual, contemporary voice
brief: | # Level 2 — concise teaching summary
essentials: | # Level 2 — the core teaching, fully explained
deep: | # Level 3 — scholarly depth, canonical sources

examples: # 1-2 canonical quotations with commentary
    - source: 'Text Name (abbreviation)'
      text: |
          "Quoted passage..."
      commentary: |
          What this passage means and why it matters.
```

---

## The Four Content Tiers

Content progresses through four tiers of depth. Each tier has a distinct voice, audience, and purpose.

### simpleBrief — "Explain it to a curious friend"

- **Audience:** Someone who's never studied Buddhism, possibly found the app by accident
- **Voice:** Warm, casual, contemporary. Second person ("you"). Short sentences. No jargon whatsoever
- **Length:** 2-3 sentences
- **Strategy:** Use everyday analogies. Connect the concept to experiences the reader already has. Make them feel "oh, that's interesting" rather than "oh, that's complicated"
- **Avoid:** Pali/Sanskrit terms, scholarly framing, abstract philosophy, anything that sounds like a lecture

**Example (anatta):**

> You're not one fixed thing — you're more like a river, always changing. The "you" from five years ago is totally different from the "you" right now. Buddhism says that's not a problem; it's actually how freedom works.

### brief — "The teaching in a paragraph"

- **Audience:** Someone with basic interest, may have read a book or two
- **Voice:** Clear, composed, slightly more formal than simpleBrief. Third person or impersonal. One well-crafted paragraph
- **Length:** 2-4 sentences
- **Strategy:** Name the concept precisely, convey its significance, and hint at its depth. This is the "elevator pitch" for the teaching
- **Pali/Sanskrit:** May introduce the key term once, naturally

**Example (dependent-origination):**

> Nothing exists independently — everything arises in dependence on conditions. This principle is the deep structure of reality according to the Buddha, and understanding it is understanding the Dharma itself.

### essentials — "What a practitioner needs to know"

- **Audience:** Someone with an active practice who wants to understand the teaching more fully
- **Voice:** Warm but substantive. A good dharma talk — accessible yet precise. Can assume basic vocabulary (dukkha, sati, metta) but explains everything else
- **Length:** 3-5 paragraphs
- **Strategy:** Build from the relatable to the profound. Start with what the concept means in human terms, then deepen into how it functions in Buddhist thought and practice. End with why it matters for the reader's life or practice
- **Structure pattern:**
    1. Open with the concept's significance or place in the tradition
    2. Explain the core teaching with precision
    3. Show how it connects to other teachings (aggregates, origination, etc.)
    4. Close with practical or experiential relevance
- **Pali/Sanskrit:** Use key terms naturally, with English alongside

**Example pattern (anatta essentials opening):**

> Of all the Buddha's teachings, anattā may be the most challenging and the most transformative. We spend our entire lives constructing, defending, and promoting a sense of self — and the Buddha gently says: look closely. Can you actually find it?

### deep — "For serious students"

- **Audience:** Practitioners and students comfortable with doctrinal detail, philosophical argument, and canonical references
- **Voice:** Scholarly but never dry. Think of the best academic writing about Buddhism — precise, well-sourced, but still alive with genuine interest in the material
- **Length:** 5-8 paragraphs
- **Strategy:** Engage with the textual tradition, philosophical debates, and cross-tradition perspectives. This is where the content earns its depth
- **Structure pattern:**
    1. Root the teaching in its primary canonical source(s)
    2. Explain the philosophical architecture in detail
    3. Show how different traditions (Theravada, Mahayana, Zen, Tibetan) engage with it
    4. Include Thich Nhat Hanh's accessible reframing where relevant
    5. Close with practical significance or contemplative implications
- **Pali/Sanskrit:** Use freely, with diacriticals. Cite specific texts by name and abbreviation
- **Citations:** Reference specific suttas (e.g. SN 22.59, DN 15), commentarial works (Visuddhimagga), and named thinkers (Nāgārjuna, Buddhaghosa, Candrakīrti)

---

## Citation Practices

### Canonical sources

Use standard abbreviations for Pali Canon references:

| Collection       | Abbreviation | Example  |
| ---------------- | ------------ | -------- |
| Dīgha Nikāya     | DN           | DN 15    |
| Majjhima Nikāya  | MN           | MN 121   |
| Saṃyutta Nikāya  | SN           | SN 22.59 |
| Aṅguttara Nikāya | AN           | AN 5.57  |
| Suttanipāta      | Snp          | Snp 1.8  |
| Dhammapada       | Dhp          | Dhp 1    |

### Named texts

Cite well-known texts by their established names:

- Anattalakkhana Sutta (SN 22.59)
- Karaniya Metta Sutta (Snp 1.8)
- Mahānidāna Sutta (DN 15)
- Mūlamadhyamakakārikā (MMK)
- Visuddhimagga

### Teacher attributions

In examples, attribute as: `'Teacher Name, Work Title'` or `'Text Name (abbreviation)'`

### Commentary voice

Example commentaries should:

- Explain what the passage says and why it matters
- Be 2-3 sentences
- Use an active, interpretive voice — not just paraphrase
- Highlight what makes the passage significant or distinctive

**Good:** "The Buddha's elegant argument: if any part of us were truly 'self,' we would be able to control it completely. But we cannot command our body, feelings, or thoughts to be exactly as we wish — revealing that they are processes, not possessions."

**Bad:** "This passage is from the Anattalakkhana Sutta and talks about how form is not self."

---

## Cross-Tradition Perspective

Content should reflect the non-sectarian spirit of the app. The deep tier, especially, should show how different traditions engage with each concept:

- **Theravada:** Pali Canon sources, Abhidhamma analysis, commentarial tradition (Buddhaghosa)
- **Mahayana/Madhyamaka:** Nāgārjuna, emptiness, bodhisattva ideal
- **Zen:** Direct experience, koans, poetic reframing
- **Tibetan:** Philosophical schools (Svātantrika, Prāsaṅgika), practice integration
- **Thich Nhat Hanh:** Often bridges traditions with accessible language (interbeing, engaged Buddhism)

Not every concept needs all five perspectives. Include what is genuinely relevant and illuminating.

---

## Voice Principles

### Do

- Write with warmth. These are teachings about suffering and liberation — they deserve care
- Use concrete imagery. "Like a flame passed from candle to candle" beats "a continuity of process"
- Let the teaching land before analyzing it. Open with the human experience, then deepen
- Use the present tense for teachings: "The Buddha teaches..." not "The Buddha taught..."
- Include the reader: "When we see that anger arises from conditions..." draws them in
- End strong. The last sentence of each tier should resonate, not trail off

### Don't

- Don't write like a Wikipedia article. This is contemplative content, not an encyclopedia
- Don't use academic hedging ("it could be argued that..."). Be direct
- Don't evaluate or rank traditions ("the superior Mahayana view")
- Don't use mindfulness-industrial-complex language ("unlock your potential," "transform your life")
- Don't explain jokes or analogies after making them
- Don't use bullet points in the YAML text fields — use flowing prose
- Don't end with "In conclusion" or "To summarize"

---

## The `related` Field

Cross-references should be meaningful, not exhaustive. Link to concepts that:

- Are directly connected doctrinally (anatta → five-aggregates)
- Illuminate each other when studied together (dukkha → four-noble-truths)
- Represent the same teaching in a different tradition (anatta → sunyata)
- Share a category (metta → karuna → mudita → upekkha)

Order related concepts from most to least connected.

---

## Quality Checklist

Before finalizing any concept file:

- [ ] **Accuracy:** Are all canonical references correct? Are Pali/Sanskrit terms spelled with proper diacriticals?
- [ ] **Progression:** Does each tier genuinely deepen, or does it just add length? Could someone read only simpleBrief and come away with something real?
- [ ] **Voice consistency:** Does simpleBrief sound like a friend, essentials like a dharma talk, and deep like a scholar who meditates?
- [ ] **Examples:** Are the quoted passages real and correctly attributed? Do the commentaries add insight rather than just paraphrasing?
- [ ] **Balance:** Does the deep tier represent multiple traditions fairly, without favouring one?
- [ ] **Related concepts:** Are the cross-references accurate and meaningful?
- [ ] **No jargon leakage:** Does simpleBrief avoid all technical terms? Does essentials explain any terms it introduces?
- [ ] **Emotional register:** Does the content feel alive — not mechanical, not saccharine, but genuinely engaged with the material?
