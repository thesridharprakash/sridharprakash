import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { assertAdminMfa, assertAdminSecret } from "@/lib/adminAuth";
import { createAdminSessionToken, getSessionTtl, SESSION_COOKIE_NAME } from "@/lib/adminSession";

export const runtime = "nodejs";
export const maxDuration = 30;
const ADMIN_COOKIE_DOMAIN = process.env.ADMIN_COOKIE_DOMAIN?.trim() || undefined;

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { secret?: string; otp?: string } | null;

  const secretError = assertAdminSecret("session-create", payload?.secret);
  if (secretError) return secretError;

  const mfaError = assertAdminMfa("session-create", payload?.otp);
  if (mfaError) return mfaError;

  const token = createAdminSessionToken();
  if (!token) {
    adminLog("session-create-failed");
    return NextResponse.json({ error: "Unable to create session." }, { status: 500 });
  }

  adminLog("session-issued");
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: ADMIN_COOKIE_DOMAIN,
    path: "/",
    maxAge: getSessionTtl(),
  });
  return response;
}
