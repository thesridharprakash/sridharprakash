import fs from "fs";
import path from "path";
import { isAdminRepoStorageEnabled, writeRepoFile } from "@/lib/adminRepoStorage";

const pagesDir = path.join(process.cwd(), "data/pages");

function resolvePagePath(slug: string) {
  return path.join(pagesDir, `${slug}.json`);
}

export function readPageContent<T = unknown>(slug: string): T {
  const filePath = resolvePagePath(slug);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Page data missing: ${slug}`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writePageContent(slug: string, payload: unknown) {
  const filePath = resolvePagePath(slug);
  const content = `${JSON.stringify(payload, null, 2)}\n`;
  if (isAdminRepoStorageEnabled()) {
    await writeRepoFile(`data/pages/${slug}.json`, content, `Update ${slug} page content`);
    return;
  }
  fs.writeFileSync(filePath, content);
}
