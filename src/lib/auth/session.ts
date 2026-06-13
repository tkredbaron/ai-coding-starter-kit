// Server-side session management: create, read, destroy DB-backed sessions
// and the HTTP-only cookie that carries the opaque session id.
import "server-only";
import { randomUUID, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions, users, type UserRow } from "@/lib/db/schema";
import type { AuthUser } from "@/lib/auth-types";

export const SESSION_COOKIE = "kmu_session";

// Default 7-day session lifetime (configurable via env).
const DEFAULT_DAYS = Number(process.env.SESSION_LIFETIME_DAYS ?? 7);
const SESSION_TTL_MS = DEFAULT_DAYS * 24 * 60 * 60 * 1000;

/** Maps a DB row to the public AuthUser contract (never exposes the hash). */
export function toAuthUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    displayName: row.displayName,
    login: row.username,
    email: row.email,
    role: row.role,
    active: row.active,
    mustChangePassword: row.mustChangePassword,
    createdAt: new Date(row.createdAt).toISOString(),
  };
}

/** Creates a session record and sets the HTTP-only cookie. */
export async function createSession(userId: string): Promise<void> {
  // 256-bit opaque token as the session id — unguessable on the LAN.
  const id = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + SESSION_TTL_MS;

  await db.insert(sessions).values({ id, userId, expiresAt });

  const store = await cookies();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    // Secure is omitted on purpose: this runs over plain HTTP on the LAN in
    // this version (HTTPS is handled in the deployment phase). Setting Secure
    // here would break the cookie on http:// and lock everyone out.
    secure: false,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

/** Deletes the current session (DB + cookie). */
export async function destroyCurrentSession(): Promise<void> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (id) {
    await db.delete(sessions).where(eq(sessions.id, id));
  }
  store.delete(SESSION_COOKIE);
}

/** Deletes every session for a user (e.g. after deactivation or pw reset). */
export async function destroyUserSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export interface CurrentSession {
  user: UserRow;
}

/**
 * Resolves the current request's session to the active user, enforcing
 * expiry and deactivation. Expired or invalid sessions are cleaned up.
 * Returns null when there is no valid, active session.
 */
export async function getCurrentSession(): Promise<CurrentSession | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .get();

  if (!session) return null;

  // Expired → drop the record so it can't be reused.
  if (session.expiresAt <= Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  const user = db.select().from(users).where(eq(users.id, session.userId)).get();

  // User gone or deactivated → invalidate immediately (within-1-minute rule).
  if (!user || !user.active) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  return { user };
}
