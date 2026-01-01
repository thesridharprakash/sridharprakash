import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const filePath = path.join(articlesDirectory, `${params.slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
          {data.title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">{data.date}</p>

        <div className="prose prose-gray mt-8 max-w-none">
          {content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
