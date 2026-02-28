/* ---------------- ARTICLE TYPES ---------------- */

// app/articles/types.ts

/**
 * ArticleStatus defines the editorial state of a markdown entry.
 */
export type ArticleStatus = "draft" | "published";

/**
 * ArticleMeta defines the core structure for article data.
 * Used for lists, thumbnails, and SEO metadata.
 */
export type ArticleMeta = {
  id: number;                                       // Numeric ID for routing
  type: "video" | "audio" | "text" | "article";     // Supported media types
  title: string;
  summary: string;                                  // Brief excerpt/quote
  date: string;                                     // Publication date (e.g., "Jan 24, 2026")
  slug: string;                                     // URL-friendly title
  readTime?: string;                                // Optional read/watch duration
  img: string;                                      // Thumbnail/Cover image path
  videoUrl: string;                                 // Media source URL (YouTube/MP3)
  voiceUrl: string;                                 // Linked audio/voice resource
  category: "journal" | "video" | "voice";
  status: ArticleStatus;
  content?: string;                                 // Long-form HTML content for text articles
  quotes?: string[];                                // Ã¢Å“Å¡ NEW: Collection of notable quotes for the detail page
  updatedAt: string;                                // Filesystem modification timestamp (ISO 8601)
  updatedAtLabel?: string;                          // Pre-computed readable label for the timestamp
};

/**
 * The main Article interface used across the app.
 * Extends Meta to include category and author.
 */
export interface Article extends ArticleMeta {
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
  quotes?: string[];                  // Ã¢Å“Å¡ NEW: Added to props for data passing
  updatedAt?: string;
  prevArticle?: ArticleMeta;
  nextArticle?: ArticleMeta;
}

