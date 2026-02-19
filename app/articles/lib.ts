import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArticleMeta } from "./types/types";

const articlesDir = path.join(process.cwd(), "content/articles");

type ArticleDetail = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  img: string;
  content: string;
  readTime: string;
};

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  return files
    .map((file, index) => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      const words = content.split(/\s+/).length;
      const readTime = `${Math.ceil(words / 225)} min read`;

      return {
        id: Number(data.id ?? index + 1),
        type: "article" as const,
        title: String(data.title ?? "Untitled"),
        summary: String(data.summary ?? ""),
        date: String(data.date ?? ""),
        slug: file.replace(/\.md$/, ""),
        readTime,
        img: String(data.img ?? "/images/og-image.jpg"),
        videoUrl: String(data.videoUrl ?? ""),
      };
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getArticleBySlug(slug: string) {
  const filePath = path.join(articlesDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const words = content.split(/\s+/).length;
  const readTime = `${Math.ceil(words / 225)} min read`;

  const detail: ArticleDetail = {
    slug,
    title: String(data.title ?? "Untitled"),
    summary: String(data.summary ?? ""),
    date: String(data.date ?? ""),
    img: String(data.img ?? "/images/og-image.jpg"),
    content,
    readTime,
  };

  return detail;
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return [];

  return fs
    .readdirSync(articlesDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}
