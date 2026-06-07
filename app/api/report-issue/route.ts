import { NextResponse } from "next/server";
import { isAdminBlobEnabled, uploadBlobFromBuffer } from "@/lib/adminBlobUpload";
import { fetchWithRetry, sendTelegramMessage } from "@/lib/server/leadOps";

export const runtime = "nodejs";
export const maxDuration = 30;

type IssuePayload = {
  name?: string;
  mobile?: string;
  email?: string;
  area?: string;
  priority?: string;
  landmark?: string;
  issueType?: string;
  details?: string;
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
  process.env.ISSUE_REPORT_GOOGLE_SCRIPT_URL ||
  process.env.GOOGLE_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzSt7eCHxSPV_QHcbY7GpKIXnXVHVLyBA6txMMhCJmk7CzMBqx6gmFbXisAMbEnm3-8LQ/exec";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_STORE = new Map<string, number[]>();
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedPriorities = new Set(["Normal", "Urgent", "Safety Concern"]);

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

function referenceId() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SP-ISSUE-${date}-${suffix}`;
}

function getAttributionValue(payload: IssuePayload, key: "utm_source" | "utm_medium" | "utm_campaign") {
  return payload.attribution?.last_touch?.[key] || payload.attribution?.first_touch?.[key] || "";
}

async function uploadIssuePhoto(photo: FormDataEntryValue | null, reference: string) {
  if (!(photo instanceof File) || photo.size === 0) return "";
  if (!allowedPhotoTypes.has(photo.type)) throw new Error("Only JPG, PNG, or WEBP photos are allowed.");
  if (photo.size > MAX_PHOTO_BYTES) throw new Error("Photo must be less than 5 MB.");
  if (!isAdminBlobEnabled()) throw new Error("Photo upload storage is not configured.");

  const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
  const data = Buffer.from(await photo.arrayBuffer());
  const blob = await uploadBlobFromBuffer(`issue-reports/${reference}.${ext}`, data, photo.type);
  return blob.url;
}

async function parsePayload(request: Request) {
  const formData = await request.formData();
  const attributionText = String(formData.get("attribution") || "");
  let attribution: IssuePayload["attribution"] | undefined;

  if (attributionText) {
    try {
      attribution = JSON.parse(attributionText) as IssuePayload["attribution"];
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
      priority: String(formData.get("priority") || ""),
      landmark: String(formData.get("landmark") || ""),
      issueType: String(formData.get("issueType") || ""),
      details: String(formData.get("details") || ""),
      source: String(formData.get("source") || ""),
      campaign: String(formData.get("campaign") || ""),
      medium: String(formData.get("medium") || ""),
      ref: String(formData.get("ref") || ""),
      pageUrl: String(formData.get("pageUrl") || ""),
      userAgent: String(formData.get("userAgent") || ""),
      consent: formData.get("consent") === "on" || formData.get("consent") === "true",
      website: String(formData.get("website") || ""),
      attribution,
    } satisfies IssuePayload,
    photo: formData.get("photo"),
  };
}

export async function POST(request: Request) {
  try {
    const { payload, photo } = await parsePayload(request);
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json({ error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const reference = referenceId();
    const name = sanitize(payload.name || "", 120);
    const mobile = sanitize(payload.mobile || "", 20);
    const email = sanitize(payload.email || "", 120).toLowerCase();
    const area = sanitize(payload.area || "", 120);
    const priority = sanitize(payload.priority || "Normal", 40);
    const landmark = sanitize(payload.landmark || "", 160);
    const issueType = sanitize(payload.issueType || "", 120);
    const details = sanitize(payload.details || "", 1200);
    const source = sanitize(payload.source || "", 120);
    const campaign = sanitize(payload.campaign || "", 160);
    const medium = sanitize(payload.medium || "", 120);
    const ref = sanitize(payload.ref || "", 240);
    const pageUrl = sanitize(payload.pageUrl || "", 300);
    const userAgent = sanitize(payload.userAgent || request.headers.get("user-agent") || "", 300);
    const consent = Boolean(payload.consent);
    const website = sanitize(payload.website || "", 120);

    if (website) return NextResponse.json({ ok: true }, { status: 200 });
    if (!name || !mobile || !area || !details || !consent) {
      return NextResponse.json({ error: "Name, mobile number, area, issue details, and consent are required." }, { status: 400 });
    }
    if (!isValidMobile(mobile)) return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (!allowedPriorities.has(priority)) return NextResponse.json({ error: "Please select a valid priority." }, { status: 400 });

    let photoUrl = "";
    try {
      photoUrl = await uploadIssuePhoto(photo, reference);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Photo upload failed.";
      return NextResponse.json({ error: message }, { status: 400 });
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
          leadType: "issue_report",
          submissionType: "issue_reports",
          submission_type: "issue_reports",
          reference,
          name,
          phone: mobile,
          email,
          mobile,
          area,
          priority,
          landmark,
          issueType,
          details,
          photoUrl,
          message: `Issue report ${reference} | Priority: ${priority} | Type: ${issueType || "-"} | Landmark: ${landmark || "-"} | Details: ${details}`,
          consent,
          consentText: consent ? "Yes" : "No",
          source: source || utmSource,
          campaign: campaign || utmCampaign,
          medium: medium || utmMedium,
          ref,
          pageUrl,
          page_url: pageUrl,
          userAgent,
          utmSource,
          utmMedium,
          utmCampaign,
          ip: clientIp,
          created_at: new Date().toISOString(),
          submittedAt: new Date().toISOString(),
        }),
        cache: "no-store",
      },
      { attempts: 3, timeoutMs: 8000, retryDelayMs: 400 }
    );

    if (!upstream.ok) return NextResponse.json({ error: "Unable to submit right now. Please try again shortly." }, { status: 502 });

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
    const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim() || "";
    if (telegramToken && telegramChatId) {
      await sendTelegramMessage(
        [
          "New Issue Report",
          `Reference: ${reference}`,
          `Priority: ${priority}`,
          `Name: ${name}`,
          `Mobile: ${mobile}`,
          `Email: ${email || "-"}`,
          `Area: ${area}`,
          `Landmark: ${landmark || "-"}`,
          `Type: ${issueType || "-"}`,
          `Details: ${details}`,
          `Photo: ${photoUrl || "-"}`,
          `Source: ${source || utmSource || "-"}`,
          `Campaign: ${campaign || utmCampaign || "-"}`,
          `Medium: ${medium || utmMedium || "-"}`,
          `Ref: ${ref || "-"}`,
          `Page URL: ${pageUrl || "-"}`,
        ].join("\n"),
        telegramToken,
        telegramChatId
      ).catch((error) => console.error("Issue report Telegram notification failed:", error));
    }

    return NextResponse.json({ ok: true, reference });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
