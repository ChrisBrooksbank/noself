# noself - Buddhist Contemplation PWA

## Context

Build a mobile-first PWA inspired by Thich Nhat Hanh's writing and the "Tiny Buddha" desk calendar. The app helps explore ultimate reality through daily contemplations, an interconnected concept web, and meditation support. Starting from an empty directory at `C:\code\noself`.

**User decisions:**

- Both color themes (dark contemplative default + light parchment as light mode)
- Serif typography for contemplation text (Crimson Pro), sans-serif for UI (Inter)
- Personal daily cycle (Day 1 = first app open, not calendar-based)
- MDX content format with YAML frontmatter

---

## Tech Stack

- **Vite 6 + React 19 + TypeScript**
- **Tailwind CSS v4** - utility-first styling
- **vite-plugin-pwa** (Workbox) - service worker, manifest, offline caching
- **React Router v7** - client-side routing
- **@mdx-js/rollup** - compile MDX at build time
- **date-fns** - day cycling logic
- **Framer Motion** - slow, meditative animations
- **No backend/database** - all content as MDX/JSON files, user state in localStorage
- **Deploy:** static site to Vercel/Netlify/Cloudflare Pages

---

## Phase 1: MVP (what we build now)

A working, installable PWA that shows one contemplation per day.

### Step 1: Project scaffolding

- `npm create vite@latest` with React + TypeScript template
- Install deps: tailwindcss, @tailwindcss/vite, react-router, vite-plugin-pwa, @mdx-js/rollup, date-fns, framer-motion
- Configure `vite.config.ts` with MDX plugin + PWA plugin
- Set up Tailwind with CSS custom properties for theming
- **Files:** `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `package.json`, `index.html`

### Step 2: Theme system + typography

- CSS custom properties for both themes in `src/styles/globals.css`
- Dark contemplative (default): `#1a1a2e` bg, `#e8e0d4` text, `#c9a96e` gold accent, `#7c9473` sage
- Light parchment: `#f5f0e8` bg, `#2d2a26` text, `#4a2c40` burgundy accent, `#2d3a5c` indigo
- Google Fonts: Crimson Pro (body/contemplation) + Inter (UI/headings)
- `prefers-color-scheme` auto-detection + manual toggle
- Generous line-height (1.7-1.8), 18-20px body text on mobile
- **Files:** `src/styles/globals.css`, `src/hooks/useTheme.ts`, `src/components/ui/ThemeToggle.tsx`

### Step 3: Content pipeline

- MDX compilation via `@mdx-js/rollup` in vite config
- `import.meta.glob('./content/daily/*.mdx')` for dynamic loading
- Frontmatter schema: `day`, `title`, `source`, `tradition`, `concepts`
- Content loading utility in `src/lib/content.ts`
- **Files:** `src/lib/content.ts`, `src/content/daily/001.mdx` through `007.mdx`

### Step 4: Write 7 seed contemplations

- Follow template: epigraph quote + 2-4 paragraph contemplation + reflection prompt
- Draw from public domain sources (Pali Canon, Heart Sutra, Dhammapada) + original commentary in TNH's accessible style
- Themes: no-self, impermanence, interbeing, dependent origination, mindfulness, emptiness, the present moment
- **Files:** `src/content/daily/001.mdx` through `007.mdx`

### Step 5: Daily contemplation screen

- Full-screen reading experience - this IS the home screen
- Day cycling: `differenceInDays(today, firstOpenDate) % totalContemplations + 1`
- Paragraph-by-paragraph fade-in on scroll (Framer Motion, 400-600ms, ease-in-out)
- Date shown subtly at top
- Bookmark button (top-right, subtle)
- `prefers-reduced-motion` respected
- **Files:** `src/components/contemplation/DailyContemplation.tsx`, `src/hooks/useDaily.ts`, `src/components/ui/FadeIn.tsx`, `src/components/ui/BookmarkButton.tsx`

### Step 6: Local state management

- `useLocalState` hook for typed localStorage access
- User state: `firstOpenDate`, `completedDays`, `bookmarks`, theme preference
- No external state library - React context + hooks only
- **Files:** `src/hooks/useLocalState.ts`, `src/hooks/useBookmarks.ts`

### Step 7: PWA configuration

- Web app manifest: name "noself", standalone display, portrait orientation
- Theme/background colors matching dark theme
- Service worker via vite-plugin-pwa `generateSW` strategy
- Precache all assets (content compiled into JS bundle = fully offline after first visit)
- PWA icons (192x192, 512x512, maskable) - simple placeholder icons initially
- **Files:** `vite.config.ts` (PWA config section), `public/icons/`

### Step 8: App shell + routing

- `AppShell.tsx` layout wrapper
- React Router: `/` (today), `/bookmarks` (saved contemplations)
- Minimal navigation - hamburger or small bottom bar with just Today + Bookmarks for now
- **Files:** `src/App.tsx`, `src/main.tsx`, `src/components/layout/AppShell.tsx`, `src/pages/Today.tsx`, `src/pages/Bookmarks.tsx`

---

## Project Structure

```
noself/
  public/
    icons/                     # PWA icons
    favicon.svg
  src/
    components/
      layout/AppShell.tsx
      contemplation/DailyContemplation.tsx
      ui/FadeIn.tsx
      ui/BookmarkButton.tsx
      ui/ThemeToggle.tsx
    content/
      daily/001.mdx ... 007.mdx
    hooks/
      useDaily.ts
      useBookmarks.ts
      useLocalState.ts
      useTheme.ts
    lib/
      content.ts
      dates.ts
    pages/
      Today.tsx
      Bookmarks.tsx
    styles/globals.css
    App.tsx
    main.tsx
  index.html
  vite.config.ts
  tsconfig.json
  package.json
```

---

## Future Phases (not built now, for reference)

**Phase 2:** Concept web - interconnected Buddhist concepts (anatta, sunyata, dependent origination) as explorable cards with related-concept links. Bottom nav: Today / Explore / Sit.

**Phase 3:** Meditation companion - timer, breathing circle animation, guided step-by-step prompts, basic streak tracking, local notification reminders.

**Phase 4:** Content expansion toward 365 contemplations, seasonal cycles, audio (singing bowl, rain), shareable image cards.

---

## Design Notes

- **Feel:** "Opening a book in a quiet room" - not a productivity app
- **Animations:** Slow and intentional (400-600ms), ease-in-out, no bounce/spring/overshoot
- **Whitespace:** Generous - emptiness over fullness
- **Accessibility:** WCAG AAA contrast, `prefers-reduced-motion`, semantic HTML, screen reader friendly
- **Copyright:** Use public domain texts (Pali Canon, Heart Sutra, Dhammapada) for longer quotes. Only short attributed quotes from copyrighted authors (TNH etc.) under fair use. Original commentary written in TNH's accessible style.

---

## Verification

1. `npm run dev` - app loads, shows daily contemplation
2. Open on mobile browser - text is readable, layout works at 375px width
3. Toggle light/dark theme - both palettes render correctly
4. Bookmark a contemplation - persists across page reloads
5. Return next day - shows next contemplation in sequence
6. Chrome DevTools > Application > Manifest - valid PWA manifest
7. Lighthouse PWA audit - passes installability checks
8. Install on phone - works as standalone app
9. Enable airplane mode after install - app loads fully offline
