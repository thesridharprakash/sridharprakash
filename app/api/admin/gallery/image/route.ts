import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { assertAdminMfa, assertAdminSecret } from "@/lib/adminAuth";

export const runtime = "nodejs";

const uploadsDir = path.join(process.cwd(), "public", "images", "gallery");
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitizeBaseName(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "gallery-image";
}

function getExtensionFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  const mfaError = assertAdminMfa("gallery-image-upload", request.headers.get("x-admin-otp"));
  if (mfaError) return mfaError;

  const formData = await request.formData();
  const secret = String(formData.get("secret") || "").trim();
  const secretError = assertAdminSecret("gallery-image-upload", secret);
  if (secretError) return secretError;

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!allowedMimeTypes.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, or WEBP images are allowed." }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image must be less than 5 MB." }, { status: 400 });
  }

  const ext = getExtensionFromType(file.type);
  const baseName = sanitizeBaseName(String(formData.get("baseName") || "gallery-image"));
  const fileName = `${Date.now()}-${baseName}.${ext}`;
  const targetPath = path.join(uploadsDir, fileName);

  if (!targetPath.startsWith(uploadsDir)) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const data = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(targetPath, data);

  adminLog("gallery-image-upload-success", { file: fileName, size: file.size });

  return NextResponse.json({
    ok: true,
    path: `/images/gallery/${fileName}`,
  });
}
