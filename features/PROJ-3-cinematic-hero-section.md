# PROJ-3: Cinematic Hero Section

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- Requires: PROJ-1 (Design System & Global Layout) — theme tokens, typography, layout shell
- Requires: PROJ-2 (Internationalization) — hero copy in DE/EN

## User Stories
- As a first-time visitor, I want an immediately impressive opening moment (bold claim, dramatic typography, motion) so that within 3 seconds I believe this agency can make my brand look this good.
- As a visitor, I want a clear primary call-to-action in the hero so that I know the next step is to get in touch.
- As a visitor scrolling down, I want the hero to respond to my scroll (parallax/reveal) so that the site feels alive and crafted.
- As a visitor on a slow connection, I want the hero text visible instantly so that I'm not staring at a blank or loading screen.

## Acceptance Criteria
- [ ] Full-viewport hero with oversized display headline (agency claim) and supporting subline, both from locale dictionaries
- [ ] Staggered entrance animation on load (headline, subline, CTA) completing within ~1.5s
- [ ] Scroll-driven effect (e.g. parallax layers or headline transform) tied to scroll position, 60fps on mid-range devices
- [ ] Primary CTA button ("Projekt anfragen" / "Start a project") scrolls to the contact section
- [ ] Subtle red-accent visual signature element (e.g. animated gradient, line motif) reinforcing the brand
- [ ] Scroll indicator hints that more content follows
- [ ] Hero headline is server-rendered text (real HTML, not canvas/image) and is the page's single `<h1>`
- [ ] With `prefers-reduced-motion`, all hero content appears statically without animation

## Edge Cases
- What happens on short viewports (landscape phones, ~400px height)? → Content scales down, CTA stays visible without overlap.
- What happens if the user scrolls before the entrance animation finishes? → Animation completes instantly or cancels gracefully — never blocks scrolling.
- How does the hero behave on very large screens? → Typography scales with viewport but is clamped to a maximum size.
- What if WebGL/advanced effects are unsupported? → Graceful fallback to CSS-only presentation.

## Technical Requirements (optional)
- Performance: LCP element is the hero headline, LCP < 2.0s on 4G
- No layout shift between SSR and hydration

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
