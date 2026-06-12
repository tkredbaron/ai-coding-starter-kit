# PROJ-6: Document Q&A (RAG)

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- PROJ-4 (Document Upload & Management) — documents must be uploadable and managed with visibility settings before they can be queried

## User Stories
- As a team member, I want to ask questions in natural German (e.g. "Wie viele Urlaubstage stehen mir zu?") and receive answers grounded in our uploaded company documents, so that I find information without reading through files manually.
- As a team member, I want to scope my question to the whole company library, to specific selected documents, or to my private documents only, so that answers come from the sources I actually care about.
- As a team member, I want every answer to cite its sources (document name plus the relevant passage), and I want to click a citation to view that passage in context, so that I can verify the answer is correct before acting on it.
- As a team member, I want the assistant to clearly tell me when the documents do not contain an answer (e.g. "Dazu finde ich nichts in den Dokumenten."), so that I am never misled by an invented answer.
- As a document owner, I want newly uploaded or updated documents to become searchable automatically, with a visible indexing status ("wird indexiert" / "bereit"), so that I know when a document is ready for Q&A without any manual steps.
- As a team member, I want my Q&A sessions saved in a personal history, so that I can return to previous questions and answers later.

## Acceptance Criteria
- [ ] A user can type a question in German and receives an answer in German that is based exclusively on the content of uploaded documents within the chosen scope.
- [ ] Before asking, the user can choose the question scope: (a) entire company library, (b) one or more selected documents, (c) own private documents only; the active scope is visible while asking.
- [ ] Answers never draw on documents the user is not permitted to see (per PROJ-4 visibility rules); a question whose only matching content lives in invisible documents is answered with "not found", with no hint that hidden content exists.
- [ ] Every answer lists its sources: document name and the relevant passage(s) used; clicking a source opens/highlights that passage so the user can read it in context.
- [ ] When the documents in scope contain no answer to the question, the assistant explicitly says so (in German) instead of producing a speculative or invented answer.
- [ ] After a document upload or update completes (PROJ-4), indexing starts automatically without user action, and the document shows a visible indexing status of at least "wird indexiert" and "bereit"; a document is only used for answers once it is "bereit".
- [ ] A failed indexing attempt is shown as an error status on the document with the option to retry; the failure does not block Q&A over other documents.
- [ ] Each user has a personal Q&A session history: previous sessions are listed, can be reopened with full question/answer/citation context, and can be deleted by the user; users never see other users' sessions.
- [ ] Q&A is only available to logged-in users, works entirely on the local network without any internet connection, and all UI texts are in German.
- [ ] Asking a question while a document in scope is still indexing informs the user that this document is not yet included in the answer.

## Edge Cases
- **Question matching only an invisible document:** A user asks about content that exists solely in a document they cannot see → the assistant answers "not found in the documents" and must not leak the document's name, existence, or content.
- **Document deleted after indexing:** A document was indexed, then deleted in PROJ-4 → it is removed from search immediately; old sessions that cited it keep the answer text but the citation shows "Dokument wurde gelöscht" instead of opening the passage.
- **Contradictory information in two documents:** Two documents in scope give conflicting answers (e.g. old vs. new vacation policy) → the assistant surfaces both statements with their respective sources and points out the contradiction rather than silently picking one.
- **Question in English about German documents:** A user asks in English → the assistant still retrieves from the German documents and answers usefully (in the language of the question or German), rather than failing because of the language mismatch.
- **Empty library / empty scope:** The user asks a question when no documents exist in the selected scope (e.g. empty private library) → a clear German message explains that there are no documents to search and suggests uploading some, instead of a generic "no answer".
- **Very broad or off-topic question:** The user asks something unrelated to any document content (e.g. small talk or general knowledge) → the assistant states that the question cannot be answered from the documents instead of answering from general model knowledge within the Q&A context.

## Technical Requirements (optional)
- Privacy: All processing (question, retrieval, answer generation, history) happens 100% locally on the company's own hardware; no data ever leaves the LAN (DSGVO).
- Security: Authentication required; document visibility rules are enforced on every retrieval, not just in the UI.
- Performance: Indexing of a typical document (≤ 50 pages) should complete within a few minutes; answers should begin appearing within a reasonable time on the target hardware (Mac mini M4, 16 GB RAM) with a visible progress/typing indicator.
- Language: Primary UI language German; questions and answers must work well for German-language documents.

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
