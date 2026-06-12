# Product Requirements Document

## Vision
Relaunch www.red-baron.de as an award-worthy agency website that proves red baron werbeagentur's design and web expertise through its own web presence. The site is a bold, cinematic one-pager (dark theme, red accents, scroll-driven animations) built with Next.js, React, and Tailwind CSS — fast, accessible, and bilingual (DE/EN). The website itself is the agency's strongest portfolio piece.

## Target Users
- **Regional SMB owners (Geldern–Kevelaer–Niederrhein):** Need a trustworthy, local partner for webdesign, corporate design, and marketing. Pain point: agencies feel anonymous and overpriced; they want personal contact and visible proof of quality.
- **Founders / business starters:** Need brand building and a first web presence. Pain point: don't know where to start; want clear service descriptions and an easy way to get in touch.
- **English-speaking prospects:** International or expat-run businesses in the region who need the same information in English.

## Core Features (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| P0 (MVP) | PROJ-1: Design System & Global Layout | Planned |
| P0 (MVP) | PROJ-2: Internationalization (DE/EN) | Planned |
| P0 (MVP) | PROJ-3: Cinematic Hero Section | Planned |
| P0 (MVP) | PROJ-4: Services Section | Planned |
| P0 (MVP) | PROJ-5: Contact Section & Form | Planned |
| P0 (MVP) | PROJ-6: Legal Pages (Impressum & Datenschutz) | Planned |
| P1 | PROJ-7: SEO & Performance Polish | Planned |

## Success Metrics
- Contact form submissions / phone inquiries per month (primary conversion)
- Lighthouse scores ≥ 95 (Performance, Accessibility, Best Practices, SEO)
- Bounce rate below 50% and average session > 60s
- Top-3 Google ranking for "Werbeagentur Kevelaer" / "Webdesign Niederrhein"

## Constraints
- Owner-managed micro agency: content maintenance must require no code changes beyond editing translation/content files
- No database/CMS in MVP — static site + serverless contact form only
- Stack fixed: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Vercel
- German legal requirements: Impressum (§5 TMG/DDG) and Datenschutzerklärung (DSGVO) mandatory
- Live legacy site at red-baron.de is not accessible from this environment; content is rebuilt from the agency profile (services: Webdesign, Corporate Design, Marketing & Markenaufbau, Print; owner: Tobias Kolesnyk; since 2003; Ahornweg 26, 47624 Kevelaer; 02832 974222)

## Non-Goals
- No CMS, blog, or client login in this version
- No portfolio/case-study pages in MVP (planned as a later feature)
- No e-commerce or online booking
- No languages beyond German and English

---

Use `/requirements` to create detailed feature specifications for each item in the roadmap above.
