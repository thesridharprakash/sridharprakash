import fs from "fs";
import path from "path";

export type GalleryPost = {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  location: string;
  pieces: string;
  date: string;
};

const postsDir = path.join(process.cwd(), "data", "gallery");
const postsFile = path.join(postsDir, "posts.json");

function ensurePostsDir() {
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
}

export function readGalleryPosts(): GalleryPost[] {
  ensurePostsDir();
  if (!fs.existsSync(postsFile)) {
    fs.writeFileSync(postsFile, "[]", "utf8");
  }
  const raw = fs.readFileSync(postsFile, "utf8");
  try {
    const parsed = JSON.parse(raw) as GalleryPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeGalleryPosts(posts: GalleryPost[]) {
  ensurePostsDir();
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf8");
}
