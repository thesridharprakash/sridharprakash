import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { recordAnalyticsEvent, readAnalyticsSnapshot } from "@/lib/analyticsStore";
import { SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminSessionEdge";

export const runtime = "nodejs";

type AnalyticsPayload = {
  eventName?: string;
  pagePath?: string;
  pageUrl?: string;
  source?: string;
  campaign?: string;
  medium?: string;
  ref?: string;
  device?: string;
  visitorId?: string;
};

function sanitize(input: string, max = 240) {
  return input.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AnalyticsPayload;
    const eventName = sanitize(payload.eventName || "", 80);
    const visitorId = sanitize(payload.visitorId || "", 80);

    if (!eventName || !visitorId) {
      return NextResponse.json({ error: "Missing analytics event data." }, { status: 400 });
    }

    recordAnalyticsEvent(
      {
        eventName,
        pagePath: sanitize(payload.pagePath || "", 240),
        pageUrl: sanitize(payload.pageUrl || "", 300),
        source: sanitize(payload.source || "", 120),
        campaign: sanitize(payload.campaign || "", 160),
        medium: sanitize(payload.medium || "", 120),
        ref: sanitize(payload.ref || "", 240),
        device: sanitize(payload.device || "", 40),
      },
      visitorId
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid analytics payload." }, { status: 400 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;

  if (!(await verifyAdminSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, snapshot: readAnalyticsSnapshot() });
}
