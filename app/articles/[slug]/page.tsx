import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

type PageProps = {
  params: {
    slug: string;
  };
};

export default function ArticlePage({ params }: PageProps) {
  const articlesDir = path.join(process.cwd(), "content/articles");
  const filePath = path.join(articlesDir, `${params.slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <article className="max-w-3xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-blue-900"
        >
          {data.title}
        </motion.h1>

        <p className="mt-2 text-sm text-gray-500">
          {new Date(data.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg mt-10 max-w-none"
        >
          {content}
        </motion.div>

      </article>
    </main>
  );
}
