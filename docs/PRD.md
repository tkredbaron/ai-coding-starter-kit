# Product Requirements Document

## Vision
A **100% local AI assistant for German KMU** (small and medium-sized businesses) that runs entirely on a Mac mini M4 (16 GB RAM) using a local LLM via Ollama. It gives small teams the everyday productivity of ChatGPT-style tools — German business writing, document summarization, data extraction, and Q&A over company documents — **without any data ever leaving the company**. Full DSGVO/GDPR compliance by design: no cloud services, no external APIs, no telemetry.

## Target Users
- **KMU owners and managing directors** who want AI productivity but cannot or will not send customer data, contracts, or internal documents to US cloud providers (DSGVO concerns, NDAs, works council requirements).
- **Office and back-office staff** who write many German business emails, offers (Angebote), and letters daily and need help drafting them in a professional tone.
- **Knowledge workers in the team** who need fast answers from internal documents (manuals, contracts, policies) without manually searching through PDFs.

**Pain points addressed:** cloud AI tools are a DSGVO/compliance risk; manual business correspondence is slow; information is buried in PDFs; existing local AI tools are too technical for non-developers.

## Core Features (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| P0 (MVP) | PROJ-1: User Accounts & Login (local) | Planned |
| P0 (MVP) | PROJ-2: AI Chat Assistant (local LLM) | Planned |
| P0 (MVP) | PROJ-3: German Business Writing Assistant | Planned |
| P1 | PROJ-4: Document Upload & Management | Planned |
| P1 | PROJ-5: Document Summarization & Extraction | Planned |
| P1 | PROJ-6: Document Q&A (RAG) | Planned |

## Success Metrics
- All team members can log in and use the assistant from their own computer via the local network.
- First token of a chat answer appears in under 5 seconds for a single active request; under load, requests queue with visible feedback instead of failing.
- 80% of business-writing drafts are usable with only minor edits (user feedback).
- Document Q&A answers cite the correct source document/passage.
- Zero outbound network calls containing user content (verifiable: works fully offline).

## Constraints
- **Hardware:** Single Mac mini M4 with 16 GB unified memory — model size limited to ~7–8B parameter quantized models (e.g. Llama 3.1 8B, Qwen 2.5 7B via Ollama). RAM budget must also cover the embedding model for document Q&A.
- **Concurrency:** Realistically 1–2 parallel LLM generations; additional requests are queued. 16 GB supports ~3–4 simultaneously active users, even though up to 15 may have accounts.
- **Context limits:** ~4–8K tokens of usable context — long documents must be processed in chunks; document and library size limits apply (see PROJ-4/5/6).
- **Privacy:** 100% local operation. No cloud services of any kind (no cloud Supabase, no external APIs, no analytics). All data stored on the Mac mini. "Zero outbound calls" must be verifiable (app works fully offline).
- **DSGVO obligations (local ≠ exempt):** per-user deletion of chat history and documents, configurable retention, and admin-driven export/erasure of a user's data (Art. 15/17). Disk encryption (FileVault) and automated local backups are required operational measures (Art. 32).
- **Operations:** A named admin owns the Mac mini: backups, OS/Ollama/model updates, user management. The Mac mini is a single point of failure — backup strategy is mandatory before team rollout.
- **LLM runtime:** Ollama on macOS.
- **Team size:** Small KMU team (roughly 2–15 users) on the local network.
- **Language:** Primary UI and output language is German; English supported as secondary.

## Non-Goals
- No cloud deployment, no Vercel hosting, no internet-facing access (LAN only in this version).
- No mobile apps (responsive web UI only).
- No fine-tuning or training of custom models — only off-the-shelf local models.
- No integrations with external systems (email servers, DATEV, CRM) in this version.
- No image generation or voice features.
- No OCR for scanned image-only PDFs in this version — such documents are flagged as "no extractable text" (see PROJ-4).
- No multi-tenant / multi-company support — one installation per company.

---

Use `/requirements` to create detailed feature specifications for each item in the roadmap above.
