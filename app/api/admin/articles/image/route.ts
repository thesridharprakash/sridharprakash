import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { assertAdminMfa, assertAdminSecret } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const maxDuration = 30;

const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitizeBaseName(input: string) {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return base || "article-image";
}

function getExtensionFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  try {
    const mfaError = assertAdminMfa("image-upload", request.headers.get("x-admin-otp"));
    if (mfaError) return mfaError;

    const formData = await request.formData();
    const secret = String(formData.get("secret") || "").trim();
    const secretError = assertAdminSecret("image-upload", secret);
    if (secretError) return secretError;

    const file = formData.get("file");
    const baseNameInput = String(formData.get("baseName") || "");

    if (!(file instanceof File)) {
      adminLog("image-upload-no-file");
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!allowedMimeTypes.has(file.type)) {
      adminLog("image-upload-invalid-type", { type: file.type });
      return NextResponse.json(
        { error: "Only JPG, PNG, or WEBP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
      adminLog("image-upload-size", { size: file.size });
      return NextResponse.json(
        { error: "Image must be between 1 byte and 5 MB." },
        { status: 400 }
      );
    }

    const ext = getExtensionFromType(file.type);
    const baseName = sanitizeBaseName(baseNameInput);
    const fileName = `${Date.now()}-${baseName}.${ext}`;
    const targetPath = path.join(uploadsDir, fileName);

    if (!targetPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
    }

    fs.mkdirSync(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(targetPath, buffer);
    adminLog("image-upload-success", { file: fileName, size: file.size });

    return NextResponse.json({
      ok: true,
      path: `/images/uploads/${fileName}`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to upload image." }, { status: 400 });
  }
}
