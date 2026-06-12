# PROJ-1: Design System & Global Layout

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

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
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
