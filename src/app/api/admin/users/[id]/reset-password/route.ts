import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAdmin, jsonError } from "@/lib/auth/guards";
import {
  hashPassword,
  generateTemporaryPassword,
} from "@/lib/auth/password";
import { findById } from "@/lib/auth/users";
import { destroyUserSessions } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/users/:id/reset-password — sets a temporary password,
 * forces a change at next login, and clears any lock + active sessions.
 * The plaintext temp password is returned ONCE for in-person handover.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const target = findById(id);
  if (!target) {
    return jsonError("Benutzer wurde nicht gefunden.", 404);
  }

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  db.update(users)
    .set({
      passwordHash,
      mustChangePassword: true,
      // Resetting lifts any lockout and clears failed attempts.
      failedAttempts: 0,
      lockedUntil: null,
    })
    .where(eq(users.id, id))
    .run();

  // Old sessions become invalid; the user must log in with the temp password.
  await destroyUserSessions(id);

  return NextResponse.json({ temporaryPassword });
}
