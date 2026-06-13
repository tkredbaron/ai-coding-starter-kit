import { NextResponse } from "next/server";
import { getCurrentSession, toAuthUser } from "@/lib/auth/session";
import { anyUserExists } from "@/lib/auth/users";
import type { SessionResponse } from "@/lib/auth-types";

// Auth state is per-request; never cache.
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<SessionResponse>> {
  const session = await getCurrentSession();

  if (session) {
    return NextResponse.json({
      authenticated: true,
      setupRequired: false,
      user: toAuthUser(session.user),
    });
  }

  // No valid session: tell the client whether first-run setup is needed.
  return NextResponse.json({
    authenticated: false,
    setupRequired: !anyUserExists(),
    user: null,
  });
}
