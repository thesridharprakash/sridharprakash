import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { importRecentCompletedEventsIntoArchive } from "@/lib/youtubeEvents";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as { maxResults?: number } | null;
    const maxResults = typeof payload?.maxResults === "number" ? payload.maxResults : 8;

    const result = await importRecentCompletedEventsIntoArchive(maxResults);
    adminLog("events-archive-import", {
      importedCount: result.importedCount,
      newCount: result.newCount,
      updatedCount: result.updatedCount,
      payloadError: result.payloadError ?? "",
    });

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    adminLog("events-archive-import-error", { error: String(error) });
    return NextResponse.json({ error: "Unable to import recent YouTube events." }, { status: 500 });
  }
}
