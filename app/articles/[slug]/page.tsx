import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import ArticlePageClient from "./ArticlePageClient";

/* ---------------- TYPES ---------------- */

type PageProps = {
  params: {
    slug: string;
  };
};

type ArticleMeta = {
  title: string;
  link: string;
  date: string;
};

/* ---------------- HELPERS ---------------- */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * 2026 Optimized Read Time Calculation
 * Uses 225 WPM as the industry standard for online articles.
 */
function calculateReadTime(text: string) {
  const wordsPerMinute = 225; 
  // Strip common markdown characters to get a cleaner word count
  const cleanText = text.replace(/[#*`_\[\]()]/g, "");
  const wordCount = cleanText.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/* ---------------- PAGE ---------------- */

export default async function ArticlePage({ params }: PageProps) {
  // Await params in Next.js 15+ environments
  const { slug } = await params;

  const articlesDir = path.join(process.cwd(), "content/articles");
  const filePath = path.join(articlesDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  /* ---- Current article ---- */
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const contentHtml = (await remark().use(html).process(content)).toString();
  const formattedDate = formatDate(data.date);
  
  // Calculate read time from the raw markdown content
  const readTimeLabel = calculateReadTime(content);

  /* ---- All articles (for navigation) ---- */
  const allArticles: ArticleMeta[] = fs
    .readdirSync(articlesDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const articleContent = fs.readFileSync(
        path.join(articlesDir, file),
        "utf8"
      );
      const { data } = matter(articleContent);

      return {
        title: data.title,
        link: `/articles/${file.replace(".md", "")}`,
        date: data.date, // Pass raw date for sorting
      };
    })
    .sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const currentIndex = allArticles.findIndex(
    (a) => a.link === `/articles/${slug}`
  );

  const prevArticle = allArticles[currentIndex + 1] || undefined;
  const nextArticle = allArticles[currentIndex - 1] || undefined;

  const siteUrl = "https://www.sridharprakash.in";
  const articleUrl = `${siteUrl}/articles/${slug}`;

  /* ---- Render ---- */
  return (
    <ArticlePageClient
      title={data.title}
      summary={data.summary}
      date={formattedDate}
      readTime={readTimeLabel} // New prop passed to client
      contentHtml={contentHtml}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
      url={articleUrl}
    />
  );
}
