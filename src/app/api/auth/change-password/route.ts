import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireUser, jsonError } from "@/lib/auth/guards";
import { changePasswordSchema } from "@/lib/auth/validation";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export const dynamic = "force-dynamic";

/** Lets a logged-in user change their own password (current pw required). */
export async function POST(req: NextRequest) {
  const guard = await requireUser();
  if (!guard.ok) return guard.response;
  const { user } = guard.value;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Ungültige Anfrage.", 400);
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Ungültige Eingabe.",
      400
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  const currentValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!currentValid) {
    return jsonError("Das aktuelle Passwort ist falsch.", 400);
  }

  if (newPassword === currentPassword) {
    return jsonError(
      "Das neue Passwort muss sich vom aktuellen unterscheiden.",
      400
    );
  }

  const passwordHash = await hashPassword(newPassword);
  db.update(users)
    .set({ passwordHash, mustChangePassword: false })
    .where(eq(users.id, user.id))
    .run();

  // Current session stays valid — the user just proved their identity.
  return NextResponse.json({ ok: true });
}
