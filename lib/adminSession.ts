import crypto from "crypto";
import {
  getSessionSecret,
  getSessionTtl as getConfiguredTtl,
  SESSION_COOKIE_NAME,
} from "@/lib/adminSessionConfig";

const SESSION_TTL = getConfiguredTtl();

function signPayload(payload: string) {
  const secret = getSessionSecret();
  return secret
    ? crypto.createHmac("sha256", secret).update(payload).digest("base64url")
    : "";
}

export function createAdminSessionToken() {
  const secret = getSessionSecret();
  if (!secret) return null;

  const payload = JSON.stringify({
    iat: Date.now(),
    nonce: crypto.randomBytes(12).toString("base64url"),
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = signPayload(encoded);
  if (!signature) return null;
  return `${encoded}.${signature}`;
}

export function getSessionTtl() {
  return SESSION_TTL;
}

export { SESSION_COOKIE_NAME };
