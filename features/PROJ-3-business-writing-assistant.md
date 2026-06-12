# PROJ-3: German Business Writing Assistant

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- PROJ-2: AI Chat Assistant (local LLM) — uses the same local LLM (Ollama) and chat infrastructure for draft generation and streaming
- PROJ-1: User Accounts & Login (local) — indirect, via PROJ-2 (only logged-in users can use the assistant)

## Overview
Guided writing modes on top of the chat assistant for typical German business correspondence. Instead of writing a free-form prompt, the user picks a writing mode, fills out a short guided form (recipient, key points, desired outcome), selects a tone, and receives a professionally structured German draft that follows correct German business conventions (Anrede, Grußformel, formal "Sie" where appropriate). The user can refine the draft with one-click actions and copy the result to the clipboard.

**Writing modes (MVP):**
1. **E-Mail-Antwort** — reply to a customer email (paste the original email, get a draft reply)
2. **Angebot** — offer/quotation text
3. **Geschäftsbrief** — formal business letter
4. **Reklamationsantwort** — response to a customer complaint
5. **Zahlungserinnerung / Mahnung** — payment reminder / dunning letter

## User Stories
- As an office worker, I want to pick a writing mode (e.g. "E-Mail-Antwort") and fill in a short form instead of writing a prompt, so that I get a professional German draft without needing prompt-writing skills.
- As an office worker, I want to paste a received customer email and state my key points and desired outcome, so that the assistant drafts a reply that actually addresses the customer's message.
- As a back-office employee, I want to choose the tone of the draft (formal "Sie", neutral, friendly), so that the wording matches our relationship with the recipient.
- As a back-office employee, I want one-click refinement actions (regenerate, shorter, longer, more formal), so that I can adjust a draft without re-entering the form.
- As a KMU owner, I want every draft to use correct German business conventions (correct Anrede such as "Sehr geehrte Frau Müller," and Grußformel such as "Mit freundlichen Grüßen"), so that drafts are usable with only minor edits.
- As an office worker, I want to copy the finished draft to my clipboard with one click, so that I can paste it into my email client or word processor.

## Acceptance Criteria
- [ ] The writing assistant offers exactly five modes in the MVP: E-Mail-Antwort (reply to customer email), Angebot, Geschäftsbrief, Reklamationsantwort, and Zahlungserinnerung/Mahnung; the user must select a mode before a draft can be generated.
- [ ] Each mode presents a short guided form with mode-appropriate fields, at minimum: recipient (name and, where relevant, company), key points to convey, and desired outcome; the E-Mail-Antwort mode additionally provides a field to paste the original email; the Zahlungserinnerung/Mahnung mode additionally captures invoice reference, amount, original due date, and reminder level (freundliche Erinnerung / 1. Mahnung / 2. Mahnung).
- [ ] The user can select one of three tones before generating: formal ("Sie"), neutral, or friendly; the generated draft consistently uses the selected tone, and the formal and neutral tones never address the recipient with "du".
- [ ] Generated drafts are in German and follow German business-correspondence conventions: a correct Anrede matching the recipient's name and gender if provided (fallback "Sehr geehrte Damen und Herren," when unknown), a coherent body covering the user's key points, and a closing Grußformel with the sender's name.
- [ ] After a draft is shown, the user can apply the refinement actions "Neu generieren" (regenerate), "Kürzer" (shorter), "Länger" (longer), and "Formeller" (more formal) without re-entering the form; each action produces an updated draft based on the same form input.
- [ ] A "Kopieren" (copy to clipboard) action copies the current draft text to the clipboard and shows a visible confirmation.
- [ ] Required form fields are validated before generation: if a required field is empty (e.g. key points, or the pasted original email in E-Mail-Antwort mode), generation is blocked and a German error message indicates which field is missing.
- [ ] The draft is streamed token-by-token like the chat assistant (PROJ-2), with the first token appearing in under 5 seconds under normal load; the user can cancel an in-progress generation.
- [ ] In the Zahlungserinnerung/Mahnung mode, the draft only contains facts the user entered (invoice reference, amount, due date, reminder level) and never fabricates legal claims, deadlines, interest amounts, or threats of legal action that the user did not specify; a visible disclaimer states that the text is a draft and not legal advice ("Kein Rechtsrat — Entwurf vor Versand prüfen").
- [ ] All generation runs on the local LLM via the existing PROJ-2 infrastructure; no form content or draft ever leaves the Mac mini, and the feature works fully offline.

## Edge Cases
- **Pasted original email is in English (or another non-German language):** the assistant still understands the content and by default drafts the reply in German; the user can explicitly choose to reply in English (secondary language per PRD), but the assistant never silently switches languages.
- **Missing or incomplete required fields:** generation is blocked with a clear German hint; optional fields left empty (e.g. recipient gender/title) lead to safe neutral wording ("Sehr geehrte Damen und Herren,") instead of guessed names or invented details.
- **Legally sensitive content (Mahnung, Reklamation):** the assistant must not invent legal consequences, statutory deadlines, Verzugszinsen percentages, or contractual claims that the user did not provide; if the user requests a sharper escalation than the entered facts support, the draft stays factual and the disclaimer remains visible.
- **Very long pasted source email (e.g. a long thread of several thousand words):** input beyond a defined character limit is rejected or truncated with a clear German notice telling the user what was cut, so the local model's context window is not silently exceeded and the reply does not ignore the user's key points.
- **Pasted email contains personal data or quoted signatures/disclaimers:** the draft reply must not echo the sender's full signature block, phone numbers, or legal disclaimers from the original email back into the reply body.
- **Contradictory inputs (e.g. tone "friendly" combined with reminder level "2. Mahnung"):** the assistant produces a polite but unambiguous text appropriate to the reminder level rather than an inappropriately casual one, and does not weaken the factual payment demand.
- **Model busy or unavailable (Ollama overloaded by concurrent users / not running):** the user sees the same German error/queue behavior as in PROJ-2 chat; entered form data is preserved so nothing must be retyped.

## Technical Requirements (optional)
- Performance: first streamed token < 5 s on the Mac mini M4 (16 GB) under normal load; UI form interactions < 200 ms.
- Security: authentication required (PROJ-1); drafts and form inputs are only visible to the user who created them.
- Privacy: zero outbound network calls containing user content; fully functional offline (DSGVO by design).
- Language: UI labels and error messages in German (primary); drafts in German by default, English as explicit secondary option.
- Browser Support: current Chrome, Firefox, Safari, Edge on the LAN.

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
