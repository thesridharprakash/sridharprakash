import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const articlesDir = path.join(process.cwd(), "content", "articles");
  const filePath = path.join(articlesDir, `${params.slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
          {data.title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {new Date(data.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="prose prose-lg mt-10 max-w-none">
          {content}
        </div>
      </article>
    </main>
  );
}
