"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Article = {
  slug: string;
  title: string;
  summary: string;
  date: string;
};

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
            Articles & Reflections
          </h1>

          <div className="w-16 h-1 bg-orange-600 mx-auto my-6" />

          <p className="text-gray-600">
            Thoughts on public service, governance, leadership, and grassroots development.
          </p>
        </motion.div>

        {/* ================= ARTICLES LIST ================= */}
        <section className="mt-16 space-y-6">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative rounded-xl border border-gray-200 bg-white p-6
                         hover:shadow-lg hover:-translate-y-1 transition"
            >
              {/* Accent bar (same as Events) */}
              <div className="absolute left-0 top-0 h-full w-1 bg-orange-600 rounded-l-xl" />

              <div className="pl-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  {article.title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {article.date}
                </p>

                <p className="mt-3 text-gray-700">
                  {article.summary}
                </p>

                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-block mt-4 text-orange-600 font-medium hover:underline"
                >
                  Read full article →
                </Link>
              </div>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}
