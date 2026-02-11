/* ---------------- ARTICLE TYPES ---------------- */

// app/articles/types.ts

/**
 * ArticleMeta defines the core structure for article data.
 * Used for lists, thumbnails, and SEO metadata.
 */
export type ArticleMeta = {
  id: number;                         // Numeric ID for routing
  type: "video" | "audio" | "text" | "article"; // Supported media types
  title: string;
  summary: string;                    // Brief excerpt/quote
  date: string;                       // Publication date (e.g., "Jan 24, 2026")
  slug: string;                       // URL-friendly title
  readTime?: string;                  // Optional read/watch duration
  img: string;                        // Thumbnail/Cover image path
  videoUrl: string;                   // Media source URL (YouTube/MP3)
  content?: string;                   // Long-form HTML content for text articles
  quotes?: string[];                  // ✅ NEW: Collection of notable quotes for the detail page
};

/**
 * The main Article interface used across the app.
 * Extends Meta to include category and author.
 */
export interface Article extends ArticleMeta {
  category: string;
  author: string;
}

export type Heading = {
  id: string;
  text: string;
  level: number;
};

/* ---------------- ARTICLE PAGE PROPS ---------------- */

/**
 * Props passed to the Article Detail page component.
 */
export interface ArticleProps {
  id: number;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  contentHtml: string;
  url: string;
  author: string;
  quotes?: string[];                  // ✅ NEW: Added to props for data passing
  prevArticle?: ArticleMeta;
  nextArticle?: ArticleMeta;
}
