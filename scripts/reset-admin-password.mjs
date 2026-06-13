#!/usr/bin/env node
// Local recovery: reset an admin's password directly on the Mac mini.
//
// Use when the only admin has forgotten their password (no email reset exists).
// Requires physical/SSH access to the machine running the app.
//
// Usage:
//   node scripts/reset-admin-password.mjs <username-or-email> <new-password>
//
// The target account is reactivated, unlocked, promoted to admin if needed,
// and flagged to change the password at next login.

import path from "node:path";
import process from "node:process";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const [, , login, newPassword] = process.argv;

if (!login || !newPassword) {
  console.error(
    "Verwendung: node scripts/reset-admin-password.mjs <benutzername-oder-email> <neues-passwort>"
  );
  process.exit(1);
}

if (newPassword.length < 8) {
  console.error("Das Passwort muss mindestens 8 Zeichen lang sein.");
  process.exit(1);
}

const dbPath =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db");

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

const needle = login.trim().toLowerCase();
const user = db
  .prepare(
    "SELECT * FROM users WHERE lower(username) = ? OR lower(email) = ?"
  )
  .get(needle, needle);

if (!user) {
  console.error(`Kein Benutzer mit "${login}" gefunden.`);
  process.exit(1);
}

const hash = bcrypt.hashSync(newPassword, 10);

db.prepare(
  `UPDATE users
     SET password_hash = ?,
         role = 'admin',
         active = 1,
         must_change_password = 1,
         failed_attempts = 0,
         locked_until = NULL
   WHERE id = ?`
).run(hash, user.id);

// Invalidate that user's existing sessions.
db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);

console.log(
  `Passwort für "${user.display_name}" (${user.username}) wurde zurückgesetzt.`
);
console.log(
  "Der Benutzer ist nun Administrator, aktiv und muss das Passwort bei der nächsten Anmeldung ändern."
);
