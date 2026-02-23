import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { assertAdminMfa, assertAdminSecret } from "@/lib/adminAuth";
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
  const mfaError = assertAdminMfa("gallery-featured", request.headers.get("x-admin-otp"));
  if (mfaError) return mfaError;

  const payload = (await request.json().catch(() => null)) as
    | { id?: string | null; secret?: string }
    | null;
  const secretError = assertAdminSecret("gallery-featured", payload?.secret);
  if (secretError) return secretError;

  const id = payload?.id ?? null;
  try {
    writeFeaturedGalleryId(id);
    adminLog("gallery-featured-updated", { id });
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    adminLog("gallery-featured-update-error", { error: String(error) });
    return NextResponse.json({ error: "Unable to store featured entry." }, { status: 500 });
  }
}
