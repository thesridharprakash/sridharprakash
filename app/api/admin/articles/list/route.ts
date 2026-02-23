import { NextResponse } from "next/server";
import { getAllArticles } from "@/app/articles/lib";
import { adminLog } from "@/lib/adminLogger";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {

  const entries = getAllArticles({ includeDrafts: true }).map((article) => ({
    title: article.title,
    slug: article.slug,
    date: article.date,
    summary: article.summary,
    readTime: article.readTime,
    img: article.img,
    category: article.category,
    status: article.status,
  }));
  adminLog("article-list-fetched", { count: entries.length });
  return NextResponse.json({ ok: true, entries });
}
