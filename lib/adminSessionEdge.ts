import { getSessionSecret, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "@/lib/adminSessionConfig";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function base64UrlEncode(buffer: ArrayBuffer) {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(buffer).toString("base64")
      : btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(padded, "base64"));
  }
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

let cachedKey: CryptoKey | null = null;

async function getCryptoKey(secret: string) {
  if (cachedKey) return cachedKey;
  cachedKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return cachedKey;
}

async function computeSignature(payload: string) {
  const secret = getSessionSecret();
  if (!secret) return "";
  const key = await getCryptoKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(payload));
  return base64UrlEncode(signature);
}

async function verifySignature(encoded: string, signature: string) {
  const expected = await computeSignature(encoded);
  if (!expected) return false;
  return timingSafeEqual(expected, signature);
}

export async function verifyAdminSessionToken(token?: string | null) {
  const secret = getSessionSecret();
  if (!secret || !token) return false;

  const [encoded, signature] = token.split(".", 2);
  if (!encoded || !signature) return false;
  if (!(await verifySignature(encoded, signature))) return false;

  try {
    const payloadBytes = base64UrlDecode(encoded);
    const payloadText = textDecoder.decode(payloadBytes);
    const payload = JSON.parse(payloadText);
    if (typeof payload.iat !== "number") return false;
    const ageMs = Date.now() - payload.iat;
    if (ageMs > SESSION_TTL_SECONDS * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE_NAME };
