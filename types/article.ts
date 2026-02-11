// types/article.ts
export type Article = {
  id: number;           // Numeric ID for routing
  type: "video" | "audio" | "article" | "quote" | "text"; // Added 'text' for flexibility
  title: string;
  slug: string;         // For SEO friendly URLs
  summary: string;      // Maps to your 'desc'
  date: string;
  category: string;     // e.g., "Governance"
  author: string;       // e.g., "Sridhar Prakash"
  img: string;          // Thumbnail path
  videoUrl?: string;    // Optional, only for video types
  content?: string;     // ✅ ADDED THIS: For long-form text articles
};
