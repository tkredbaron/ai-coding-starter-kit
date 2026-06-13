import { NextResponse } from "next/server";
import { destroyCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** Ends the current session immediately (DB record + cookie). */
export async function POST() {
  await destroyCurrentSession();
  return NextResponse.json({ ok: true });
}
