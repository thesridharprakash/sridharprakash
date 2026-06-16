import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTotp } from "@/lib/totp";

const ADMIN_SECRET = process.env.ADMIN_ARTICLES_SECRET?.trim() || "";
const MFA_SECRET = process.env.ADMIN_MFA_SECRET?.trim() || "";
const ALLOWED_IPS = (process.env.ADMIN_ALLOWED_IPS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

function unauthorized() {
  return new NextResponse("Authentication failed.", { status: 401 });
}

function forbidden() {
  return new NextResponse("IP not allowed.", { status: 403 });
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "";
}

function decodePassword(authHeader?: string) {
  if (!authHeader?.startsWith("Basic ")) return "";
  const encoded = authHeader.slice(6);
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const [, password] = decoded.split(":");
  return password || "";
}

export function middleware(request: NextRequest) {
  if (!ADMIN_SECRET) return new NextResponse("Admin secret not configured.", { status: 503 });
  const ip = getClientIp(request);
  if (ALLOWED_IPS.length && !ALLOWED_IPS.includes(ip)) {
    return forbidden();
  }

  const password = decodePassword(request.headers.get("authorization") ?? "");
  if (password !== ADMIN_SECRET) {
    return unauthorized();
  }

  if (MFA_SECRET) {
    const token = request.headers.get("x-admin-otp");
    if (!verifyTotp(MFA_SECRET, token)) {
      return unauthorized();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
