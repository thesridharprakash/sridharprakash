import { NextResponse } from "next/server";
import { fetchWithRetry, sendTelegramMessage } from "@/lib/server/leadOps";

type VolunteerPayload = {
  name?: string;
  mobile?: string;
  email?: string;
  area?: string;
  interest?: string;
  consent?: boolean;
  website?: string;
  attribution?: {
    first_touch?: Record<string, string | undefined>;
    last_touch?: Record<string, string | undefined>;
  };
};

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL
  || "https://script.google.com/macros/s/AKfycbzSt7eCHxSPV_QHcbY7GpKIXnXVHVLyBA6txMMhCJmk7CzMBqx6gmFbXisAMbEnm3-8LQ/exec";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_STORE = new Map<string, number[]>();

function isValidMobile(mobile: string) {
  return /^[6-9][0-9]{9}$/.test(mobile);
}

function isValidEmail(email: string) {
  return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(input: string, max = 200) {
  return input.replace(/\s+/g, " ").trim().slice(0, max);
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
  payload: VolunteerPayload,
  key: "utm_source" | "utm_medium" | "utm_campaign"
) {
  return (
    payload.attribution?.last_touch?.[key]
    || payload.attribution?.first_touch?.[key]
    || ""
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as VolunteerPayload;
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const name = sanitize(payload.name || "", 120);
    const mobile = sanitize(payload.mobile || "", 20);
    const email = sanitize(payload.email || "", 120).toLowerCase();
    const area = sanitize(payload.area || "", 120);
    const interest = sanitize(payload.interest || "", 120);
    const consent = Boolean(payload.consent);
    const website = sanitize(payload.website || "", 120);

    if (website) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!name || !mobile || !consent) {
      return NextResponse.json(
        { error: "Name, mobile number, and consent are required." },
        { status: 400 }
      );
    }

    if (!isValidMobile(mobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const utmSource = getAttributionValue(payload, "utm_source");
    const utmMedium = getAttributionValue(payload, "utm_medium");
    const utmCampaign = getAttributionValue(payload, "utm_campaign");

    const upstream = await fetchWithRetry(
      GOOGLE_SCRIPT_URL,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          leadType: "volunteer",
          name,
          email,
          mobile,
          area,
          interest,
          consent,
          consentText: consent ? "Yes" : "No",
          budget: "",
          timeline: "",
          message: `Interest: ${interest || "-"} | Consent: ${consent ? "Yes" : "No"}`,
          utmSource,
          utmMedium,
          utmCampaign,
          ip: clientIp,
          submittedAt: new Date().toISOString(),
        }),
        cache: "no-store",
      },
      {
        attempts: 3,
        timeoutMs: 8000,
        retryDelayMs: 400,
      }
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Unable to submit right now. Please try again shortly." },
        { status: 502 }
      );
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
    const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim() || "";
    const telegramConfigured = Boolean(telegramToken) && Boolean(telegramChatId);

    if (telegramConfigured) {
      const telegramResult = await sendTelegramMessage(
        [
          "New Volunteer Lead",
          `Name: ${name}`,
          `Mobile: ${mobile}`,
          `Email: ${email || "-"}`,
          `Area: ${area || "-"}`,
          `Interest: ${interest || "-"}`,
          `UTM Source: ${utmSource || "-"}`,
          `UTM Medium: ${utmMedium || "-"}`,
          `UTM Campaign: ${utmCampaign || "-"}`,
        ].join("\n"),
        telegramToken,
        telegramChatId
      ).catch((error) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Volunteer Telegram notification failed:", message);
        return {
          ok: false as const,
          httpStatus: 500,
          description: message,
        };
      });

      if (!telegramResult.ok) {
        console.error(
          "Volunteer Telegram notification failed:",
          telegramResult.httpStatus,
          telegramResult.description || "Telegram API request failed."
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
