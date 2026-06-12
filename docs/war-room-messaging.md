# War-Room Report: Messaging & Persuasion Strategy

> Produced 2026-06-12 by 7 parallel strategy agents, each applying Edward Bernays
> (engineering of consent, symbolism, dramatization) and Robert Cialdini
> (reciprocity, commitment/consistency, social proof, authority, liking, scarcity, unity)
> to one feature of the red-baron.de relaunch. Input for `/architecture` and `/frontend`.
> Ethics baseline for all recommendations: only verifiable facts, no dark patterns,
> no fake scarcity, no invented testimonials or ratings.

## The Master Frame

**Bernays:** Don't argue competence — dramatize it. The site itself is the proof
("Can these people make *me* look this good?"). The "Red Baron" symbol is used as
attitude (precision, mastery, the rare red element moving against a dark sky),
never as WWI costume — one controlled wink maximum.

**Cialdini:** The agency's true, verifiable assets map directly onto principles:
- **Authority:** inhabergeführt seit 2003; the flawless site as demonstrated craft
- **Unity:** Kevelaer / Niederrhein identity — "one of us", not an anonymous Düsseldorf agency
- **Liking:** you talk to Tobias, the owner — anti-callcenter, plain German, no Denglish buzzwords
- **Reciprocity:** free Erstgespräch, concrete reply promise *(owner-to-confirm, see Open Items)*
- **Commitment/Consistency:** a ladder of micro-commitments from scroll → micro-CTA → form → reply
- **Scarcity (honest, structural):** one owner, finite attention — stated factually if at all
- **Social proof:** deferred — no portfolio in MVP; never faked

**Visual doctrine:** Red is scarce and always means action/mastery (CTAs, active states,
progress). Scarcity of red = authority of red.

---

## PROJ-1 Design System & Global Layout

1. **Footer Vertrauenszeile** (Authority + Unity): owner name, "seit 2003", address, clickable phone above the legal links.
2. **Sticky-nav CTA** — the only red element in the header: „Projekt anfragen" / "Start a project"; survives as bottom item of the mobile overlay menu.
3. **Red scroll-progress bar** under the header (Commitment: visitors see their invested journey). Off under `prefers-reduced-motion`.
4. **Logo lockup** „Werbeagentur · Kevelaer" at desktop widths (Unity + SEO).
5. **Footer reciprocity link:** „Kostenloses Erstgespräch vereinbaren" / "Book a free consultation".

Microcopy: Footer trust line „Inhabergeführt am Niederrhein — seit 2003." · Contact line „Direkter Draht: 02832 974222 — Sie sprechen mit dem Inhaber." · Sign-off „Gestaltet & entwickelt in Kevelaer." / "Designed & built in Kevelaer."

## PROJ-2 Internationalization — Tone of Voice

Bilingualism is itself an authority signal: the EN version's main job is to be *seen existing* by German prospects ("agency that could serve anyone, but chooses the Niederrhein").

- **DE: Sie, but warm Sie.** Short sentences, active voice, first person where Tobias speaks. Region by name („Geldern, Kevelaer, Niederrhein"), never by cliché. Ban Denglish buzzwords — plain German is the honesty signal against the "anonymous agency" pain point.
- **EN: confident boutique** — "German design discipline, personal scale", slightly understated; lean into German-made precision. Be transparent that legal pages are German-authoritative.
- Same message renders differently per locale, e.g. DE: „Kein Callcenter, keine Praktikanten-Schleife — Sie sprechen direkt mit dem Inhaber." EN: "You talk to the person who does the work." EN contact must defuse the real anxiety: "We reply in English, usually within one business day."
- Tone rules live as a style header in the locale dictionaries so the owner edits copy within guardrails.

## PROJ-3 Hero — Claim Candidates

Job of the first 3 seconds: non-verbal proof (cinematic stage, expensive motion), then the headline converts admiration into relevance + one obvious next step.

| # | DE Headline / Subline | EN | Principles |
|---|---|---|---|
| A (primary) | „Sichtbar. Anders." / „Webdesign, Marken & Marketing vom Niederrhein — inhabergeführt seit 2003." | "Impossible to overlook." | Authority by demonstration, Unity |
| B (primary alt) | „Marken, die man nicht übersieht." / „Ihre Werbeagentur in Kevelaer — persönlich, seit 2003." | "Brands nobody scrolls past." | Implicit social proof, Liking, Unity |
| C (A/B challenger) | „Gute Marken fliegen nicht von allein." / „Wir bringen Ihre auf Kurs — Design, Web und Marketing aus Kevelaer." | "Great brands don't fly themselves." | Controlled Red-Baron wink, Reciprocity |
| D | „Ihr Auftritt. Unser Handwerk." / „Corporate Design, Webdesign & Markenaufbau für den Niederrhein — seit 2003." | "Your stage. Our craft." | Liking via Handwerk, Unity |

CTA: **„Projekt anfragen" / "Start a project"** — a specific, low-threshold commitment that primes the visitor's identity as "someone with a project". Softer test variant: „Lassen Sie uns reden" / "Let's talk". Scroll hint: „Mehr sehen" / "See more".

## PROJ-4 Services — Desire Reframes

Unifying desire: **visibility = legitimacy = pride of ownership** ("the business that looks as good as it actually is").

| Service | DE Title | Core line | Micro-CTA (→ #kontakt) |
|---|---|---|---|
| Webdesign | „Der erste Händedruck Ihrer Firma" | „Bevor jemand Sie anruft, googelt er Sie. … Diese Seite hier? Ist unser Beweis." | „Zeigen Sie mir meine Website-Chancen" |
| Corporate Design | „Unverwechselbar werden" | „…ein Gesicht, das bleibt. Seit 2003 machen wir genau das am Niederrhein." | „Wie wirkt mein Auftritt heute? Lass uns drüber reden" |
| Marketing & Markenaufbau | „Vom Geheimtipp zur ersten Wahl" | „…Schritt für Schritt Vertrauen aufbauen. Auch und gerade, wenn Sie ganz am Anfang stehen." (addresses founders) | „Erzählen Sie uns von Ihrer Idee" |
| Print | „Was man in der Hand hält, bleibt im Kopf" | „In einer Welt voller Bildschirme ist Gedrucktes ein Statement. … Digital und Print aus einer Hand." | „Was soll Ihr nächstes Druckstück erreichen?" |

EN variants delivered per card ("Your company's first handshake", "Become unmistakable", "From hidden gem to first choice", "What you can hold stays on your mind"). Commitment ladder: read benefit → self-identify → answer a low-stakes question → contact form. Optional honest-scarcity outro line (not per card): „Inhabergeführt — ich nehme nur Projekte an, die ich selbst betreuen kann." *(owner-to-confirm)*

## PROJ-5 Contact — The Conversion Moment

Defuse the SMB owner's fears (cost, commitment, sales machine) by reframing "Anfrage" → "Gespräch mit Tobias":

- **Heading:** „Lassen Sie uns reden. Direkt mit Tobias." Sub: „Kein Callcenter, kein Vertrieb — Ihre Nachricht landet direkt bei mir."
- **Submit button:** „Nachricht an Tobias senden" (not „Anfrage absenden") / "Send message to Tobias"
- **Reassurance under button:** „Unverbindlich & kostenlos. Sie erhalten innerhalb von 24 Stunden (werktags) eine persönliche Antwort." *(24h promise: owner-to-confirm)*
- **Success message** (Consistency): „Danke — gute Entscheidung. Ihre Nachricht liegt jetzt bei mir auf dem Tisch. … Wenn's eilt: 02832 974222."
- **DSGVO consent as trust asset, first person:** „Ihre Daten nutze ich ausschließlich, um Ihre Anfrage zu beantworten — keine Newsletter, keine Weitergabe."
- **Field strategy:** keep name/email/message only; phone optional labeled „(optional — falls Sie lieber telefonieren)". Do NOT ask company, budget, dropdowns, uploads — budget questions trigger exactly the cost fear. No CAPTCHA (spec's honeypot+timing is right). Message placeholder: „Erzählen Sie kurz, worum es geht — zwei Sätze reichen."

## PROJ-6 Legal Pages as Trust Assets

German SMB owners deliberately check the Impressum before contacting an unknown agency — flawless correctness is the authority signal.

- **Human preamble** (visually separate „Kurz gesagt" box) above each legal text: „Kein Kleingedrucktes-Versteckspiel: Hier steht, wer hinter red baron steht und was mit Ihren Daten passiert — verständlich erklärt, rechtlich vollständig."
- **Datenschutz restates the form promise verbatim** (Consistency): „Was Sie uns über das Kontaktformular schreiben, landet direkt bei Tobias Kolesnyk — bei niemandem sonst." Followed immediately by formal Art. 13 details.
- **Impressum unity line:** „Inhabergeführt in Kevelaer seit 2003. Wenn Sie anrufen, ist Tobias dran — 02832 974222."
- **Red lines:** legal body stays sober and complete (no marketing language inside it); preambles must never contradict or oversimplify it; „nur an Tobias" must be technically true (mail routing, no analytics piggybacking); QA blocks deploy until owner confirms final texts.

## PROJ-7 SEO & Social — Winning the Click

- **Home DE title (57 chars):** `Werbeagentur Kevelaer – red baron | Webdesign Niederrhein`
  **Meta:** „Webdesign, Corporate Design & Marketing vom Niederrhein — seit 2003 inhabergeführt in Kevelaer. Persönlich statt anonym. Direkter Draht zum Chef."
- **Home EN:** `Web Design & Branding Kevelaer | red baron ad agency` — "…personal, direct, no anonymous account managers."
- **Impressum meta** includes real name + street (verifiability IS the snippet's trust signal). **Datenschutz meta:** „…keine Tracking-Cookies, kein Verkauf von Daten, klare Sprache statt Juristendeutsch." *(only while no-analytics stays true)*
- **OG card:** near-black 1200×630, single red typographic statement „Werbung, die sitzt." / "Advertising that lands.", wordmark + „Kevelaer · seit 2003". Per-locale variants. On beige LinkedIn/WhatsApp feeds the dark/red card is the ad.
- **Speed-as-proof line** (footer, quiet, conditional): „Diese Seite lädt in unter einer Sekunde. Ihre auch?" — ship only while Lighthouse ≥ 95 / LCP < 2.0s is QA-enforced; kill otherwise.
- **JSON-LD:** `@type: ProfessionalService` with `foundingDate: 2003`, `founder` as Person (Tobias Kolesnyk), address, geo, `telephone: +49-2832-974222`, `areaServed` (Kevelaer, Geldern, Niederrhein), `knowsLanguage: [de, en]`; `sameAs` only with real live profiles; **no** `aggregateRating`/`review` until genuine reviews exist.

---

## Open Items for Tobias (owner-to-confirm before copy ships)

1. **24-hour reply promise** (werktags) — only ship if it can be kept.
2. **Free Erstgespräch** wording and scope.
3. **First-person voice + photo** of Tobias at the contact form.
4. **Honest-scarcity line** („…nur Projekte, die ich selbst betreuen kann") — use or drop.
5. **Hero claim decision:** A or B as primary, C as later A/B challenger.
6. Final Impressum/Datenschutz facts (USt-IdNr. etc., per PROJ-6 placeholders).

## Voice Consistency Note

PROJ-4 copy speaks as „wir", PROJ-5/6 as „ich" (Tobias). Decision needed in `/frontend`:
recommended pattern — **„wir" for capability statements, „ich" at every personal touchpoint**
(contact form, success message, consent, Impressum preamble). German address is **Sie** throughout.
