# PROJ-1: Design System & Global Layout

## Status: In Progress
**Created:** 2026-06-12
**Last Updated:** 2026-06-13

## Dependencies
- None

## User Stories
- As a visitor, I want a visually striking, coherent dark design with red accents so that I immediately perceive the agency as a top-tier design partner.
- As a visitor, I want a fixed, unobtrusive navigation so that I can jump to Hero, Services, and Contact sections from anywhere on the page.
- As a mobile visitor, I want the layout and navigation to adapt flawlessly to my screen so that the experience feels native on any device.
- As a visitor with motion sensitivity, I want animations to respect my OS "reduced motion" preference so that the site doesn't cause discomfort.
- As the agency owner, I want brand tokens (colors, typography, spacing) defined in one place so that future changes stay consistent site-wide.

## Acceptance Criteria
- [ ] Dark base theme with red accent palette defined as Tailwind design tokens (CSS variables), used by all components
- [ ] Distinctive large-scale display typography (variable font) loaded via `next/font` with zero layout shift
- [ ] Sticky header with logo, section anchor links, and language switcher placeholder; collapses to an animated overlay menu below 768px
- [ ] Footer with agency name, address (Ahornweg 26, 47624 Kevelaer), phone (02832 974222), email, and links to Impressum/Datenschutz
- [ ] Smooth-scroll anchor navigation between page sections with active-section highlighting
- [ ] All interactive elements have visible focus states and meet WCAG 2.1 AA contrast on the dark theme
- [ ] `prefers-reduced-motion` disables/limits all decorative animations globally
- [ ] Layout renders correctly at 360px, 768px, 1024px, and 1920px widths

## Edge Cases
- What happens when JavaScript is disabled? → Content and navigation remain usable (anchors work natively, no blank screen).
- What happens on very wide screens (>2560px)? → Content is capped at a max width; backgrounds extend gracefully.
- How does the overlay menu behave when a link is tapped? → Menu closes and scrolls to the section; body scroll is unlocked.
- What if the custom font fails to load? → System font fallback with matched metrics, no invisible text.

## Technical Requirements (optional)
- Performance: no cumulative layout shift from fonts or header (CLS < 0.1)
- Accessibility: keyboard-navigable menu, skip-to-content link
- Browser Support: last 2 versions of Chrome, Firefox, Safari, Edge

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

**Last Updated:** 2026-06-13 · Status moved to In Progress · Based on approved mockup `docs/mockups/home-de.html` (V2)

### Goal in one sentence
Build the reusable "stage" every other feature performs on: the dark/red brand token system, the two typefaces, and the global shell (header, footer, scroll behaviour) — so PROJ-3 to PROJ-7 only add content, never re-decide design.

### A) Component Structure (what gets built)
```
Root Layout (wraps every page)
+-- <html> forced to dark, fixed brand background, both fonts attached
+-- Texture Layer (decorative, sits behind everything)
|   +-- Film-grain overlay
|   +-- Column-grid guide lines
+-- Skip-to-content link (accessibility, hidden until focused)
+-- Site Header (sticky, top)
|   +-- Logo lockup ("red baron" + "Werbeagentur · Kevelaer")
|   +-- Section links (Index / Leistungen / Kontakt) with active highlight
|   +-- Language switcher (DE active, EN placeholder — wired up in PROJ-2)
|   +-- "Projekt anfragen" button (the only red element in the header)
|   +-- Scroll-progress bar (thin red line under the header)
+-- Mobile Menu (below 768px: button opens a full-screen overlay)
+-- Page Content  ← PROJ-3..6 drop their sections in here
+-- Site Footer
    +-- Trust line (owner, since 2003, address, phone)
    +-- Speed line + Impressum/Datenschutz links
    +-- Oversized cropped "red baron" wordmark
```

Reusable building blocks created here (used by later features):
- **Section wrapper** — consistent vertical rhythm, max-width, anchor id + scroll-margin so the sticky header never covers headings.
- **"In-view" reveal helper** — a tiny utility that fades/translates an element in when it scrolls into view, automatically disabled under reduced-motion. PROJ-3 and PROJ-4 reuse this instead of each inventing their own.
- **Display heading + eyebrow (mono label)** text styles.

### B) "Data model" = the Design Token Catalogue (plain language)
No database. The "data" of a design system is its tokens, defined once as CSS variables and exposed to Tailwind:

- **Colour:** near-black background, warm off-white ink, two greys (dim/faint), brand red + a hotter red for hover, hairline-border colours. Dark-only — there is no light theme.
- **Typography:** two families —
  - *Display:* Archivo (variable, expanded width) for headlines, logo, big numbers.
  - *Body/UI:* Space Grotesk for paragraphs, labels, buttons, the "mono" eyebrow labels.
  - A type scale from tiny tracked labels up to viewport-sized hero headlines.
- **Spacing & layout:** page side-padding, section spacing, max content width, border-radius.
- **Motion:** standard durations/easings, plus a global "reduced-motion = off" switch.
- **Breakpoints:** mobile / 768 / 1024 / 1920 reference widths.

Where it lives: the global stylesheet (`globals.css`) holds the variables; the Tailwind config maps them to utility classes so components use `bg-background`, `text-red`, etc. — never raw hex.

### C) Tech Decisions (the WHY, for non-developers)
1. **Dark-only, no theme toggle.** The brand *is* the dark cinematic look. Dropping a light mode removes a whole class of bugs (flash of wrong theme, double the QA) and keeps the experience on-message. *(We will not use the pre-installed `next-themes` light/dark machinery.)*
2. **Self-hosted fonts, bundled in the repo (via Next.js font loader).** Two wins at once: (a) **performance** — no extra connection to a font CDN, no layout shift, fonts preloaded; (b) **GDPR** — German law frowns on Google Fonts loaded from Google's servers (it leaks visitor IPs). Self-hosting sidesteps that entirely, which matters for PROJ-6. Fonts already proven in the mockup.
3. **Animation: CSS-first, no heavy library yet.** Everything PROJ-1 needs (scroll-progress, active link, menu open/close, scroll-reveal) is achievable with CSS + one small browser API (IntersectionObserver). We deliberately **do not install Framer Motion now** — that decision is deferred to PROJ-3, where the cinematic hero may justify it. Keeps the foundation light and Lighthouse green.
4. **Reuse shadcn/ui, restyle via tokens.** The header's mobile overlay reuses the installed `Sheet` component; buttons can build on the installed `Button`. We restyle them through tokens rather than recreating them (house rule: shadcn-first).
5. **Native smooth-scroll + scroll-margin** for anchor navigation — no scroll-hijacking library, so keyboard users and "reduce motion" users get sane behaviour and the back/forward buttons keep working.
6. **Progressive enhancement.** Server-rendered HTML means content and anchor links work even with JavaScript off; the JS layer only *enhances* (active highlight, progress bar, overlay menu).

### D) Dependencies (to add)
- **None required as npm packages.** Fonts use the built-in Next.js font loader; scroll behaviour uses native browser APIs; UI primitives (`Sheet`, `Button`) are already installed.
- **Assets to add to the repo:** the Archivo-variable and Space-Grotesk `.woff2` files (already downloaded into `docs/mockups/fonts/`, will be moved into the app's font directory).
- **Deferred (not now):** Framer Motion — revisit in PROJ-3.

### Deviations from original spec
- The "language switcher" is built as a visible placeholder only; full locale switching is PROJ-2 (as planned).
- Added two extras the mockup introduced and later features depend on: a **texture layer** (film-grain + grid) and a reusable **in-view reveal helper**. Both honour reduced-motion.


## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
