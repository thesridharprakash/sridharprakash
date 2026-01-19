"use client";

import { useState, useLayoutEffect } from "react";
import ArticleShareButtons from "../ArticleShareButtons";
import StickyShareButtons from "../StickyShareButtons";
import ReadingProgressBar from "./ReadingProgressBar";
import FloatingTOC from "./FloatingTOC";
import MobileTOC from "./MobileTOC";

type ArticleMeta = {
  title: string;
  slug: string;
};

type Props = {
  title: string;
  summary: string;
  date: string;
  readTime: string;
  contentHtml: string;
  prevArticle: ArticleMeta | null;
  nextArticle: ArticleMeta | null;
  url: string;
};

type Heading = {
  id: string;
  text: string;
};

export default function ArticlePageClient({
  title,
  summary,
  date,
  readTime,
  contentHtml,
  prevArticle,
  nextArticle,
  url,
}: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Collect headings safely after DOM mounts
  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    const els = Array.from(
      document.querySelectorAll("article h2, article h3")
    ) as HTMLHeadingElement[];

    const mapped = els.map((el, index) => ({
      id: el.id || `heading-${index}`,
      text: el.innerText,
    }));

    // ✅ Avoid cascading renders warning
    requestAnimationFrame(() => setHeadings(mapped));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0.1 }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Sticky Share Buttons */}
        <StickyShareButtons url={url} title={title} />

        {/* TOCs */}
        {headings.length > 0 && (
          <>
            <FloatingTOC headings={headings} activeId={activeId} />
            <MobileTOC headings={headings} activeId={activeId} />
          </>
        )}

        {/* Article Content */}
        <article className="prose lg:prose-xl mx-auto py-16">
          <h1>{title}</h1>

          {/* ✅ Summary now used */}
          <p className="text-lg text-gray-600 mt-2 mb-4">{summary}</p>

          <p className="text-sm text-gray-500 mb-8">
            {date} • ⏱️ {readTime} min read
          </p>

          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>

        {/* Share Buttons */}
        <ArticleShareButtons url={url} title={title} />

        {/* Prev / Next Navigation */}
        <div className="flex justify-between py-10">
          {prevArticle ? (
            <a
              href={`/articles/${prevArticle.slug}`}
              className="text-blue-600 hover:underline"
            >
              ← {prevArticle.title}
            </a>
          ) : <span />}

          {nextArticle && (
            <a
              href={`/articles/${nextArticle.slug}`}
              className="text-blue-600 hover:underline"
            >
              {nextArticle.title} →
            </a>
          )}
        </div>
      </div>
    </>
  );
}
