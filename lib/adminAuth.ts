import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { verifyTotp } from "@/lib/totp";

const ADMIN_ARTICLES_SECRET = process.env.ADMIN_ARTICLES_SECRET?.trim() || "";
const RAW_ADMIN_MFA_SECRET = process.env.ADMIN_MFA_SECRET?.trim() || "";
const ADMIN_MFA_SECRET = (() => {
  const cleaned = RAW_ADMIN_MFA_SECRET.replace(/[^A-Z2-7]/gi, "").toUpperCase();
  return cleaned || null;
})();

function errorResponse(
  action: string,
  message: string,
  status: number,
  payload?: Record<string, unknown>
) {
  adminLog(action, payload);
  return NextResponse.json({ error: message }, { status });
}

export function getAdminMfaSecret() {
  return ADMIN_MFA_SECRET;
}

export function assertAdminSecret(action: string, candidate?: string) {
  if (!ADMIN_ARTICLES_SECRET) {
    return errorResponse(
      `${action}-missing-secret`,
      "Server is not configured for article publishing.",
      503
    );
  }

  const trimmed = candidate?.trim() || "";
  if (trimmed !== ADMIN_ARTICLES_SECRET) {
    return errorResponse(`${action}-unauthorized`, "Unauthorized.", 401, {
      provided: Boolean(trimmed),
    });
  }

  return null;
}

export function assertAdminMfa(action: string, token?: string | null) {
  if (!ADMIN_MFA_SECRET) {
    return errorResponse(
      `${action}-mfa-missing-secret`,
      "Server is not configured for multi-factor authentication.",
      503
    );
  }

  if (!verifyTotp(ADMIN_MFA_SECRET, token ?? null)) {
    return errorResponse(`${action}-mfa-invalid`, "Invalid authenticator code.", 401, {
      tokenProvided: Boolean(token?.trim()),
    });
  }

  return null;
}
