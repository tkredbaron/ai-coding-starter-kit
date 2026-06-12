# PROJ-2: Internationalization (DE/EN)

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- Requires: PROJ-1 (Design System & Global Layout) — language switcher lives in the header

## User Stories
- As a German-speaking visitor, I want the site in German by default so that I can read everything in my native language.
- As an English-speaking visitor, I want to switch to English with one click so that I understand the agency's offer.
- As a returning visitor, I want my language choice remembered so that I don't have to switch again.
- As the agency owner, I want all copy maintained in simple per-language content files so that I can edit text without touching component code.
- As a visitor sharing a link, I want the URL to reflect the language (e.g. `/de`, `/en`) so that recipients see the same language version.

## Acceptance Criteria
- [ ] Locale-prefixed routing (`/de/...`, `/en/...`) with German as default locale
- [ ] Visiting `/` redirects to the best locale based on `Accept-Language` header, falling back to German
- [ ] Language switcher in the header toggles locale while preserving the current section/path
- [ ] 100% of UI copy (navigation, hero, services, contact, footer, legal links, validation messages) comes from locale dictionaries — no hardcoded strings in components
- [ ] Language choice persists across visits (cookie)
- [ ] `<html lang>` attribute and `hreflang` alternate links are correct per locale
- [ ] Legal pages note: Impressum/Datenschutz remain German-authoritative; EN versions may link to the German originals

## Edge Cases
- What happens on an unknown locale URL (e.g. `/fr/`)? → 404 or redirect to default locale `/de`.
- What if a translation key is missing in EN? → Build-time check fails or German fallback renders — never a raw key on screen.
- How do search engines see the two languages? → Both locales indexable with correct `hreflang`, no duplicate-content penalty.
- What happens when the user's browser prefers neither DE nor EN? → German default.

## Technical Requirements (optional)
- No client-side translation loading waterfall — dictionaries resolved server-side
- SEO: per-locale metadata (title, description)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
