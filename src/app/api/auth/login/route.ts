import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/auth/guards";
import { loginSchema } from "@/lib/auth/validation";
import { verifyPassword } from "@/lib/auth/password";
import {
  findByLogin,
  isLocked,
  registerFailedAttempt,
  clearFailedAttempts,
} from "@/lib/auth/users";
import { createSession, toAuthUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// Generic message — never reveals whether the account exists or the password
// was otherwise correct.
const GENERIC_LOGIN_ERROR = "Benutzername oder Passwort ist falsch.";
const LOCKED_ERROR =
  "Zu viele Fehlversuche. Das Konto ist vorübergehend gesperrt. Bitte versuchen Sie es in etwa 15 Minuten erneut.";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Ungültige Anfrage.", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(GENERIC_LOGIN_ERROR, 401);
  }

  const { login, password } = parsed.data;
  const user = findByLogin(login);

  // Unknown user: still return the generic error (no account enumeration).
  if (!user) {
    return jsonError(GENERIC_LOGIN_ERROR, 401);
  }

  // Locked accounts are rejected before checking the password, so a correct
  // password during the lock window is still refused (and gives no hint).
  if (isLocked(user)) {
    return jsonError(LOCKED_ERROR, 423);
  }

  // Deactivated accounts cannot log in (generic message, no hint).
  if (!user.active) {
    return jsonError(GENERIC_LOGIN_ERROR, 401);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    registerFailedAttempt(user);
    // If this attempt just tripped the lock, surface the lock message.
    const willBeLocked = user.failedAttempts + 1 >= 5;
    return jsonError(willBeLocked ? LOCKED_ERROR : GENERIC_LOGIN_ERROR, willBeLocked ? 423 : 401);
  }

  clearFailedAttempts(user.id);
  await createSession(user.id);

  // Re-read so the returned user reflects cleared counters.
  return NextResponse.json({
    user: toAuthUser({ ...user, failedAttempts: 0, lockedUntil: null }),
  });
}
