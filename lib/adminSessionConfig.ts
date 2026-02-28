const SESSION_SECRET_RAW = process.env.ADMIN_SESSION_SECRET?.trim() || "";
const FALLBACK_SECRET = process.env.ADMIN_ARTICLES_SECRET?.trim() || "";
const SESSION_SECRET = SESSION_SECRET_RAW || FALLBACK_SECRET;
const SESSION_TTL = Number(process.env.ADMIN_SESSION_TTL || 3600);

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_TTL_SECONDS = SESSION_TTL;

export function getSessionSecret() {
  return SESSION_SECRET;
}

export function getSessionTtl() {
  return SESSION_TTL;
}
