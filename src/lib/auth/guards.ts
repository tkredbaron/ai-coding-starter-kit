// Route guards + standard JSON responses with German error messages.
import "server-only";
import { NextResponse } from "next/server";
import { getCurrentSession, type CurrentSession } from "./session";
import type { UserRow } from "@/lib/db/schema";

/** German error body, mirrors the ApiError shape used by the frontend. */
export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export type GuardResult<T> =
  | { ok: true; value: T }
  | { ok: false; response: NextResponse };

/** Requires any authenticated, active user. */
export async function requireUser(): Promise<GuardResult<CurrentSession>> {
  const session = await getCurrentSession();
  if (!session) {
    return {
      ok: false,
      response: jsonError("Nicht angemeldet. Bitte erneut anmelden.", 401),
    };
  }
  return { ok: true, value: session };
}

/** Requires an authenticated admin. Blocks direct API access by Members. */
export async function requireAdmin(): Promise<GuardResult<{ user: UserRow }>> {
  const session = await getCurrentSession();
  if (!session) {
    return {
      ok: false,
      response: jsonError("Nicht angemeldet. Bitte erneut anmelden.", 401),
    };
  }
  if (session.user.role !== "admin") {
    return {
      ok: false,
      response: jsonError(
        "Kein Zugriff. Diese Funktion ist nur für Administratoren.",
        403
      ),
    };
  }
  return { ok: true, value: { user: session.user } };
}
