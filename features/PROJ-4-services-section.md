# PROJ-4: Services Section

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- Requires: PROJ-1 (Design System & Global Layout) — theme tokens, section layout
- Requires: PROJ-2 (Internationalization) — service copy in DE/EN

## User Stories
- As an SMB owner, I want to see at a glance which services the agency offers (Webdesign, Corporate Design, Marketing & Markenaufbau, Print) so that I know whether they cover my needs.
- As a prospect, I want a short, benefit-focused description per service so that I understand what outcome I get, not just a label.
- As a visitor, I want delightful micro-interactions when exploring services (hover/scroll reveals) so that the section itself demonstrates the agency's craft.
- As a founder, I want to see that the agency also supports business starters so that I feel addressed even without an existing brand.
- As a convinced visitor, I want each service to lead me toward contact so that the path to inquiry is never more than one click away.

## Acceptance Criteria
- [ ] Four services presented: Webdesign, Corporate Design, Marketing & Markenaufbau, Print — each with title, 2–3 sentence benefit description, and representative iconography/visual
- [ ] Content sourced from locale dictionaries (DE/EN)
- [ ] Scroll-triggered staggered reveal as the section enters the viewport (once, not on every scroll)
- [ ] Distinct hover/focus interaction per service card (desktop) with touch-appropriate equivalent on mobile
- [ ] Each service links/scrolls to the contact section (e.g. "Lass uns reden" / "Let's talk")
- [ ] Section has a navigable anchor (`#leistungen` / `#services`) reachable from the header
- [ ] Cards are keyboard-focusable with visible focus state; reveal animations respect `prefers-reduced-motion`
- [ ] Layout: 1 column on mobile, 2 columns on tablet, 2–4 on desktop without orphaned cards

## Edge Cases
- What happens with longer EN/DE text variants? → Cards grow gracefully; no clipped or overflowing text in either language.
- What if images/icons fail to load? → Text content remains fully readable; alt text present.
- How does the reveal behave when the user deep-links straight to `#leistungen`? → Content is visible immediately, not stuck pre-animation.
- What about users who scroll extremely fast? → All cards end in their final visible state; no missed reveals.

## Technical Requirements (optional)
- Animations via transform/opacity only (compositor-friendly), 60fps target
- No external icon CDN — assets bundled locally

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
