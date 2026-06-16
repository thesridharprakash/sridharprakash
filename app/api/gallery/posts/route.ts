import { NextResponse } from "next/server";
import { readGalleryPosts } from "@/lib/galleryPosts";

export const runtime = "nodejs";

export async function GET() {
  const posts = readGalleryPosts();
  return NextResponse.json({ ok: true, posts });
}
