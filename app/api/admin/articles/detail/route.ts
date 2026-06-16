import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/app/articles/lib";
import { adminLog } from "@/lib/adminLogger";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    adminLog("article-detail-missing-slug");
    return NextResponse.json({ error: "Missing slug query." }, { status: 400 });
  }

  const article = getArticleBySlug(slug);
  if (!article) {
    adminLog("article-detail-missing", { slug });
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  adminLog("article-detail-fetched", { slug });
  return NextResponse.json({
    ok: true,
    article: {
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      date: article.date,
      img: article.img,
      videoUrl: article.videoUrl || "",
      voiceUrl: article.voiceUrl || "",
      category: article.category,
      status: article.status,
      updatedAt: article.updatedAt,
      updatedAtLabel: article.updatedAtLabel,
      content: article.content,
    },
  });
}
