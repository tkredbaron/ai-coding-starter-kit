// Drizzle schema for the local SQLite database (PROJ-1).
// All account data lives on the Mac mini — no cloud, no external services.

import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

/**
 * Users — local accounts managed by an admin (no public self-signup).
 * Passwords are stored only as a bcrypt hash, never in plain text.
 */
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    displayName: text("display_name").notNull(),
    /** Username used to log in. Unique (case-insensitive, enforced in app + index). */
    username: text("username").notNull(),
    /** Optional email; also usable to log in. Unique when present. */
    email: text("email"),
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: ["admin", "member"] })
      .notNull()
      .default("member"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    /** Forces a password change at next login (after an admin reset). */
    mustChangePassword: integer("must_change_password", { mode: "boolean" })
      .notNull()
      .default(false),
    /** Consecutive failed login attempts since the last success. */
    failedAttempts: integer("failed_attempts").notNull().default(0),
    /** Unix epoch (ms) until which the account is locked, or null. */
    lockedUntil: integer("locked_until"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => ({
    // Lowercased uniqueness is enforced in application code; these indexes
    // accelerate the login lookup by username / email.
    usernameIdx: index("idx_users_username").on(table.username),
    emailIdx: index("idx_users_email").on(table.email),
    roleActiveIdx: index("idx_users_role_active").on(table.role, table.active),
  })
);

/**
 * Sessions — server-side session records. The browser only holds an
 * HTTP-only cookie with the opaque session id. Keeping sessions in the DB
 * lets an admin deactivation take effect on the very next request.
 */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Unix epoch (ms) when the session expires. */
    expiresAt: integer("expires_at").notNull(),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => ({
    userIdIdx: index("idx_sessions_user_id").on(table.userId),
    expiresAtIdx: index("idx_sessions_expires_at").on(table.expiresAt),
  })
);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type SessionRow = typeof sessions.$inferSelect;
