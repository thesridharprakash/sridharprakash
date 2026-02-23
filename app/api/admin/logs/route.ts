import { NextResponse } from "next/server";
import { adminLog, readAdminLogs } from "@/lib/adminLogger";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  const entries = readAdminLogs(80);
  adminLog("logs-fetched", { count: entries.length });
  return NextResponse.json({ ok: true, entries });
}
