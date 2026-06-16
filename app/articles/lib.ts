import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArticleMeta, ArticleStatus } from "./types/types";

const articlesDir = path.join(process.cwd(), "content/articles");
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatUpdatedAtLabel(iso: string) {
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return "Unknown";
  const date = new Date(parsed);
  const day = pad(date.getUTCDate());
  const month = MONTH_ABBR[date.getUTCMonth()] ?? "Unknown";
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  return `${day} ${month}, ${hours}:${minutes} UTC`;
}

type GetAllArticlesOptions = {
  includeDrafts?: boolean;
};

type ArticleDetail = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  img: string;
  content: string;
  readTime: string;
  videoUrl: string;
  voiceUrl: string;
  category: "journal" | "video" | "voice";
  status: ArticleStatus;
  updatedAt: string;
  updatedAtLabel: string;
};

function resolveStatus(input?: unknown): ArticleStatus {
  const normalized = String(input ?? "published").toLowerCase();
  return normalized === "draft" ? "draft" : "published";
}

export function getAllArticles(options: GetAllArticlesOptions = {}): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  const entries = files.map((file, index) => {
    const filePath = path.join(articlesDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    const words = content.split(/\s+/).length;
    const readTime = `${Math.ceil(words / 225)} min read`;
    const status = resolveStatus(data.status);
    const updatedAt = fs.statSync(filePath).mtime.toISOString();
    const category = (String(data.category ?? "journal") as ArticleMeta["category"]) ?? "journal";
    const rawImg = String(data.img ?? "").trim();
    const fallbackImg = category === "journal" ? "/images/og-image.jpg" : "";
    const image = rawImg || fallbackImg;
    const updatedAtLabel = formatUpdatedAtLabel(updatedAt);

    return {
      id: Number(data.id ?? index + 1),
      type: "article" as const,
      title: String(data.title ?? "Untitled"),
      summary: String(data.summary ?? ""),
      date: String(data.date ?? ""),
      slug: file.replace(/\.md$/, ""),
      readTime,
      img: image,
      videoUrl: String(data.videoUrl ?? ""),
      voiceUrl: String(data.voiceUrl ?? ""),
      category,
      status,
      updatedAt,
      updatedAtLabel,
    };
  });

  const filtered = entries.filter((article) => options.includeDrafts || article.status !== "draft");

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): ArticleDetail | null {
  const filePath = path.join(articlesDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const words = content.split(/\s+/).length;
  const readTime = `${Math.ceil(words / 225)} min read`;
  const status = resolveStatus(data.status);
  const updatedAt = fs.statSync(filePath).mtime.toISOString();
  const category = (String(data.category ?? "journal") as ArticleDetail["category"]) ?? "journal";
  const rawImg = String(data.img ?? "").trim();
  const fallbackImg = category === "journal" ? "/images/og-image.jpg" : "";
  const image = rawImg || fallbackImg;
  const updatedAtLabel = formatUpdatedAtLabel(updatedAt);

  const detail: ArticleDetail = {
    slug,
    title: String(data.title ?? "Untitled"),
    summary: String(data.summary ?? ""),
    date: String(data.date ?? ""),
    img: image,
    content,
    readTime,
    videoUrl: String(data.videoUrl ?? ""),
    voiceUrl: String(data.voiceUrl ?? ""),
    category,
    status,
    updatedAt,
    updatedAtLabel,
  };

  return detail;
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles().map((article) => article.slug);
}
