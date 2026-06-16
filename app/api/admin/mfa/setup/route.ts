import { NextResponse } from "next/server";
import { toDataURL } from "qrcode";
import { adminLog } from "@/lib/adminLogger";
import { assertAdminSecret, getAdminMfaSecret } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { secret?: string } | null;
  const secretError = assertAdminSecret("mfa-provision", body?.secret);
  if (secretError) return secretError;

  const secret = getAdminMfaSecret();
  if (!secret) {
    adminLog("mfa-provision-missing-secret");
    return NextResponse.json(
      { error: "Server is not configured for multi-factor authentication." },
      { status: 503 }
    );
  }

  const issuer = process.env.ADMIN_MFA_ISSUER?.trim() || "Sridhar Prakash";
  const account = process.env.ADMIN_MFA_ACCOUNT?.trim() || "admin";
  const label = encodeURIComponent(`${issuer}:${account}`);
  const provisioningUri = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(
    issuer
  )}&digits=6&period=30`;

  try {
    const qrCode = await toDataURL(provisioningUri);
    adminLog("mfa-provision-success");
    return NextResponse.json({
      ok: true,
      secret,
      provisioningUri,
      qrCode,
    });
  } catch (error) {
    adminLog("mfa-provision-error", { error: String(error) });
    return NextResponse.json(
      { error: "Unable to build the authenticator QR code." },
      { status: 500 }
    );
  }
}
