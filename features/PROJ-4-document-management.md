# PROJ-4: Document Upload & Management

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- PROJ-1: User Accounts & Login (users must be authenticated; Admin/Member roles are used for delete permissions)

## Overview
Logged-in team members can upload company documents (PDF, DOCX, TXT, MD) that are stored entirely on the Mac mini — never in the cloud. Each document belongs to one of two scopes: the **shared company library** (visible to all logged-in users) or **private documents** (visible only to the uploader). Uploaded documents are the foundation for later AI features: their text content must be extractable so that summarization (PROJ-5) and document Q&A (PROJ-6) can work on them. Documents where no text can be extracted (e.g. scanned image-only PDFs) are clearly flagged. The UI is in German.

## User Stories
- As a team member, I want to upload a document (PDF, DOCX, TXT, or MD) and choose whether it goes into the shared company library or my private documents, so that I control who can see it.
- As a team member, I want to see a list of all documents I have access to — with name, file size, upload date, uploader, and scope (shared/private) — so that I can quickly find the document I need.
- As a team member, I want to delete documents I uploaded myself, so that I can remove outdated or accidentally uploaded files.
- As an admin, I want to delete any document in the system (shared or private), so that I can keep the company library clean and remove content that should not be stored.
- As a team member, I want immediate, understandable feedback (in German) when an upload fails — unsupported format, file too large, or upload error — so that I know what went wrong and what to do instead.
- As a team member, I want to see a clear warning on documents whose text could not be extracted (e.g. a scanned image-only PDF), so that I know AI features like summarization and Q&A will not work on them.

## Acceptance Criteria
- [ ] A logged-in user can upload files in the formats PDF, DOCX, TXT, and MD; all other formats are rejected before storage with a clear German error message naming the supported formats.
- [ ] During upload, the user must choose a scope: "Firmenbibliothek" (shared, visible to all logged-in users) or "Privat" (visible only to the uploader); the chosen scope is shown in the document list.
- [ ] Files larger than the per-file limit (25 MB) are rejected with a German error message stating the limit; the rejected file is not stored.
- [ ] The document list shows for each document: file name, file size, upload date, uploader name, and scope — and only contains shared documents plus the current user's own private documents.
- [ ] A user never sees another user's private documents anywhere in the UI, and cannot access them by direct link/ID either.
- [ ] The uploader of a document can delete it; an admin can delete any document; a member cannot delete documents uploaded by others. Deletion requires a confirmation step and removes the file from the Mac mini's storage.
- [ ] After a successful upload, the system extracts the text content of the document and stores it for later AI features (PROJ-5, PROJ-6).
- [ ] Documents where no text could be extracted (e.g. scanned image-only PDFs) are visibly flagged in the document list with a German notice that AI features are not available for this document; the upload itself still succeeds.
- [ ] All documents and extracted text are stored exclusively on the Mac mini; no upload, storage, or extraction step makes any outbound network call (works fully offline).
- [ ] Upload shows progress feedback and a clear German success confirmation when complete.

## Edge Cases
- **Duplicate filename:** A user uploads a file with a name that already exists in the same scope — both documents are kept as separate entries (the list disambiguates them, e.g. by upload date/uploader); the upload is not silently overwritten and the user is informed that a document with the same name already exists.
- **Image-only scanned PDF:** A PDF contains only scanned images and yields no extractable text — the upload succeeds, but the document is flagged ("Kein Text extrahierbar – KI-Funktionen nicht verfügbar") and excluded from summarization/Q&A selection in later features.
- **Upload interrupted:** The connection drops or the browser is closed mid-upload — no partial/corrupt file appears in the document list; partial data is cleaned up and the user can simply retry.
- **Disk nearly full:** The Mac mini's storage cannot hold the new file — the upload is rejected with a German error message explaining that storage is full, and no partial file remains; admins should be able to recognize the storage problem.
- **Password-protected or corrupt PDF:** A PDF is encrypted or damaged so text extraction fails — the document is stored but flagged as not text-extractable, with a German notice explaining the likely cause (password protection / corrupt file).
- **File extension does not match content:** A file is renamed to a supported extension but its actual content is a different format (e.g. an EXE renamed to .pdf) — the file is rejected based on its actual content with a clear error message, not just accepted by extension.

## Technical Requirements (optional)
- Security: Authentication required for all document operations; scope visibility (shared vs. private) and delete permissions (uploader or admin) enforced on the server, not only in the UI.
- Privacy: 100% local — documents and extracted text never leave the Mac mini; no external APIs, no telemetry (DSGVO compliance).
- Limits: Per-file size limit 25 MB; supported formats PDF, DOCX, TXT, MD.
- Performance: Document list loads in under 1 second for up to ~500 documents; uploads do not block other users' chat requests on the shared Mac mini.
- Language: All UI texts, errors, and confirmations in German (primary), English as secondary.
- Browser Support: Chrome, Firefox, Safari (current versions) on the LAN.

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
