# Content Display

## Overview

Load, parse, and render Buddhist concept YAML files as rich, readable contemplation content.

## User Stories

- As a practitioner, I want to read a concept's teachings clearly so that I can contemplate them deeply
- As a practitioner, I want to see related concepts so that I can explore connections between teachings
- As a practitioner, I want to read source texts and commentary so that I can deepen my understanding

## Requirements

- [ ] Parse all 30 YAML concept files at build time or runtime
- [ ] Create a TypeScript type/interface matching the YAML schema (id, title, pali, sanskrit, category, related, brief, essentials, deep, examples)
- [ ] Render a single concept view with sections: title/pali/sanskrit header, brief overview, essentials, deep teaching, source examples with commentary
- [ ] Display related concepts as clickable links
- [ ] Group concepts by category (three-marks, four-noble-truths, etc.)
- [ ] Handle markdown-like formatting in YAML text fields (paragraphs, quotes)

## Acceptance Criteria

- [ ] All 30 concepts load without error
- [ ] Each concept renders all its sections
- [ ] Related concept links navigate to the correct concept
- [ ] Category groupings are accurate

## Out of Scope

- Rich text editor or content management
- User-generated content
- External API calls for content
