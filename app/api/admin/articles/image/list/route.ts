import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";

export const runtime = "nodejs";
export const maxDuration = 30;

const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");

export async function GET() {
  adminLog("image-list-request");
  if (!fs.existsSync(uploadsDir)) {
    return NextResponse.json({ ok: true, uploads: [] });
  }

  const files = fs.readdirSync(uploadsDir).filter((file) => {
    const fullPath = path.join(uploadsDir, file);
    return fs.statSync(fullPath).isFile();
  });

  const uploads = files
    .map((file) => {
      const fullPath = path.join(uploadsDir, file);
      const stats = fs.statSync(fullPath);
      return {
        name: file,
        path: `/images/uploads/${file}`,
        size: stats.size,
        updatedAt: stats.mtime.toISOString(),
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return NextResponse.json({ ok: true, uploads });
}
