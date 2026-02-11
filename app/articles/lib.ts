import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArticleMeta } from "./types/types";

const articlesDir = path.join(process.cwd(), "content/articles");

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      const words = content.split(/\s+/).length;
      const readTime = `${Math.ceil(words / 225)} min read`;

      return {
        title: String(data.title ?? "Untitled"),
        summary: String(data.summary ?? ""),
        date: String(data.date ?? ""),
        slug: file.replace(/\.md$/, ""),
        readTime,
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

  return {
    title: String(data.title ?? "Untitled"),
    summary: String(data.summary ?? ""),
    date: String(data.date ?? ""),
    content,
    readTime,
  };
}
