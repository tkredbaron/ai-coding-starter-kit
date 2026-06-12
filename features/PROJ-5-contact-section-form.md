# PROJ-5: Contact Section & Form

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- Requires: PROJ-1 (Design System & Global Layout) — theme tokens, section layout
- Requires: PROJ-2 (Internationalization) — form labels/messages in DE/EN

## User Stories
- As a prospect, I want to send an inquiry with name, email, and message so that the agency can get back to me about my project.
- As a prospect in a hurry, I want phone number and email displayed directly so that I can skip the form entirely.
- As a form user, I want instant, friendly validation feedback so that I know exactly what to fix before submitting.
- As a submitter, I want clear confirmation that my message was sent so that I trust it arrived.
- As the agency owner, I want every submission delivered to my inbox (tk@red-baron.de) so that no lead is lost.
- As the agency owner, I want basic spam protection so that my inbox isn't flooded by bots.

## Acceptance Criteria
- [ ] Contact section with anchor (`#kontakt` / `#contact`) containing: direct contact details (phone 02832 974222, email, address Ahornweg 26, 47624 Kevelaer) and the inquiry form
- [ ] Form fields: name (required), email (required, valid format), phone (optional), message (required, min 10 chars) — validated client-side with Zod + react-hook-form and identically server-side
- [ ] Validation errors shown inline per field, localized DE/EN
- [ ] Submission handled by a serverless endpoint that emails the inquiry to the agency inbox; no database
- [ ] Success state replaces the form with a localized confirmation message; failure shows a retry-able localized error (form input preserved)
- [ ] Submit button shows a pending state and prevents double-submission
- [ ] Spam protection: honeypot field + minimum-time-to-submit check (no user-visible CAPTCHA)
- [ ] Rate limiting on the endpoint (per-IP) returns a friendly localized message when exceeded
- [ ] DSGVO: consent checkbox (required) linking to the Datenschutzerklärung before submit is allowed

## Edge Cases
- What happens if the email service is down? → User sees a failure message with the phone number as fallback; input is not lost.
- What happens on duplicate rapid submissions? → Button disabled while pending; rate limit catches scripted repeats.
- What if a bot fills the honeypot or submits in under 3 seconds? → Request silently accepted but discarded (no error oracle for bots).
- What about HTML/script content in the message? → Sanitized/escaped before inclusion in the email; reply-to header set safely.
- What if the user is offline on submit? → Network error message, form state preserved.

## Technical Requirements (optional)
- Security: server-side validation, header-injection-safe email construction, no secrets in client bundle
- Response time: endpoint responds < 2s (email send may be fire-and-forget after validation)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
