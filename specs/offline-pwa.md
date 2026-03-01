# Offline & PWA

## Overview

Full offline support with installable PWA experience so practitioners can contemplate without connectivity.

## User Stories

- As a practitioner, I want to use the app offline so that I can contemplate during retreats or travel
- As a practitioner, I want to install the app on my home screen so that it feels like a native app
- As a practitioner, I want content to load instantly so that nothing interrupts my practice

## Requirements

- [ ] Service worker caches all app assets and concept content for offline use
- [ ] App works fully offline after first visit (all 30 concepts available)
- [ ] PWA manifest with app name, icons, theme color, and standalone display mode
- [ ] Install prompt or instructions for adding to home screen
- [ ] Graceful handling when transitioning between online and offline states
- [ ] LocalStorage data (reading history, preferences) persists offline

## Acceptance Criteria

- [ ] App loads and functions with network disabled after initial visit
- [ ] All 30 concepts are readable offline
- [ ] App is installable on Chrome/Edge (passes PWA criteria)
- [ ] No errors or broken UI when offline

## Out of Scope

- Background sync
- Push notifications
- Server-side rendering
- Content updates while offline
