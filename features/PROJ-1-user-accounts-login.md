# PROJ-1: User Accounts & Login (local)

## Status: In Progress
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- None

## Overview
Local user accounts for a small KMU team (2–15 people), stored entirely on the company's Mac mini. The system runs offline on the LAN, so there is no self-signup and no email verification or email-based password reset. An administrator creates and manages all accounts. Two roles exist: **Admin** and **Member**. The UI is in German (e.g. "Anmelden", "Abmelden", "Passwort ändern", "Benutzerverwaltung").

## User Stories
- As an **Admin**, I want to create user accounts for my team members (name, username/email, initial password, role) so that each colleague has their own login without needing internet access or email verification.
- As a **team member (Member)**, I want to log in with my username or email and password so that my chats and documents are tied to my own account and not visible to colleagues by default.
- As a **logged-in user**, I want my session to persist (stay signed in) until I explicitly log out or the session expires, so that I don't have to re-enter my password every time I open the assistant during the workday.
- As a **user**, I want to change my own password (by confirming my current password first) so that I can keep my account secure without involving the admin.
- As an **Admin**, I want to reset a user's password to a new temporary one (handed over in person, since there is no email) so that a colleague who forgot their password can regain access; the user must then set a new password at next login.
- As an **Admin**, I want to deactivate (and reactivate) user accounts so that former employees immediately lose access while their data is preserved, instead of deleting the account.

## Acceptance Criteria
- [ ] On first launch of a fresh installation, the system guides through creating the initial Admin account (one-time setup); afterwards this setup is no longer accessible.
- [ ] An Admin can create a new user with display name, unique username and/or email, initial password, and role (Admin or Member); the new user can log in immediately.
- [ ] There is no public self-signup: no registration page is reachable for non-admins, and account creation is only possible for logged-in Admins.
- [ ] A user can log in with username or email plus password; on success they land on the app's start page, on failure they see a generic German error message ("Benutzername oder Passwort ist falsch") that does not reveal whether the account exists.
- [ ] A logged-in user stays signed in across browser restarts via a session, until they log out or the session expires (configurable lifetime, default e.g. 7 days); "Abmelden" ends the session immediately.
- [ ] A logged-in user can change their own password by entering the current password and the new password twice; on mismatch or wrong current password the change is rejected with a clear German message.
- [ ] Passwords must meet a minimum policy (at least 8 characters) and are never stored or displayed in plain text anywhere in the system.
- [ ] An Admin can reset any user's password to a temporary password without email; the affected user is forced to set a new password at their next login.
- [ ] An Admin can deactivate a user account; the deactivated user can no longer log in and any active sessions of that user become invalid within at most 1 minute. The Admin can reactivate the account later.
- [ ] Only Admins can access the user management area ("Benutzerverwaltung"); a Member who tries to open it (including via direct URL) is denied with a German notice.
- [ ] After 5 consecutive failed login attempts for an account, further attempts for that account are temporarily blocked (e.g. 15 minutes), with a German message indicating the temporary lock.
- [ ] All login, logout, and account-management functions work fully offline (no outbound network calls) — verifiable with the Mac mini disconnected from the internet.

## Edge Cases
- **Repeated wrong passwords:** After the temporary lockout is triggered, even a correct password is rejected until the lock expires; an Admin can lift the lock early via password reset. The lockout message must not reveal whether the password was otherwise correct.
- **Deactivating or demoting the last Admin:** The system must prevent deactivating, deleting, or changing the role of the last remaining active Admin account, with a clear German explanation — otherwise nobody could manage users anymore.
- **Deactivated user with an active session:** A user who is deactivated while logged in is logged out on their next request/page interaction (within at most 1 minute) and sees a message that the account was deactivated; in-progress work is not silently attributed to a "ghost" session.
- **Two users with the same name:** Display names may repeat (two "Thomas Müller"), but usernames/emails must be unique; account creation with an already-taken username/email is rejected with a German message, including when the existing account is deactivated.
- **Admin resets their own password / forgotten Admin password:** An Admin can reset their own password like any user's. If the *only* Admin forgets their password, a documented local recovery procedure on the Mac mini itself (physical access required) must exist, since no email reset is possible.
- **Temporary password never used:** If a user whose password was reset does not log in, the old session(s) remain invalid and the temporary password stays valid until used or reset again; logging in with the old (pre-reset) password must fail.
- **Session expiry mid-use:** When a session expires while the user has the app open, the next action redirects to the login page with a German notice ("Sitzung abgelaufen, bitte erneut anmelden") instead of failing silently or losing the context of what they were doing without warning.

## Technical Requirements (optional)
- **Privacy/DSGVO:** All account data (names, credentials, sessions) is stored exclusively on the local Mac mini; no cloud services, no external identity providers, no telemetry.
- **Offline:** All authentication flows must function without internet connectivity (LAN only).
- **Security:** Passwords stored only as salted hashes; sessions protected against takeover on the LAN; generic error messages on login failure.
- **Performance:** Login and session check should feel instant (< 500 ms on the Mac mini M4) and must not compete noticeably with LLM workloads.
- **Capacity:** Support 2–15 user accounts with several concurrent sessions.
- **Language:** All user-facing texts in German (primary), English as secondary.
- **Browser Support:** Current Chrome, Firefox, Safari, Edge on desktop within the LAN.

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
**Designed:** 2026-06-12

### Big Picture
Everything runs inside the Next.js app on the Mac mini. There is no cloud and no separate auth service: the app itself checks passwords and manages sessions, and stores all account data in a single local database file (SQLite) on the Mac mini. The Ollama LLM is a separate local program on the same machine; it is **not** involved in login at all — authentication stays fast even when the LLM is busy.

> **Why not Supabase?** The starter kit's default (cloud Supabase) is excluded by our 100%-local rule. Self-hosting Supabase in Docker would cost 2–4 GB of RAM permanently — RAM the LLM needs. SQLite is one file, needs zero administration, handles 15 users effortlessly, and makes backups trivial (copy one file).

### Component Structure
```
App
+-- First-Run Setup Page ("Ersteinrichtung")     – only when no admin exists yet
|   +-- Create Initial Admin Form
+-- Login Page ("Anmelden")
|   +-- Login Form (username/email + password)
|   +-- Lockout / error notices (German)
+-- App Shell (everything behind login)
|   +-- Sidebar with user menu
|       +-- "Passwort ändern" Dialog
|       +-- "Abmelden" Button
+-- Admin Area ("Benutzerverwaltung")            – Admins only
    +-- User Table (name, login, role, status)
    +-- "Benutzer anlegen" Dialog
    +-- Per-User Actions (reset password, deactivate/reactivate, change role)
    +-- "Last admin" protection notices
```
All forms reuse existing shadcn/ui components (form, input, dialog, table, alert, toast) — nothing custom is built.

### Data Model (plain language)
Stored in one local SQLite database file on the Mac mini (e.g. `data/app.db`):

- **User:** display name, unique username and/or email, password (only as a salted hash — never readable), role (Admin/Member), active flag, "must change password at next login" flag, failed-login counter + lock-until timestamp, created date.
- **Session:** random session ID, which user it belongs to, expiry date (default 7 days), created date. The browser holds only an unreadable, HTTP-only cookie with the session ID.

Sessions live in the database (not just in the cookie) on purpose: when an admin deactivates a user, the very next request looks up the session, sees the user is inactive, and rejects it — that's how "logged out within 1 minute" is guaranteed.

### How Login Works (in words)
1. User submits username + password → app finds the account, compares against the stored hash.
2. Wrong 5 times → account is locked for 15 minutes (generic German message, no hints).
3. Correct → app creates a session record and sets the cookie; every later page request is checked against that session (fast: < a few ms in SQLite, independent of LLM load).
4. "Abmelden" or admin deactivation deletes/invalidates the session record.
5. Forgotten admin password → documented recovery: a small command run directly on the Mac mini (physical access) resets the admin password. No email needed.

### Tech Decisions (why)
| Decision | Choice | Why |
|---|---|---|
| Database | SQLite (single local file) | Zero admin, ~0 RAM overhead, perfect for 2–15 users, backup = copy one file. Also becomes the home for chats/documents in PROJ-2+. |
| Auth approach | Own session-based login built into Next.js | No external identity provider allowed (offline). Industry-standard pattern: hashed passwords + database sessions + HTTP-only cookie. |
| Password storage | Salted hashing (bcrypt) | Never stores readable passwords; tuned to stay well under the 500 ms login budget on the M4. |
| Roles | Simple role field (Admin/Member) checked on the server for every admin action and the admin pages | Direct URL access by Members is blocked server-side, not just hidden in the UI. |
| Ollama | Not involved in this feature | LLM connection is designed in PROJ-2; login must never wait on the LLM. |
| Cloud Supabase client (`src/lib/supabase.ts`) | Will be removed/unused | Violates the 100%-local constraint; SQLite replaces it. |

### Dependencies (new packages)
- `better-sqlite3` — the local database engine
- `drizzle-orm` — typed, readable access to the database
- `bcryptjs` — password hashing
- `zod` + `react-hook-form` — already installed; used for form validation

### Out of Scope (later features)
- HTTPS on the LAN and backup automation → handled in the deployment phase (PRD operations requirements).
- Chat/document data models → PROJ-2 and PROJ-4.

## Frontend Implementation (Frontend Developer)
**Implemented:** 2026-06-12 — UI layer only; backend APIs (SQLite, sessions, hashing) are built in `/backend`.

### What was built
German UI for all PROJ-1 flows, composed entirely from existing shadcn/ui primitives (no custom UI widgets reinvented):

- **First-run setup (`Ersteinrichtung`)** — `src/components/auth/setup-form.tsx`. Creates the initial Admin (Anzeigename, Benutzername, optional E-Mail, Passwort + Wiederholung, min. 8 chars). Shown only when the session check reports `setupRequired`.
- **Login (`Anmelden`)** — `src/components/auth/login-form.tsx`. Username/email + password; generic German error on failure ("Benutzername oder Passwort ist falsch."); supports server-provided lockout/lock messages via the API error body. Password field is cleared on failure.
- **Forced password change** — the change-password dialog runs in `forced` mode (non-dismissible) when the logged-in user has `mustChangePassword` (after an admin reset).
- **Passwort ändern dialog** — `src/components/auth/change-password-dialog.tsx`. Current + new + confirm, mismatch/new-equals-current validation; toast on success.
- **App shell** — `src/components/app-shell.tsx`. Responsive sidebar (desktop) / Sheet (mobile), user menu with avatar initials, role badge, "Passwort ändern" and "Abmelden". Admin-only "Benutzerverwaltung" nav item.
- **Benutzerverwaltung (Admins only)** — `src/components/admin/user-management.tsx`: user table (name, login, role, status) with loading skeletons, empty and error states; per-user dropdown actions (reset password, change role, deactivate/reactivate) with confirm dialogs for destructive/irreversible changes.
  - **Benutzer anlegen** — `src/components/admin/create-user-dialog.tsx`.
  - **Passwort zurücksetzen** — `src/components/admin/reset-password-dialog.tsx`: confirms, then shows the generated temporary password once with copy-to-clipboard for in-person handover.
  - **Last-admin protection** mirrored in the UI (disabled actions + explanatory note); server still enforces it.

### Supporting files
- `src/lib/auth-types.ts` — shared types / API contract (`AuthUser`, `SessionResponse`, roles).
- `src/lib/api-client.ts` — same-origin JSON fetch helper; surfaces server German error messages, never calls external origins.
- `src/hooks/use-session.ts` — loads `GET /api/auth/session` (drives setup vs. login vs. app gating; re-fetch enables the "deactivated/expired within ~1 min" behavior on next interaction).
- `src/hooks/use-users.ts` — loads `GET /api/admin/users`.
- `src/app/page.tsx` — orchestrates setup → login → forced-change → app shell (chat placeholder / admin).
- `src/app/layout.tsx` — `lang="de"`, sonner `<Toaster />` mounted.
- `src/components/ui/dialog.tsx` — extended `DialogContent` with an optional `showCloseButton` prop (default true; used to make the forced password dialog non-dismissible). Backward compatible.

### API contract expected from `/backend`
- `GET /api/auth/session` → `{ authenticated, setupRequired, user }`
- `POST /api/auth/setup` → `{ user }` (initial admin)
- `POST /api/auth/login` `{ login, password }` → `{ user }`; German error in `{ error }` on failure/lockout
- `POST /api/auth/logout`
- `POST /api/auth/change-password` `{ currentPassword, newPassword }`
- `GET /api/admin/users` → `{ users }`
- `POST /api/admin/users` `{ displayName, login, email, password, role }`
- `PATCH /api/admin/users/:id` `{ active?, role? }`
- `POST /api/admin/users/:id/reset-password` → `{ temporaryPassword }`

### Notes / deviations
- Server-side enforcement of role gating, last-admin protection, lockout, and session validity is **required** in `/backend`; the UI mirrors these for UX but is not the security boundary (Members are redirected client-side, but direct API access must be blocked server-side).
- Chat view is a placeholder (PROJ-2).
- Verified with `tsc --noEmit` (clean) and `next build` (success). Note: the template has no ESLint flat config yet, so `next lint`/`eslint` cannot run — a project setup gap unrelated to this feature.

## Backend Implementation (Backend Developer)
**Implemented:** 2026-06-13 — 100% local, no Supabase, no cloud, no external calls.

### Stack & storage
- **Database:** SQLite via `better-sqlite3` + `drizzle-orm`, single local file (default `data/app.db`, override with `DATABASE_PATH`). WAL mode + `foreign_keys = ON`. Schema is bootstrapped idempotently on cold start (`CREATE TABLE IF NOT EXISTS`), so the admin runs no migration step. `data/` is gitignored (contains credentials).
- **Password hashing:** `bcryptjs`, 10 rounds (secure, well under the 500 ms login budget on the M4). Plaintext is never stored or returned (except the one-time temporary password on admin reset, by design).
- **Sessions:** DB-backed (`sessions` table) with an opaque 256-bit token carried in an **HTTP-only**, `SameSite=lax` cookie (`kmu_session`), default 7-day lifetime (`SESSION_LIFETIME_DAYS`). `Secure` is intentionally off because this version runs over plain HTTP on the LAN (HTTPS is a deployment-phase concern); enabling it would lock everyone out. Every request re-validates the session against the DB, so an admin deactivation or session expiry takes effect on the very next request (the "within 1 minute" rule).

### Data model
- `users`: id, display_name, username (unique, case-insensitive), email (optional, unique when present), password_hash, role (admin/member), active, must_change_password, failed_attempts, locked_until, created_at. Unique indexes on `lower(username)` and `lower(email)`; helper indexes on username/email and (role, active).
- `sessions`: id, user_id (FK → users ON DELETE CASCADE), expires_at, created_at. Indexes on user_id and expires_at.

### API routes (match the frontend contract exactly)
- `GET  /api/auth/session` → `{ authenticated, setupRequired, user }`
- `POST /api/auth/setup` → creates initial admin + logs in; 409 once setup is done
- `POST /api/auth/login` → `{ user }`; generic German error; account lockout after 5 failed attempts for 15 min (correct password still rejected during lock)
- `POST /api/auth/logout` → ends session (DB + cookie)
- `POST /api/auth/change-password` → requires current password; clears `mustChangePassword`
- `GET  /api/admin/users` (admin) → `{ users }`
- `POST /api/admin/users` (admin) → create user; 409 on duplicate username/email (incl. deactivated)
- `PATCH /api/admin/users/:id` (admin) → `{ active?, role? }`; last-admin protection; deactivation drops the user's sessions
- `POST /api/admin/users/:id/reset-password` (admin) → `{ temporaryPassword }`; forces change at next login, clears lock, invalidates sessions

### Security enforcement (server-side, not just UI)
- All Zod validation runs server-side (`src/lib/auth/validation.ts`); client validation is not trusted.
- Role gating via `requireAdmin` guard — Members hitting admin endpoints directly get 403; unauthenticated get 401.
- Generic login error never reveals account existence; lockout message gives no hint whether the password was otherwise correct.
- Last-admin protection blocks deactivating or demoting the only active admin (409).
- Min password length 8 enforced everywhere.

### Forgotten-admin recovery (offline, physical access)
- `scripts/reset-admin-password.mjs` (also `npm run reset-admin <login> <new-password>`): run directly on the Mac mini to reset/reactivate/promote an admin and force a password change at next login. No email needed.

### Security headers
- `next.config.ts` adds X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: origin-when-cross-origin. `serverExternalPackages: ["better-sqlite3"]` keeps the native module out of the bundle.

### Verification
- `tsc --noEmit` clean; `next build` succeeds (all 9 API routes present as dynamic).
- Manual end-to-end smoke test against the running server passed for: first-run setup + re-setup 409, login success/failure, 5-attempt lockout + correct-password-during-lock rejection, admin create + duplicate-username/email 409, member 403 on admin endpoints, unauth 401, admin password reset → forced change flow, last-admin deactivate/demote 409, deactivation invalidating an active session, logout, recovery CLI, and HttpOnly cookie + security headers.

### Notes / deviations
- The dormant `src/lib/supabase.ts` placeholder is left untouched (already a no-op `export const supabase = null`); it is unused and violates nothing at runtime. SQLite fully replaces it per the tech design.
- `.env.local.example` updated: no cloud secrets; documents optional `DATABASE_PATH` and `SESSION_LIFETIME_DAYS`.

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
