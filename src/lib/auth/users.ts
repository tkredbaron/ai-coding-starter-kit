// User data access: lookup, lockout bookkeeping, and last-admin protection.
import "server-only";
import { randomUUID } from "node:crypto";
import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, type UserRow, type NewUserRow } from "@/lib/db/schema";

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

/** Finds a user by username OR email (case-insensitive). */
export function findByLogin(login: string): UserRow | undefined {
  const needle = login.trim().toLowerCase();
  return db
    .select()
    .from(users)
    .where(
      sql`lower(${users.username}) = ${needle} OR lower(${users.email}) = ${needle}`
    )
    .get();
}

export function findById(id: string): UserRow | undefined {
  return db.select().from(users).where(eq(users.id, id)).get();
}

/** True if username or email already taken (case-insensitive), incl. inactive. */
export function loginTaken(
  username: string,
  email: string | null,
  excludeId?: string
): { username: boolean; email: boolean } {
  const u = username.trim().toLowerCase();
  const rows = db.select().from(users).all();
  const result = { username: false, email: false };
  for (const row of rows) {
    if (excludeId && row.id === excludeId) continue;
    if (row.username.toLowerCase() === u) result.username = true;
    if (email && row.email && row.email.toLowerCase() === email.toLowerCase()) {
      result.email = true;
    }
  }
  return result;
}

export function countActiveAdmins(): number {
  const row = db
    .select({ c: sql<number>`count(*)` })
    .from(users)
    .where(and(eq(users.role, "admin"), eq(users.active, true)))
    .get();
  return row?.c ?? 0;
}

/** True if removing/demoting/deactivating this user would drop the last admin. */
export function isLastActiveAdmin(user: UserRow): boolean {
  if (user.role !== "admin" || !user.active) return false;
  return countActiveAdmins() <= 1;
}

export function anyUserExists(): boolean {
  const row = db.select({ c: sql<number>`count(*)` }).from(users).get();
  return (row?.c ?? 0) > 0;
}

export function isLocked(user: UserRow): boolean {
  return user.lockedUntil != null && user.lockedUntil > Date.now();
}

/** Records a failed attempt and locks the account after the threshold. */
export function registerFailedAttempt(user: UserRow): void {
  const attempts = user.failedAttempts + 1;
  const lockedUntil =
    attempts >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCKOUT_MS : user.lockedUntil;
  db.update(users)
    .set({ failedAttempts: attempts, lockedUntil })
    .where(eq(users.id, user.id))
    .run();
}

/** Clears failed-attempt counters after a successful login. */
export function clearFailedAttempts(userId: string): void {
  db.update(users)
    .set({ failedAttempts: 0, lockedUntil: null })
    .where(eq(users.id, userId))
    .run();
}

export interface CreateUserInput {
  displayName: string;
  username: string;
  email: string | null;
  passwordHash: string;
  role: "admin" | "member";
  mustChangePassword?: boolean;
}

export function insertUser(input: CreateUserInput): UserRow {
  const row: NewUserRow = {
    id: randomUUID(),
    displayName: input.displayName,
    username: input.username,
    email: input.email,
    passwordHash: input.passwordHash,
    role: input.role,
    active: true,
    mustChangePassword: input.mustChangePassword ?? false,
    failedAttempts: 0,
    lockedUntil: null,
  };
  db.insert(users).values(row).run();
  return db.select().from(users).where(eq(users.id, row.id)).get()!;
}

export function listUsers(): UserRow[] {
  return db
    .select()
    .from(users)
    .orderBy(users.createdAt)
    .limit(500)
    .all();
}

export { eq, ne };
