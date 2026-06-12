# PROJ-5: Document Summarization & Extraction

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- PROJ-4: Document Upload & Management (documents must be uploaded and their text available before summarization or extraction can run)

## User Stories
- As an office staff member, I want to generate a short German summary (3–5 bullet points) of any uploaded document so that I can grasp its content in seconds without reading the whole PDF.
- As a managing director, I want to generate a detailed, structured German summary (sections such as Überblick, Kernpunkte, Fristen/Termine, Offene Punkte) of a long contract or report so that I can prepare for a meeting without reading every page.
- As a back-office employee, I want to run structured extraction on an invoice (Rechnung) — invoice number, date, vendor, line items, net/VAT/gross amounts (Netto/MwSt./Brutto), due date — so that I can transfer the data into our bookkeeping without retyping it.
- As a KMU owner, I want to run structured extraction on a contract (Vertrag) — parties, start/end dates, notice periods (Kündigungsfristen), key obligations — so that I never miss a cancellation deadline.
- As any team user, I want to review and correct extracted values in an editable table before copying them as CSV or JSON so that errors made by the AI do not end up in my downstream systems.
- As any team user, I want clear progress feedback when processing a long document that exceeds the model's context window so that I know the system is working and roughly how long it will take.

## Acceptance Criteria
- [ ] From the document detail view (PROJ-4), the user can start "Zusammenfassung" with a choice of two modes: "Kurz" (3–5 German bullet points) and "Ausführlich" (structured German sections); the result is displayed in the UI and can be copied as text.
- [ ] From the document detail view, the user can start "Datenextraktion" with a choice of document type: "Rechnung" or "Vertrag"; the extraction returns the type-specific fields (Rechnung: invoice number, invoice date, vendor, line items with description/quantity/unit price/amount, net amount, VAT rate(s) and amount(s), gross amount, due date; Vertrag: contracting parties, start date, end date, notice period(s), key obligations).
- [ ] Extraction results are shown as a table where every extracted value is editable inline; corrections made by the user are reflected in the copy output.
- [ ] Extraction results can be copied to the clipboard as CSV text and as JSON text, including any user corrections; field names/labels are in German.
- [ ] Fields the model could not find in the document are explicitly shown as "Nicht gefunden" (not silently omitted and not filled with guessed values).
- [ ] Documents longer than the model's usable context window are processed in chunks; the UI shows a progress indication (e.g. "Abschnitt 3 von 12 wird verarbeitet…") and the user can cancel a running job.
- [ ] Every summary and extraction result is visibly labeled as machine-generated and potentially imperfect, with an explicit German notice that amounts and dates must be verified by the user before use (e.g. "KI-generiert – bitte Beträge und Daten prüfen").
- [ ] Summaries and extraction output are produced in German regardless of the document's language; if the source document is not German, the UI indicates that the content was translated/summarized from another language.
- [ ] All processing runs entirely on the local server (Ollama); the feature works with the network cable to the internet unplugged, and no document content leaves the machine.
- [ ] If summarization or extraction fails (model error, timeout, unreadable text), the user sees a clear German error message with the option to retry; a partial/failed run never shows fabricated results.

## Edge Cases
- **Document with no extractable text** (e.g. scanned PDF that is only images, or an empty file): the feature must detect this before invoking the model and tell the user the document contains no readable text ("Kein lesbarer Text gefunden") rather than producing a hallucinated summary. Out of scope: OCR is not part of this feature.
- **Invoice with missing fields** (e.g. no due date, no VAT shown for a Kleinunternehmer invoice): missing fields appear as "Nicht gefunden" in the table; the user can fill them in manually; the copy output marks them as empty, never as invented values.
- **Very long document (e.g. 200-page contract):** processing must chunk the text, show progress per chunk, remain cancelable, and produce a coherent merged result; if processing would exceed a reasonable time limit, the user is warned up front with an estimated duration and can choose to proceed or summarize a page range only.
- **Mixed-language document** (e.g. German contract with English annexes): the summary is still delivered in German; the result notes which parts were in another language; extraction maps foreign-language field labels (e.g. "Invoice No.") to the German output fields correctly.
- **Model hallucinates or misreads an amount** (e.g. reads 1.500,00 € as 1500.00 with wrong decimal interpretation): the editable table plus the mandatory "verify amounts" notice are the safeguards; where feasible the UI flags implausible values (e.g. net + VAT ≠ gross) so the user is prompted to check them.
- **Multiple invoices in one uploaded file** or a document that matches neither "Rechnung" nor "Vertrag": the system extracts what it can, indicates low confidence / unexpected structure, and never silently merges values from different invoices into one record.
- **Concurrent heavy requests** (another user is running a long extraction on the shared Mac mini): new jobs are queued rather than failing; the user sees a waiting state ("In Warteschlange…") instead of an error.

## Technical Requirements (optional)
- Performance: short summary of a typical 1–3 page document starts streaming/completes within a usable time on the Mac mini M4 16 GB; long-document jobs show progress within 5 seconds of starting.
- Security: feature available only to logged-in users (PROJ-1); users can only summarize/extract documents they are permitted to access per PROJ-4's access rules.
- Privacy: 100% local processing, no outbound network calls containing document content; fully functional offline.
- Language: all UI labels, notices, and generated output in German (English as secondary UI language where the app supports it).
- Browser Support: current Chrome, Firefox, Safari, Edge on desktop; responsive web UI.

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
