import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { getAdminStorageWriteErrorMessage } from "@/lib/adminStorageErrors";
import { readPageContent, writePageContent } from "@/lib/pageContent";

const PAGE_SLUG = "gallery";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = readPageContent(PAGE_SLUG);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    adminLog("page-read-error", { page: PAGE_SLUG, error: String(error) });
    return NextResponse.json({ error: "Unable to fetch gallery content." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    await writePageContent(PAGE_SLUG, payload);
    adminLog("page-update", { page: PAGE_SLUG });
    return NextResponse.json({ ok: true, data: payload });
  } catch (error) {
    adminLog("page-update-error", { page: PAGE_SLUG, error: String(error) });
    return NextResponse.json(
      { error: getAdminStorageWriteErrorMessage(error, "Gallery content") || "Unable to save gallery content." },
      { status: 500 }
    );
  }
}
