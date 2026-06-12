# PROJ-6: Legal Pages (Impressum & Datenschutz)

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- Requires: PROJ-1 (Design System & Global Layout) — footer links, page layout

## User Stories
- As a German visitor, I want a complete Impressum so that I can verify who operates the site (legal requirement, §5 DDG).
- As a visitor, I want a Datenschutzerklärung so that I understand what happens to my data, especially when using the contact form (DSGVO Art. 13).
- As the agency owner, I want both pages reachable from every page of the site so that the site is legally compliant ("2 clicks" rule).
- As the agency owner, I want the legal texts easy to update so that I can adjust them when legal requirements change.

## Acceptance Criteria
- [ ] `/impressum` page with: operator name (red baron werbeagentur, Inh. Tobias Kolesnyk), address (Ahornweg 26, 47624 Kevelaer), phone (02832 974222), email, and placeholders for USt-IdNr./further mandatory details flagged for owner confirmation
- [ ] `/datenschutz` page covering: responsible party, hosting (Vercel) data processing, contact form data handling (purpose, legal basis, retention), cookie/local-storage usage (locale cookie), user rights under DSGVO — with placeholders flagged where owner/DPO confirmation is needed
- [ ] Both pages linked from the footer on every page and from the contact form consent checkbox
- [ ] Pages render in the global layout (header/footer) with readable long-form typography on the dark theme
- [ ] Pages are excluded from the cinematic animation treatment — instant, sober, fully static
- [ ] German versions are authoritative; EN locale links to the German pages with a short EN explanatory note
- [ ] `noindex` not set — pages remain crawlable (legally expected to be findable)

## Edge Cases
- What happens when legal content placeholders are not yet confirmed? → Page shows clearly marked placeholder blocks; QA blocks deployment until the owner confirms final texts.
- What if the user lands on legal pages directly via search? → Header navigation still works to reach the main page sections.
- How are future legal updates handled? → Content lives in editable markdown/content files, not hardcoded JSX.

## Technical Requirements (optional)
- Accessibility: proper heading hierarchy for long-form text
- These pages are content-only; no client-side JavaScript required

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
