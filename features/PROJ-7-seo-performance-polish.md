# PROJ-7: SEO & Performance Polish

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- Requires: PROJ-1 through PROJ-6 — polishes the complete MVP site

## User Stories
- As a searcher for "Werbeagentur Kevelaer" or "Webdesign Niederrhein", I want the site to rank and present a compelling snippet so that I click through.
- As a visitor sharing the site on WhatsApp/LinkedIn, I want a branded preview card so that the link looks professional.
- As any visitor, I want the site to load near-instantly so that the "award-worthy" claim is backed by real speed.
- As the agency owner, I want search engines to index both language versions correctly so that I reach German and English prospects.

## Acceptance Criteria
- [ ] Unique, localized `<title>` and meta description per locale and per page (home, impressum, datenschutz)
- [ ] Open Graph + Twitter card metadata with a branded social-share image (dark/red brand visual)
- [ ] `sitemap.xml` and `robots.txt` generated, covering both locales with `hreflang` alternates
- [ ] LocalBusiness structured data (JSON-LD): name, address, phone, geo, opening hours placeholder, founder
- [ ] Lighthouse ≥ 95 in Performance, Accessibility, Best Practices, and SEO on mobile emulation for the home page (both locales)
- [ ] Core Web Vitals targets: LCP < 2.0s, CLS < 0.1, INP < 200ms (lab measurements)
- [ ] All images served via `next/image` with explicit dimensions and modern formats (AVIF/WebP)
- [ ] Favicon set + web manifest with brand colors
- [ ] Custom branded 404 page in both locales

## Edge Cases
- What happens when a crawler requests `/` (no locale)? → Redirect with correct status code; canonical URLs point to locale pages.
- What if Lighthouse scores drop below target after a content change? → Documented performance budget; QA re-runs audit before deploy.
- How do social previews behave for `/en` links? → English OG title/description served for EN URLs.

## Technical Requirements (optional)
- No third-party scripts that block rendering; analytics (if added later) must be consent-gated per DSGVO
- Verify with `npm run build` that all routes are statically generated except the contact endpoint

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
