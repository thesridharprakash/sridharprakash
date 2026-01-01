import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export const metadata = {
  title: "Articles | Sridhar Prakash",
  description:
    "Articles and reflections on public service, governance, and development.",
};

export default function ArticlesPage() {
  const articlesDir = path.join(process.cwd(), "content/articles");
  const files = fs.readdirSync(articlesDir);

  const articles = files.map((file) => {
    const filePath = path.join(articlesDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);

    return {
  slug: file.replace(".md", ""),
  title: data.title,
  date: new Date(data.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  summary: data.summary,
};

  });

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
          Articles
        </h1>

        <div className="w-16 h-1 bg-orange-600 mx-auto my-6"></div>

        <div className="space-y-8 mt-12">
          {articles.map((article) => (
            <div
              key={article.slug}
              className="border p-6 rounded-lg hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {article.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{article.date}</p>
              <p className="mt-3 text-gray-700">{article.summary}</p>

              <Link
                href={`/articles/${article.slug}`}
                className="inline-block mt-4 text-orange-600 font-medium hover:underline"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
