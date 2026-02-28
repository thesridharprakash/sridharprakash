import type { MetadataRoute } from "next";
import { getAllArticles } from "@/app/articles/lib";
import { readGalleryPosts } from "@/lib/galleryPosts";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.sridharprakash.in";

function absolute(path: string) {
  return `${siteUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absolute("/"), changeFrequency: "weekly", priority: 1 },
    { url: absolute("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absolute("/articles"), changeFrequency: "daily", priority: 0.9 },
    { url: absolute("/gallery"), changeFrequency: "weekly", priority: 0.8 },
    { url: absolute("/events"), changeFrequency: "daily", priority: 0.8 },
    { url: absolute("/press"), changeFrequency: "monthly", priority: 0.7 },
    { url: absolute("/book"), changeFrequency: "monthly", priority: 0.6 },
    { url: absolute("/contact"), changeFrequency: "monthly", priority: 0.6 },
    { url: absolute("/volunteer"), changeFrequency: "monthly", priority: 0.6 },
    { url: absolute("/impact"), changeFrequency: "monthly", priority: 0.5 },
    { url: absolute("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absolute("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: absolute(`/articles/${article.slug}`),
    lastModified: article.updatedAt || article.date || undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const galleryRoutes: MetadataRoute.Sitemap = readGalleryPosts().map((post) => ({
    url: absolute(`/gallery/${post.id}`),
    lastModified: post.date || undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...galleryRoutes];
}
