import fs from "fs";
import path from "path";
import { isAdminRepoStorageEnabled, writeRepoFile } from "@/lib/adminRepoStorage";

const featuredFile = path.join(process.cwd(), "data", "gallery", "featured.json");

function ensureDir() {
  const dir = path.dirname(featuredFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureFile() {
  ensureDir();
  if (!fs.existsSync(featuredFile)) {
    fs.writeFileSync(featuredFile, JSON.stringify({ id: null }), "utf8");
  }
}

type FeaturedPayload = {
  id: string | null;
};

export function readFeaturedGalleryId(): string | null {
  try {
    ensureFile();
    const raw = fs.readFileSync(featuredFile, "utf8");
    const parsed = JSON.parse(raw) as FeaturedPayload;
    return parsed?.id ?? null;
  } catch {
    return null;
  }
}

export async function writeFeaturedGalleryId(id: string | null) {
  ensureDir();
  const content = `${JSON.stringify({ id }, null, 2)}\n`;
  if (isAdminRepoStorageEnabled()) {
    await writeRepoFile("data/gallery/featured.json", content, "Update featured gallery item");
    return;
  }
  fs.writeFileSync(featuredFile, content, "utf8");
}
