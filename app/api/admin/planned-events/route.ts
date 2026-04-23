import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminLog } from "@/lib/adminLogger";
import { getAdminStorageWriteErrorMessage } from "@/lib/adminStorageErrors";
import { readPlannedEvents, writePlannedEvents, type PlannedEventRecord } from "@/lib/plannedEvents";

export const runtime = "nodejs";

function isValidDate(value: string) {
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function validateItems(items: unknown): { ok: true; items: PlannedEventRecord[] } | { ok: false; error: string } {
  if (!Array.isArray(items)) {
    return { ok: false, error: "Upcoming events payload must be an array." };
  }

  const normalized: PlannedEventRecord[] = [];

  for (const entry of items) {
    if (!entry || typeof entry !== "object") {
      return { ok: false, error: "Each upcoming event must be an object." };
    }

    const item = entry as Partial<PlannedEventRecord>;
    const title = String(item.title ?? "").trim();
    const date = String(item.date ?? "").trim();
    const endDate = String(item.endDate ?? "").trim();
    if (!title || !date) {
      return { ok: false, error: "Each upcoming event requires title and date." };
    }
    if (!isValidDate(date)) {
      return { ok: false, error: `Invalid date for ${title}. Use YYYY-MM-DD.` };
    }
    if (endDate && !isValidDate(endDate)) {
      return { ok: false, error: `Invalid end date for ${title}. Use YYYY-MM-DD or leave it blank.` };
    }
    if (endDate && new Date(`${endDate}T00:00:00`) < new Date(`${date}T00:00:00`)) {
      return { ok: false, error: `End date cannot be before start date for ${title}.` };
    }

    normalized.push({
      title,
      description: String(item.description ?? "").trim(),
      date,
      endDate,
      time: String(item.time ?? "").trim(),
      startTime: String(item.startTime ?? "").trim(),
      endTime: String(item.endTime ?? "").trim(),
      location: String(item.location ?? "").trim(),
      mapUrl: String(item.mapUrl ?? "").trim(),
    });
  }

  return { ok: true, items: normalized };
}

export async function GET() {
  try {
    return NextResponse.json({ ok: true, items: readPlannedEvents() });
  } catch (error) {
    adminLog("planned-events-read-error", { error: String(error) });
    return NextResponse.json({ error: "Unable to fetch upcoming events." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as { items?: unknown } | null;
    const validation = validateItems(payload?.items);
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const saved = await writePlannedEvents(validation.items);
    revalidatePath("/events");
    revalidatePath("/admin/events");
    adminLog("planned-events-save", { count: saved.length });
    return NextResponse.json({ ok: true, items: saved });
  } catch (error) {
    adminLog("planned-events-save-error", { error: String(error) });
    return NextResponse.json(
      { error: getAdminStorageWriteErrorMessage(error, "Upcoming events") || "Unable to save upcoming events." },
      { status: 500 },
    );
  }
}
