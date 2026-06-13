import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAdmin, jsonError } from "@/lib/auth/guards";
import { updateUserSchema } from "@/lib/auth/validation";
import { findById, isLastActiveAdmin } from "@/lib/auth/users";
import { destroyUserSessions, toAuthUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const LAST_ADMIN_MSG =
  "Dies ist der letzte aktive Administrator. Aktion nicht möglich, sonst könnte niemand mehr Benutzer verwalten.";

/** PATCH /api/admin/users/:id — change active flag and/or role (Admins only). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const target = findById(id);
  if (!target) {
    return jsonError("Benutzer wurde nicht gefunden.", 404);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Ungültige Anfrage.", 400);
  }

  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Ungültige Eingabe.",
      400
    );
  }

  const { active, role } = parsed.data;

  // Last-admin protection: block deactivating or demoting the only admin.
  const deactivating = active === false;
  const demoting = role === "member";
  if ((deactivating || demoting) && isLastActiveAdmin(target)) {
    return jsonError(LAST_ADMIN_MSG, 409);
  }

  const updates: Partial<typeof users.$inferInsert> = {};
  if (active !== undefined) updates.active = active;
  if (role !== undefined) updates.role = role;

  db.update(users).set(updates).where(eq(users.id, id)).run();

  // Deactivation: drop all of the user's sessions so they lose access at once.
  if (deactivating) {
    await destroyUserSessions(id);
  }

  const updated = findById(id)!;
  return NextResponse.json({ user: toAuthUser(updated) });
}
