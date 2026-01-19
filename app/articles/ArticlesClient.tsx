"use client";

import Link from "next/link";

type Article = {
  title: string;
  summary: string;
  date: string;
  slug: string;
};

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900">
          Articles & Reflections
        </h1>

        <div className="w-16 h-1 bg-orange-600 mx-auto my-6"></div>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-14">
          Reflections on public service, governance, leadership, and development.
        </p>

        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article.slug}
              className="relative rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-orange-600 rounded-l-xl"></div>

              <div className="pl-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {article.title}
                </h3>

                <p className="mt-2 text-sm md:text-base text-gray-600">
                  {article.summary}
                </p>

                <p className="mt-3 text-xs text-gray-500">{article.date}</p>

                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-block mt-4 text-orange-600 font-medium hover:underline"
                >
                  Read full article →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
