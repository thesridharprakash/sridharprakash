"use client";

import Link from "next/link";
import ArticleShareButtons from "../ArticleShareButtons";
import StickyShareButtons from "../StickyShareButtons";
import ReadingProgress from "./ReadingProgressBar";
import FloatingTOC from "./FloatingTOC";
import MobileTOC from "./MobileTOC";

type Props = {
  title: string;
  summary?: string;
  date: string;
  contentHtml: string;
  prevArticle?: { title: string; link: string };
  nextArticle?: { title: string; link: string };
  url: string;
};

export default function ArticlePageClient({
  title,
  summary,
  date,
  contentHtml,
  prevArticle,
  nextArticle,
  url,
}: Props) {
  return (
    <>
      {/* Reading Progress */}
      <ReadingProgress />

      {/* Sticky Share (Desktop) */}
      <StickyShareButtons title={title} url={url} />

      <main className="bg-white px-6 py-16">
        <article className="max-w-3xl mx-auto relative">
          {/* Floating TOC */}
          <FloatingTOC />

          {/* Mobile TOC */}
          <MobileTOC />

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
            {title}
          </h1>

          {/* Meta */}
          <p className="mt-3 text-sm text-gray-500">
            <time>{date}</time> · ⏱️ min read
          </p>

          {/* Summary */}
          {summary && (
            <p className="mt-6 text-lg text-gray-700 font-medium">
              {summary}
            </p>
          )}

          {/* Divider */}
          <div className="w-16 h-1 bg-orange-600 my-8"></div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-a:text-orange-600"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Prev / Next */}
          <div className="flex justify-between mt-12">
            {prevArticle ? (
              <Link
                href={prevArticle.link}
                className="text-orange-600 hover:underline"
              >
                ← {prevArticle.title}
              </Link>
            ) : (
              <div />
            )}

            {nextArticle ? (
              <Link
                href={nextArticle.link}
                className="text-orange-600 hover:underline"
              >
                {nextArticle.title} →
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Back */}
          <div className="mt-6">
            <Link href="/articles" className="text-blue-900 hover:underline">
              ← Back to All Articles
            </Link>
          </div>

          {/* Bottom Share */}
          <ArticleShareButtons title={title} url={url} />
        </article>
      </main>
    </>
  );
}
