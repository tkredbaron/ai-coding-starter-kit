import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/auth/guards";
import { setupSchema, normalizeEmail } from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";
import { anyUserExists, insertUser } from "@/lib/auth/users";
import { createSession, toAuthUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** One-time first-run setup: creates the initial Admin and logs them in. */
export async function POST(req: NextRequest) {
  // Setup is only available while no account exists yet.
  if (anyUserExists()) {
    return jsonError(
      "Die Ersteinrichtung ist bereits abgeschlossen.",
      409
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Ungültige Anfrage.", 400);
  }

  const parsed = setupSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Ungültige Eingabe.",
      400
    );
  }

  const { displayName, login, password } = parsed.data;
  const email = normalizeEmail(parsed.data.email);

  const passwordHash = await hashPassword(password);
  const user = insertUser({
    displayName,
    username: login,
    email,
    passwordHash,
    role: "admin",
    mustChangePassword: false,
  });

  await createSession(user.id);
  return NextResponse.json({ user: toAuthUser(user) }, { status: 201 });
}
