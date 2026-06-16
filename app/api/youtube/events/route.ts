import { NextResponse } from "next/server";
import { getYouTubeEventsPayload } from "@/lib/youtubeEvents";

export const runtime = "nodejs";

export async function GET() {
  const payload = await getYouTubeEventsPayload();
  const status = payload.error ? 502 : 200;
  return NextResponse.json(payload, { status });
}
