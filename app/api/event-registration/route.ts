import { NextResponse } from "next/server";
import { fetchWithRetry, sendTelegramMessage } from "@/lib/server/leadOps";

export const runtime = "nodejs";
export const maxDuration = 30;

const GOOGLE_SCRIPT_URL = process.env.EVENT_REGISTRATION_GOOGLE_SCRIPT_URL || process.env.GOOGLE_SCRIPT_URL || "";
const RATE_LIMIT_STORE = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function sanitize(input: string, max = 200) {
  return input.replace(/\s+/g, " ").trim().slice(0, max);
}

function isValidMobile(mobile: string) {
  return /^[6-9][0-9]{9}$/.test(mobile);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) return NextResponse.json({ error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });

    const name = sanitize(String(formData.get("name") || ""), 120);
    const mobile = sanitize(String(formData.get("mobile") || ""), 20);
    const email = sanitize(String(formData.get("email") || ""), 120).toLowerCase();
    const area = sanitize(String(formData.get("area") || ""), 120);
    const eventTitle = sanitize(String(formData.get("eventTitle") || ""), 180);
    const source = sanitize(String(formData.get("source") || ""), 120);
    const campaign = sanitize(String(formData.get("campaign") || ""), 160);
    const medium = sanitize(String(formData.get("medium") || ""), 120);
    const ref = sanitize(String(formData.get("ref") || ""), 240);
    const pageUrl = sanitize(String(formData.get("pageUrl") || ""), 300);
    const userAgent = sanitize(String(formData.get("userAgent") || request.headers.get("user-agent") || ""), 300);
    const consent = formData.get("consent") === "on";
    const website = sanitize(String(formData.get("website") || ""), 120);

    if (website) return NextResponse.json({ ok: true }, { status: 200 });
    if (!name || !mobile || !area || !eventTitle || !consent) return NextResponse.json({ error: "Name, mobile number, area, event, and consent are required." }, { status: 400 });
    if (!isValidMobile(mobile)) return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });

    const body = {
      leadType: "event_registration",
      submissionType: "event_registrations",
      name,
      phone: mobile,
      mobile,
      email,
      area,
      eventTitle,
      submission_type: "event_registrations",
      created_at: new Date().toISOString(),
      source,
      campaign,
      medium,
      ref,
      pageUrl,
      page_url: pageUrl,
      userAgent,
      ip: clientIp,
      consent,
      consentText: "Yes",
      message: `Event registration | Event: ${eventTitle} | Area: ${area}`,
    };

    if (GOOGLE_SCRIPT_URL) {
      const upstream = await fetchWithRetry(
        GOOGLE_SCRIPT_URL,
        { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body), cache: "no-store" },
        { attempts: 3, timeoutMs: 8000, retryDelayMs: 400 }
      );
      if (!upstream.ok) return NextResponse.json({ error: "Unable to submit right now. Please try again shortly." }, { status: 502 });
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
    const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim() || "";
    if (telegramToken && telegramChatId) {
      await sendTelegramMessage(
        [`New Event Registration`, `Event: ${eventTitle}`, `Name: ${name}`, `Mobile: ${mobile}`, `Email: ${email || "-"}`, `Area: ${area}`, `Source: ${source || "-"}`, `Campaign: ${campaign || "-"}`].join("\n"),
        telegramToken,
        telegramChatId
      ).catch((error) => console.error("Event registration Telegram notification failed:", error));
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
