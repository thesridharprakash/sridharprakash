import { NextResponse } from "next/server";
import { fetchWithRetry, sendTelegramMessage } from "@/lib/server/leadOps";

type ContactPayload = {
  leadType?: "contact" | "booking";
  name?: string;
  email?: string;
  mobile?: string;
  area?: string;
  message?: string;
  budget?: string;
  timeline?: string;
  bookingType?: string;
  brand?: string;
  preferredDate?: string;
  preferredTime?: string;
  brief?: string;
  website?: string;
  attribution?: {
    first_touch?: Record<string, string | undefined>;
    last_touch?: Record<string, string | undefined>;
  };
};

const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSt7eCHxSPV_QHcbY7GpKIXnXVHVLyBA6txMMhCJmk7CzMBqx6gmFbXisAMbEnm3-8LQ/exec";

function isUsableScriptUrl(value?: string) {
  if (!value) return false;
  const url = value.trim();
  if (!url) return false;
  if (url.includes("your-contact-script-id")) return false;
  if (url.includes("your-script-id")) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "script.google.com";
  } catch {
    return false;
  }
}

const CONTACT_SCRIPT_URL =
  (isUsableScriptUrl(process.env.CONTACT_GOOGLE_SCRIPT_URL) && process.env.CONTACT_GOOGLE_SCRIPT_URL?.trim()) ||
  (isUsableScriptUrl(process.env.GOOGLE_SCRIPT_URL) && process.env.GOOGLE_SCRIPT_URL?.trim()) ||
  DEFAULT_SCRIPT_URL;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_STORE = new Map<string, number[]>();

function sanitize(input: string, max = 4000) {
  return input.replace(/\s+/g, " ").trim().slice(0, max);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidMobile(mobile: string) {
  return /^[6-9][0-9]{9}$/.test(mobile);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const attempts = RATE_LIMIT_STORE.get(ip) || [];
  const validAttempts = attempts.filter((timestamp) => timestamp > windowStart);
  validAttempts.push(now);
  RATE_LIMIT_STORE.set(ip, validAttempts);
  return validAttempts.length > RATE_LIMIT_MAX;
}

function getAttributionValue(
  payload: ContactPayload,
  key: "utm_source" | "utm_medium" | "utm_campaign"
) {
  return payload.attribution?.last_touch?.[key] || payload.attribution?.first_touch?.[key] || "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const leadType = payload.leadType === "booking" ? "booking" : "contact";
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const name = sanitize(payload.name || "", 120);
    const email = sanitize(payload.email || "", 120).toLowerCase();
    const mobile = sanitize(payload.mobile || "", 40);
    const area = sanitize(payload.area || "", 120);
    const message = sanitize(payload.message || "", 2000);
    const budget = sanitize(payload.budget || "", 120);
    const timeline = sanitize(payload.timeline || "", 120);
    const bookingType = sanitize(payload.bookingType || "", 120);
    const brand = sanitize(payload.brand || "", 160);
    const preferredDate = sanitize(payload.preferredDate || "", 40);
    const preferredTime = sanitize(payload.preferredTime || "", 80);
    const brief = sanitize(payload.brief || "", 2000);
    const website = sanitize(payload.website || "", 120);

    if (website) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (leadType === "booking" && !isValidMobile(mobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const utmSource = getAttributionValue(payload, "utm_source");
    const utmMedium = getAttributionValue(payload, "utm_medium");
    const utmCampaign = getAttributionValue(payload, "utm_campaign");

    let upstreamOk = false;
    try {
      const upstream = await fetchWithRetry(
        CONTACT_SCRIPT_URL,
        {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            leadType,
            name,
            email,
            mobile,
            area,
            message,
            budget,
            timeline,
            bookingType,
            brand,
            preferredDate,
            preferredTime,
            brief,
            utmSource,
            utmMedium,
            utmCampaign,
            submittedAt: new Date().toISOString(),
            ip: clientIp,
          }),
          cache: "no-store",
        },
        {
          attempts: 3,
          timeoutMs: 8000,
          retryDelayMs: 400,
        }
      );
      upstreamOk = upstream.ok;
    } catch {
      upstreamOk = false;
    }

    const telegramResult = await sendTelegramMessage(
      [
        leadType === "booking" ? "New Booking Lead" : "New Contact Lead",
        `Name: ${name}`,
        `Email: ${email}`,
        `Mobile: ${mobile || "-"}`,
        `Area: ${area || "-"}`,
        `Booking Type: ${bookingType || "-"}`,
        `Brand: ${brand || "-"}`,
        `Preferred Date: ${preferredDate || "-"}`,
        `Preferred Time: ${preferredTime || "-"}`,
        `Budget: ${budget || "-"}`,
        `Timeline: ${timeline || "-"}`,
        `Brief: ${brief || "-"}`,
        `Message: ${message}`,
        `UTM Source: ${utmSource || "-"}`,
        `UTM Medium: ${utmMedium || "-"}`,
        `UTM Campaign: ${utmCampaign || "-"}`,
      ].join("\n"),
      process.env.TELEGRAM_BOT_TOKEN,
      process.env.TELEGRAM_CHAT_ID
    );

    const telegramConfigured =
      Boolean(process.env.TELEGRAM_BOT_TOKEN) && Boolean(process.env.TELEGRAM_CHAT_ID);

    if (!upstreamOk && (!telegramConfigured || !telegramResult.ok)) {
      return NextResponse.json(
        { error: "Unable to submit right now. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
