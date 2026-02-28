import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { getAdminStorageWriteErrorMessage } from "@/lib/adminStorageErrors";
import { readEventsArchive, writeEventsArchive, type EventsArchiveRecord } from "@/lib/youtubeEvents";

export const runtime = "nodejs";

function isValidDateInput(value?: string) {
  if (!value) return true;
  return !Number.isNaN(new Date(value).getTime());
}

function validateArchiveItems(items: unknown): { ok: true; items: EventsArchiveRecord[] } | { ok: false; error: string } {
  if (!Array.isArray(items)) {
    return { ok: false, error: "Archive payload must be an array." };
  }

  const normalized: EventsArchiveRecord[] = [];

  for (const entry of items) {
    if (!entry || typeof entry !== "object") {
      return { ok: false, error: "Each archive entry must be an object." };
    }

    const item = entry as Partial<EventsArchiveRecord>;
    const videoId = String(item.videoId ?? "").trim();
    const title = String(item.title ?? "").trim();
    if (!videoId || !title) {
      return { ok: false, error: "Each archive entry requires videoId and title." };
    }
    if (!isValidDateInput(item.publishedAt)) {
      return { ok: false, error: `Invalid publishedAt for ${videoId}. Use ISO date/time or leave blank.` };
    }

    normalized.push({
      videoId,
      title,
      channelTitle: String(item.channelTitle ?? "").trim(),
      publishedAt: String(item.publishedAt ?? "").trim(),
      thumbnailUrl: String(item.thumbnailUrl ?? "").trim(),
      status: item.status === "live" ? "live" : "completed",
      durationLabel: String(item.durationLabel ?? "").trim(),
      themeLabel: String(item.themeLabel ?? "").trim(),
    });
  }

  return { ok: true, items: normalized };
}

export async function GET() {
  try {
    const items = readEventsArchive();
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    adminLog("events-archive-read-error", { error: String(error) });
    return NextResponse.json({ error: "Unable to fetch events archive." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as { items?: unknown } | null;
    const validation = validateArchiveItems(payload?.items);
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const saved = await writeEventsArchive(validation.items);
    adminLog("events-archive-save", { count: saved.length });
    return NextResponse.json({ ok: true, items: saved });
  } catch (error) {
    adminLog("events-archive-save-error", { error: String(error) });
    return NextResponse.json(
      { error: getAdminStorageWriteErrorMessage(error, "Events archive") || "Unable to save events archive." },
      { status: 500 }
    );
  }
}
