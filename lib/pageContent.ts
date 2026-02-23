import fs from "fs";
import path from "path";

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

export function writePageContent(slug: string, payload: unknown) {
  const filePath = resolvePagePath(slug);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}
