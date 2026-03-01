# noself

A contemplative PWA for exploring Buddhist concepts — anatta, dependent origination, the four noble truths, and more.

## What is this?

**noself** is a progressive web app that presents 30 core Buddhist concepts at three levels of depth:

- **Brief** — a sentence or two for quick reference
- **Essentials** — an accessible introduction
- **Deep** — full exploration with historical context, traditions, and nuances

Each concept includes illustrative quotes from suttas and teachers, with commentary that connects the ideas back to practice.

### Concepts covered

| Category            | Concepts                                                                       |
| ------------------- | ------------------------------------------------------------------------------ |
| Foundational        | Four Noble Truths, Noble Eightfold Path, Three Jewels, Middle Way, Three Marks |
| Three Marks         | Anicca, Dukkha, Anatta                                                         |
| Mind & Practice     | Sati, Bhavana, Samatha, Vipassana, Five Precepts, Karma                        |
| Buddhist Psychology | Five Aggregates, Three Poisons, Dependent Origination, Twelve Links            |
| Brahmaviharas       | Metta, Karuna, Mudita, Upekkha                                                 |
| Mahayana            | Sunyata, Buddha-nature, Bodhisattva, Interbeing, Prajna                        |
| Liberation          | Nirvana, Samsara, Awakening                                                    |

## Tech stack

- **TypeScript** + **Vite**
- **Zod** for runtime config validation
- **vite-plugin-pwa** for offline support and installability
- **Vitest** for testing
- **ESLint 9** + **Prettier** + **Husky** + **Knip**

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command            | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `npm run dev`      | Start dev server                                      |
| `npm run build`    | Typecheck and build for production                    |
| `npm run check`    | Typecheck + lint + format check + dead code detection |
| `npm run test:run` | Run tests once                                        |
| `npm test`         | Run tests in watch mode                               |
| `npm run lint:fix` | Auto-fix lint issues                                  |
| `npm run format`   | Format all files with Prettier                        |

## Project structure

```
src/
  api/        — API module
  config/     — Zod-validated app config
  core/       — Domain logic
  types/      — Shared TypeScript types
  utils/      — Logger, retry, debounce, throttle helpers
  content/    — 30 Buddhist concept YAML files
```
