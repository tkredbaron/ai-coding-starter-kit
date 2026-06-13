// SQLite connection + schema bootstrap for the local app database.
// Single file on the Mac mini (default: data/app.db). Backup = copy this file.

import "server-only";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Configurable location, but defaults to a local file inside the project.
// No secrets here — just a filesystem path on the local machine.
const DB_PATH =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db");

function createConnection() {
  const dir = path.dirname(DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(DB_PATH);
  // WAL improves concurrency for several simultaneous LAN sessions.
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  // Lightweight, idempotent schema bootstrap. The app owns a single local DB
  // and only PROJ-1 tables exist; running this on every cold start keeps the
  // install zero-touch (no separate migration step for the admin to run).
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      username TEXT NOT NULL,
      email TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      active INTEGER NOT NULL DEFAULT 1,
      must_change_password INTEGER NOT NULL DEFAULT 0,
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      locked_until INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique
      ON users (lower(username));
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique
      ON users (lower(email)) WHERE email IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    CREATE INDEX IF NOT EXISTS idx_users_role_active ON users (role, active);

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);
  `);

  return drizzle(sqlite, { schema });
}

// Reuse a single connection across hot reloads in dev (Next.js).
const globalForDb = globalThis as unknown as {
  __appDb?: ReturnType<typeof createConnection>;
};

export const db = globalForDb.__appDb ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__appDb = db;
}

export { schema };
