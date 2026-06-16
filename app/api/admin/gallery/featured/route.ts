import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { assertAdminSecret } from "@/lib/adminAuth";
import { getAdminStorageWriteErrorMessage } from "@/lib/adminStorageErrors";
import { readFeaturedGalleryId, writeFeaturedGalleryId } from "@/lib/galleryFeatured";

export const runtime = "nodejs";

export async function GET() {
  try {
    const id = readFeaturedGalleryId();
    adminLog("gallery-featured-read", { id });
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    adminLog("gallery-featured-read-error", { error: String(error) });
    return NextResponse.json({ error: "Unable to read featured gallery entry." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | { id?: string | null; secret?: string }
    | null;
  const secretError = assertAdminSecret("gallery-featured", payload?.secret);
  if (secretError) return secretError;

  const id = payload?.id ?? null;
  try {
    await writeFeaturedGalleryId(id);
    adminLog("gallery-featured-updated", { id });
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    adminLog("gallery-featured-update-error", { error: String(error) });
    return NextResponse.json(
      { error: getAdminStorageWriteErrorMessage(error, "Gallery featured") || "Unable to store featured entry." },
      { status: 500 }
    );
  }
}
