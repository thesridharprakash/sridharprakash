import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminSessionEdge";

const PUBLIC_ADMIN_PATH = "/admin/login";
const PUBLIC_API_PATHS = new Set(["/api/admin/session", "/api/admin/mfa/setup"]);
const ADMIN_CANONICAL_HOST = process.env.ADMIN_CANONICAL_HOST?.trim().toLowerCase() || "";

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  return await verifyAdminSessionToken(token);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHost = request.headers.get("host")?.trim().toLowerCase() || "";

  if (ADMIN_CANONICAL_HOST && pathname.startsWith("/admin") && requestHost && requestHost !== ADMIN_CANONICAL_HOST) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.host = ADMIN_CANONICAL_HOST;
    return NextResponse.redirect(redirectUrl, 307);
  }

  if (pathname.startsWith("/api/admin")) {
    if (PUBLIC_API_PATHS.has(pathname)) {
      return NextResponse.next();
    }
    if (await hasValidSession(request)) {
      return NextResponse.next();
    }
    return new NextResponse("Authentication required.", { status: 401 });
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === PUBLIC_ADMIN_PATH) {
      return NextResponse.next();
    }
    if (await hasValidSession(request)) {
      return NextResponse.next();
    }
    const loginUrl = new URL(PUBLIC_ADMIN_PATH, request.url);
    const requestedPath = request.nextUrl.pathname + request.nextUrl.search;
    loginUrl.searchParams.set("returnUrl", requestedPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/api/admin/:path*"],
};
