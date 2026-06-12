# PROJ-1: User Accounts & Login (local)

## Status: Planned
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
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
