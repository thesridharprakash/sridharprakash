"use client";

import Link from "next/link";
import { ArticleMeta } from "./types/types";

type Props = {
  articles: ArticleMeta[];
};

export default function ArticlesClient({ articles }: Props) {
  if (articles.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No articles published yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/articles/${article.slug}`}
          className="block relative rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-lg hover:-translate-y-1"
        >
          {/* Accent bar (same as Events) */}
          <div className="absolute left-0 top-0 h-full w-1 bg-orange-600 rounded-l-xl" />

          <div className="pl-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              {article.title}
            </h3>

            <p className="mt-2 text-sm md:text-base text-gray-600">
              {article.summary}
            </p>

            <p className="mt-4 text-xs text-gray-500">
              {article.date} • {article.readTime}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
