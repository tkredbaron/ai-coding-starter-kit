import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/lib/auth/guards";
import { createUserSchema, normalizeEmail } from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";
import { insertUser, listUsers, loginTaken } from "@/lib/auth/users";
import { toAuthUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** GET /api/admin/users — list all managed users (Admins only). */
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const users = listUsers().map(toAuthUser);
  return NextResponse.json({ users });
}

/** POST /api/admin/users — create a new user (Admins only). */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Ungültige Anfrage.", 400);
  }

  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Ungültige Eingabe.",
      400
    );
  }

  const { displayName, login, password, role } = parsed.data;
  const email = normalizeEmail(parsed.data.email);

  // Uniqueness check covers active AND deactivated accounts.
  const taken = loginTaken(login, email);
  if (taken.username) {
    return jsonError("Dieser Benutzername ist bereits vergeben.", 409);
  }
  if (taken.email) {
    return jsonError("Diese E-Mail-Adresse ist bereits vergeben.", 409);
  }

  const passwordHash = await hashPassword(password);
  const user = insertUser({
    displayName,
    username: login,
    email,
    passwordHash,
    role,
    mustChangePassword: false,
  });

  return NextResponse.json({ user: toAuthUser(user) }, { status: 201 });
}
