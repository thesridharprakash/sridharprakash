import { NextResponse } from "next/server";
import { isAdminBlobEnabled, uploadBlobFromBuffer } from "@/lib/adminBlobUpload";
import { fetchWithRetry, sendTelegramMessage } from "@/lib/server/leadOps";

export const runtime = "nodejs";
export const maxDuration = 30;

type CommunityPayload = {
  name?: string;
  mobile?: string;
  email?: string;
  area?: string;
  interest?: string;
  concern?: string;
  latitude?: string;
  longitude?: string;
  accuracy?: string;
  locationUrl?: string;
  bloodDonationSupport?: string[];
  bloodGroup?: string;
  lastBloodDonationDate?: string;
  preferredParticipationArea?: string;
  consent?: boolean;
  website?: string;
  attribution?: {
    first_touch?: Record<string, string | undefined>;
    last_touch?: Record<string, string | undefined>;
  };
};

const GOOGLE_SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzSt7eCHxSPV_QHcbY7GpKIXnXVHVLyBA6txMMhCJmk7CzMBqx6gmFbXisAMbEnm3-8LQ/exec";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_STORE = new Map<string, number[]>();
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const bloodDonationInterest = "Blood Donation Initiatives";
const allowedBloodDonationSupport = new Set([
  "I am willing to donate blood",
  "I can volunteer during camps",
  "I can help organize a camp",
  "I can assist with donor registration",
  "I can provide medical support",
  "I can support awareness campaigns",
]);
const allowedBloodGroups = new Set(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);

function isValidMobile(mobile: string) {
  return /^[6-9][0-9]{9}$/.test(mobile);
}

function isValidEmail(email: string) {
  return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(input: string, max = 200) {
  return input.replace(/\s+/g, " ").trim().slice(0, max);
}

function sanitizeBaseName(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "community-report";
}

function getExtensionFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function isValidCoordinate(value: string, min: number, max: number) {
  if (!value) return true;
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= min && numeric <= max;
}

async function parsePayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const attributionText = String(formData.get("attribution") || "");
    let attribution: CommunityPayload["attribution"] | undefined;

    if (attributionText) {
      try {
        attribution = JSON.parse(attributionText) as CommunityPayload["attribution"];
      } catch {
        attribution = undefined;
      }
    }

    return {
      payload: {
        name: String(formData.get("name") || ""),
        mobile: String(formData.get("mobile") || ""),
        email: String(formData.get("email") || ""),
        area: String(formData.get("area") || ""),
        interest: String(formData.get("interest") || ""),
        concern: String(formData.get("concern") || ""),
        latitude: String(formData.get("latitude") || ""),
        longitude: String(formData.get("longitude") || ""),
        accuracy: String(formData.get("accuracy") || ""),
        locationUrl: String(formData.get("locationUrl") || ""),
        bloodDonationSupport: formData.getAll("bloodDonationSupport").map(String),
        bloodGroup: String(formData.get("bloodGroup") || ""),
        lastBloodDonationDate: String(formData.get("lastBloodDonationDate") || ""),
        preferredParticipationArea: String(formData.get("preferredParticipationArea") || ""),
        consent: formData.get("consent") === "on" || formData.get("consent") === "true",
        website: String(formData.get("website") || ""),
        attribution,
      } satisfies CommunityPayload,
      photo: formData.get("photo"),
    };
  }

  return {
    payload: (await request.json()) as CommunityPayload,
    photo: null,
  };
}

async function uploadIssuePhoto(photo: FormDataEntryValue | null, name: string) {
  if (!(photo instanceof File) || photo.size === 0) {
    return "";
  }

  if (!allowedPhotoTypes.has(photo.type)) {
    throw new Error("Only JPG, PNG, or WEBP photos are allowed.");
  }

  if (photo.size > MAX_PHOTO_BYTES) {
    throw new Error("Photo must be less than 5 MB.");
  }

  if (!isAdminBlobEnabled()) {
    throw new Error("Photo upload storage is not configured.");
  }

  const ext = getExtensionFromType(photo.type);
  const baseName = sanitizeBaseName(name || "community-report");
  const fileName = `${Date.now()}-${baseName}.${ext}`;
  const data = Buffer.from(await photo.arrayBuffer());
  const blob = await uploadBlobFromBuffer(`community/reports/${fileName}`, data, photo.type);
  return blob.url;
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

function getAttributionValue(payload: CommunityPayload, key: "utm_source" | "utm_medium" | "utm_campaign") {
  return payload.attribution?.last_touch?.[key] || payload.attribution?.first_touch?.[key] || "";
}

function isValidPastDate(value: string) {
  if (value === "") return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsedDate = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value && value <= new Date().toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  try {
    const { payload, photo } = await parsePayload(request);
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json({ error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const name = sanitize(payload.name || "", 120);
    const mobile = sanitize(payload.mobile || "", 20);
    const email = sanitize(payload.email || "", 120).toLowerCase();
    const area = sanitize(payload.area || "", 120);
    const interest = sanitize(payload.interest || "", 120);
    const concern = sanitize(payload.concern || "", 1200);
    const latitude = sanitize(payload.latitude || "", 40);
    const longitude = sanitize(payload.longitude || "", 40);
    const accuracy = sanitize(payload.accuracy || "", 40);
    const locationUrl =
      latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : sanitize(payload.locationUrl || "", 240);
    const isBloodDonationInterest = interest === bloodDonationInterest;
    const bloodDonationSupport = (Array.isArray(payload.bloodDonationSupport) ? payload.bloodDonationSupport : [])
      .map((option) => sanitize(String(option), 100))
      .filter((option) => allowedBloodDonationSupport.has(option));
    const bloodGroup = sanitize(payload.bloodGroup || "", 4);
    const lastBloodDonationDate = sanitize(payload.lastBloodDonationDate || "", 10);
    const preferredParticipationArea = sanitize(payload.preferredParticipationArea || "", 120);
    const consent = Boolean(payload.consent);
    const website = sanitize(payload.website || "", 120);

    if (website) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!name || !mobile || !consent) {
      return NextResponse.json({ error: "Name, mobile number, and consent are required." }, { status: 400 });
    }

    if (!isValidMobile(mobile)) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!isValidCoordinate(latitude, -90, 90) || !isValidCoordinate(longitude, -180, 180)) {
      return NextResponse.json({ error: "Invalid location coordinates." }, { status: 400 });
    }

    if (bloodGroup && !allowedBloodGroups.has(bloodGroup)) {
      return NextResponse.json({ error: "Please select a valid blood group." }, { status: 400 });
    }

    if (!isValidPastDate(lastBloodDonationDate)) {
      return NextResponse.json({ error: "Last blood donation date must be a valid date that is not in the future." }, { status: 400 });
    }

    const utmSource = getAttributionValue(payload, "utm_source");
    const utmMedium = getAttributionValue(payload, "utm_medium");
    const utmCampaign = getAttributionValue(payload, "utm_campaign");
    let photoUrl = "";

    try {
      photoUrl = await uploadIssuePhoto(photo, `${name}-${area || "community"}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Photo upload failed.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const upstream = await fetchWithRetry(
      GOOGLE_SCRIPT_URL,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          leadType: "community",
          name,
          email,
          mobile,
          area,
          interest,
          category: isBloodDonationInterest ? "Blood Donation Camp" : "",
          consent,
          consentText: consent ? "Yes" : "No",
          budget: "",
          timeline: "",
          message: `Interest: ${interest || "-"} | Blood donation support: ${bloodDonationSupport.join(", ") || "-"} | Blood group: ${bloodGroup || "-"} | Last blood donation: ${lastBloodDonationDate || "-"} | Preferred participation area: ${preferredParticipationArea || "-"} | Concern: ${concern || "-"} | Location: ${locationUrl || "-"} | Photo: ${photoUrl || "-"} | Consent: ${consent ? "Yes" : "No"}`,
          concern,
          latitude,
          longitude,
          accuracy,
          locationUrl,
          photoUrl,
          bloodDonationSupport,
          bloodGroup,
          lastBloodDonationDate,
          preferredParticipationArea,
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
          "New Community Lead",
          `Name: ${name}`,
          `Mobile: ${mobile}`,
          `Email: ${email || "-"}`,
          `Area: ${area || "-"}`,
          `Interest: ${interest || "-"}`,
          `Category: ${isBloodDonationInterest ? "Blood Donation Camp" : "-"}`,
          `Blood Donation Support: ${bloodDonationSupport.join(", ") || "-"}`,
          `Blood Group: ${bloodGroup || "-"}`,
          `Last Blood Donation Date: ${lastBloodDonationDate || "-"}`,
          `Preferred Participation Area: ${preferredParticipationArea || "-"}`,
          `Concern: ${concern || "-"}`,
          `Location: ${locationUrl || "-"}`,
          `Accuracy: ${accuracy ? `${accuracy}m` : "-"}`,
          `Photo: ${photoUrl || "-"}`,
          `UTM Source: ${utmSource || "-"}`,
          `UTM Medium: ${utmMedium || "-"}`,
          `UTM Campaign: ${utmCampaign || "-"}`,
        ].join("\n"),
        telegramToken,
        telegramChatId
      ).catch((error) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Community Telegram notification failed:", message);
        return {
          ok: false as const,
          httpStatus: 500,
          description: message,
        };
      });

      if (!telegramResult.ok) {
        console.error(
          "Community Telegram notification failed:",
          telegramResult.httpStatus,
          telegramResult.description || "Telegram API request failed."
        );
      }
    } else {
      console.warn("Community Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
