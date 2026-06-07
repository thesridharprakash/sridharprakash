import { NextResponse } from "next/server";
import { fetchWithRetry, sendTelegramMessage } from "@/lib/server/leadOps";

export const runtime = "nodejs";
export const maxDuration = 30;

type BloodDonationPayload = {
  name?: string;
  mobile?: string;
  email?: string;
  area?: string;
  bloodGroup?: string;
  lastBloodDonationDate?: string;
  participation?: string[];
  source?: string;
  campaign?: string;
  medium?: string;
  ref?: string;
  pageUrl?: string;
  userAgent?: string;
  consent?: boolean;
  website?: string;
  attribution?: {
    first_touch?: Record<string, string | undefined>;
    last_touch?: Record<string, string | undefined>;
  };
};

const GOOGLE_SCRIPT_URL =
  process.env.BLOOD_DONATION_GOOGLE_SCRIPT_URL ||
  process.env.GOOGLE_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzSt7eCHxSPV_QHcbY7GpKIXnXVHVLyBA6txMMhCJmk7CzMBqx6gmFbXisAMbEnm3-8LQ/exec";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_STORE = new Map<string, number[]>();
const allowedBloodGroups = new Set(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
const allowedParticipation = new Set([
  "I am willing to donate blood",
  "I can volunteer during camps",
  "I can help organize a camp",
  "I can support awareness campaigns",
  "I can provide medical support",
]);

function sanitize(input: string, max = 200) {
  return input.replace(/\s+/g, " ").trim().slice(0, max);
}

function isValidMobile(mobile: string) {
  return /^[6-9][0-9]{9}$/.test(mobile);
}

function isValidEmail(email: string) {
  return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidPastDate(value: string) {
  if (value === "") return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsedDate = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value && value <= getDateInputValue(new Date());
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

function getAttributionValue(payload: BloodDonationPayload, key: "utm_source" | "utm_medium" | "utm_campaign") {
  return payload.attribution?.last_touch?.[key] || payload.attribution?.first_touch?.[key] || "";
}

async function parsePayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const attributionText = String(formData.get("attribution") || "");
    let attribution: BloodDonationPayload["attribution"] | undefined;

    if (attributionText) {
      try {
        attribution = JSON.parse(attributionText) as BloodDonationPayload["attribution"];
      } catch {
        attribution = undefined;
      }
    }

    return {
      name: String(formData.get("name") || ""),
      mobile: String(formData.get("mobile") || ""),
      email: String(formData.get("email") || ""),
      area: String(formData.get("area") || ""),
      bloodGroup: String(formData.get("bloodGroup") || ""),
      lastBloodDonationDate: String(formData.get("lastBloodDonationDate") || ""),
      participation: formData.getAll("participation").map(String),
      source: String(formData.get("source") || ""),
      campaign: String(formData.get("campaign") || ""),
      medium: String(formData.get("medium") || ""),
      ref: String(formData.get("ref") || ""),
      pageUrl: String(formData.get("pageUrl") || ""),
      userAgent: String(formData.get("userAgent") || ""),
      consent: formData.get("consent") === "on" || formData.get("consent") === "true",
      website: String(formData.get("website") || ""),
      attribution,
    } satisfies BloodDonationPayload;
  }

  return (await request.json()) as BloodDonationPayload;
}

export async function POST(request: Request) {
  try {
    const payload = await parsePayload(request);
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json({ error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const name = sanitize(payload.name || "", 120);
    const mobile = sanitize(payload.mobile || "", 20);
    const email = sanitize(payload.email || "", 120).toLowerCase();
    const area = sanitize(payload.area || "", 120);
    const bloodGroup = sanitize(payload.bloodGroup || "", 4);
    const lastBloodDonationDate = sanitize(payload.lastBloodDonationDate || "", 10);
    const participation = (Array.isArray(payload.participation) ? payload.participation : [])
      .map((option) => sanitize(String(option), 100))
      .filter((option) => allowedParticipation.has(option));
    const source = sanitize(payload.source || "", 120);
    const campaign = sanitize(payload.campaign || "", 160);
    const medium = sanitize(payload.medium || "", 120);
    const ref = sanitize(payload.ref || "", 240);
    const pageUrl = sanitize(payload.pageUrl || "", 300);
    const userAgent = sanitize(payload.userAgent || request.headers.get("user-agent") || "", 300);
    const consent = Boolean(payload.consent);
    const website = sanitize(payload.website || "", 120);

    if (website) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!name || !mobile || !area || !consent) {
      return NextResponse.json({ error: "Name, mobile number, area, and consent are required." }, { status: 400 });
    }

    if (!isValidMobile(mobile)) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (bloodGroup && !allowedBloodGroups.has(bloodGroup)) {
      return NextResponse.json({ error: "Please select a valid blood group." }, { status: 400 });
    }

    if (!isValidPastDate(lastBloodDonationDate)) {
      return NextResponse.json({ error: "Last donation date cannot be in the future." }, { status: 400 });
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
          leadType: "blood_donation",
          submissionType: "blood_donation_submissions",
          submission_type: "blood_donation_submissions",
          category: "Blood Donation Initiative",
          name,
          phone: mobile,
          email,
          mobile,
          area,
          bloodGroup,
          lastBloodDonationDate,
          participation,
          participationText: participation.join(", "),
          message: `Blood Donation Initiative | Participation: ${participation.join(", ") || "-"} | Blood group: ${bloodGroup || "-"} | Last donation: ${lastBloodDonationDate || "-"} | Area: ${area || "-"}`,
          consent,
          consentText: consent ? "Yes" : "No",
          utmSource,
          utmMedium,
          utmCampaign,
          source: source || utmSource,
          campaign: campaign || utmCampaign,
          medium: medium || utmMedium,
          ref,
          pageUrl,
          page_url: pageUrl,
          userAgent,
          ip: clientIp,
          created_at: new Date().toISOString(),
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
          "New Blood Donation Lead",
          `Name: ${name}`,
          `Mobile: ${mobile}`,
          `Email: ${email || "-"}`,
          `Area: ${area || "-"}`,
          `Blood Group: ${bloodGroup || "-"}`,
          `Last Blood Donation Date: ${lastBloodDonationDate || "-"}`,
          `Participation: ${participation.join(", ") || "-"}`,
          `Source: ${source || utmSource || "-"}`,
          `Campaign: ${campaign || utmCampaign || "-"}`,
          `Medium: ${medium || utmMedium || "-"}`,
          `Ref: ${ref || "-"}`,
          `Page URL: ${pageUrl || "-"}`,
          `UTM Source: ${utmSource || "-"}`,
          `UTM Medium: ${utmMedium || "-"}`,
          `UTM Campaign: ${utmCampaign || "-"}`,
        ].join("\n"),
        telegramToken,
        telegramChatId
      ).catch((error) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Blood donation Telegram notification failed:", message);
        return {
          ok: false as const,
          httpStatus: 500,
          description: message,
        };
      });

      if (!telegramResult.ok) {
        console.error(
          "Blood donation Telegram notification failed:",
          telegramResult.httpStatus,
          telegramResult.description || "Telegram API request failed."
        );
      }
    } else {
      console.warn("Blood donation Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
