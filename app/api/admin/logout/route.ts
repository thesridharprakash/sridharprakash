import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/adminSessionConfig";

export const runtime = "nodejs";
const ADMIN_COOKIE_DOMAIN = process.env.ADMIN_COOKIE_DOMAIN?.trim() || undefined;

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: ADMIN_COOKIE_DOMAIN,
    path: "/",
    maxAge: 0,
  });
  return response;
}
