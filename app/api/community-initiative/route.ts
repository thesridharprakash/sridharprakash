import { NextResponse } from "next/server";
import { fetchWithRetry, sendTelegramMessage } from "@/lib/server/leadOps";
import { getCommunityInitiative } from "@/app/community/initiatives";

export const runtime = "nodejs";
export const maxDuration = 30;

type CommunityInitiativePayload = {
  initiativeSlug?: string;
  interest?: string;
  name?: string;
  mobile?: string;
  email?: string;
  area?: string;
  participation?: string[];
  message?: string;
  consent?: boolean;
  website?: string;
  attribution?: {
    first_touch?: Record<string, string | undefined>;
    last_touch?: Record<string, string | undefined>;
  };
};

const GOOGLE_SCRIPT_URL =
  process.env.COMMUNITY_INITIATIVE_GOOGLE_SCRIPT_URL ||
  process.env.GOOGLE_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzSt7eCHxSPV_QHcbY7GpKIXnXVHVLyBA6txMMhCJmk7CzMBqx6gmFbXisAMbEnm3-8LQ/exec";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_STORE = new Map<string, number[]>();

function sanitize(input: string, max = 200) {
  return input.replace(/\s+/g, " ").trim().slice(0, max);
}

function isValidMobile(mobile: string) {
  return /^[6-9][0-9]{9}$/.test(mobile);
}

function isValidEmail(email: string) {
  return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

function getAttributionValue(payload: CommunityInitiativePayload, key: "utm_source" | "utm_medium" | "utm_campaign") {
  return payload.attribution?.last_touch?.[key] || payload.attribution?.first_touch?.[key] || "";
}

async function parsePayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const attributionText = String(formData.get("attribution") || "");
    let attribution: CommunityInitiativePayload["attribution"] | undefined;

    if (attributionText) {
      try {
        attribution = JSON.parse(attributionText) as CommunityInitiativePayload["attribution"];
      } catch {
        attribution = undefined;
      }
    }

    return {
      initiativeSlug: String(formData.get("initiativeSlug") || ""),
      interest: String(formData.get("interest") || ""),
      name: String(formData.get("name") || ""),
      mobile: String(formData.get("mobile") || ""),
      email: String(formData.get("email") || ""),
      area: String(formData.get("area") || ""),
      participation: formData.getAll("participation").map(String),
      message: String(formData.get("message") || ""),
      consent: formData.get("consent") === "on" || formData.get("consent") === "true",
      website: String(formData.get("website") || ""),
      attribution,
    } satisfies CommunityInitiativePayload;
  }

  return (await request.json()) as CommunityInitiativePayload;
}

export async function POST(request: Request) {
  try {
    const payload = await parsePayload(request);
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json({ error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const initiativeSlug = sanitize(payload.initiativeSlug || "", 80);
    const initiative = getCommunityInitiative(initiativeSlug);
    const name = sanitize(payload.name || "", 120);
    const mobile = sanitize(payload.mobile || "", 20);
    const email = sanitize(payload.email || "", 120).toLowerCase();
    const area = sanitize(payload.area || "", 120);
    const message = sanitize(payload.message || "", 1200);
    const consent = Boolean(payload.consent);
    const website = sanitize(payload.website || "", 120);

    if (website) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!initiative) {
      return NextResponse.json({ error: "Please select a valid community participation option." }, { status: 400 });
    }

    if (!name || !mobile || !consent) {
      return NextResponse.json({ error: "Name, mobile number, and consent are required." }, { status: 400 });
    }

    if (initiative.messageRequired && !message) {
      return NextResponse.json({ error: "Please add the required details before submitting." }, { status: 400 });
    }

    if (!isValidMobile(mobile)) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const allowedOptions = new Set(initiative.options);
    const participation = (Array.isArray(payload.participation) ? payload.participation : [])
      .map((option) => sanitize(String(option), 120))
      .filter((option) => allowedOptions.has(option));
    const utmSource = getAttributionValue(payload, "utm_source");
    const utmMedium = getAttributionValue(payload, "utm_medium");
    const utmCampaign = getAttributionValue(payload, "utm_campaign");

    const upstream = await fetchWithRetry(
      GOOGLE_SCRIPT_URL,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          leadType: "community_initiative",
          category: initiative.eyebrow,
          initiativeSlug: initiative.slug,
          interest: initiative.interest,
          name,
          email,
          mobile,
          area,
          participation,
          participationText: participation.join(", "),
          message: `Interest: ${initiative.interest} | Participation: ${participation.join(", ") || "-"} | Details: ${message || "-"} | Area: ${area || "-"}`,
          details: message,
          consent,
          consentText: consent ? "Yes" : "No",
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
      return NextResponse.json({ error: "Unable to submit right now. Please try again shortly." }, { status: 502 });
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
    const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim() || "";
    const telegramConfigured = Boolean(telegramToken) && Boolean(telegramChatId);

    if (telegramConfigured) {
      const telegramResult = await sendTelegramMessage(
        [
          "New Community Initiative Lead",
          `Category: ${initiative.eyebrow}`,
          `Interest: ${initiative.interest}`,
          `Name: ${name}`,
          `Mobile: ${mobile}`,
          `Email: ${email || "-"}`,
          `Area: ${area || "-"}`,
          `Participation: ${participation.join(", ") || "-"}`,
          `Details: ${message || "-"}`,
          `UTM Source: ${utmSource || "-"}`,
          `UTM Medium: ${utmMedium || "-"}`,
          `UTM Campaign: ${utmCampaign || "-"}`,
        ].join("\n"),
        telegramToken,
        telegramChatId
      ).catch((error) => {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Community initiative Telegram notification failed:", errorMessage);
        return {
          ok: false as const,
          httpStatus: 500,
          description: errorMessage,
        };
      });

      if (!telegramResult.ok) {
        console.error(
          "Community initiative Telegram notification failed:",
          telegramResult.httpStatus,
          telegramResult.description || "Telegram API request failed."
        );
      }
    } else {
      console.warn("Community initiative Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
