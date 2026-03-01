# Daily Practice

## Overview

Surface a daily Buddhist concept for contemplation, with rotation and reading history tracking.

## User Stories

- As a practitioner, I want to see a concept of the day so that I have a focus for daily contemplation
- As a practitioner, I want to track which concepts I've read so that I can ensure I study all teachings
- As a practitioner, I want the daily concept to rotate so that I encounter different teachings over time

## Requirements

- [ ] Select a "concept of the day" using a deterministic daily rotation (date-based seed so all users see the same concept on the same day)
- [ ] Display the daily concept prominently on the home/landing screen
- [ ] Track which concepts the user has viewed (localStorage)
- [ ] Show reading progress (e.g., "12 of 30 concepts explored")
- [ ] Allow the user to mark a concept as "contemplated" or "revisit"
- [ ] Show a history of recently viewed concepts

## Acceptance Criteria

- [ ] Daily concept changes each calendar day
- [ ] Same concept appears for the same date (deterministic)
- [ ] Reading history persists across browser sessions
- [ ] Progress counter updates when viewing new concepts

## Out of Scope

- User accounts or server-side history
- Spaced repetition algorithms
- Notifications or reminders
