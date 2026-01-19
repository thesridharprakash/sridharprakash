import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ArticlesClient from "./ArticlesClient";

export const metadata = {
  title: "Articles | Sridhar Prakash",
  description:
    "Articles and reflections on public service, governance, and nation-first development.",
};

export default function ArticlesPage() {
  const articlesDir = path.join(process.cwd(), "content/articles");
  const files = fs.existsSync(articlesDir) ? fs.readdirSync(articlesDir) : [];

  const articles = files
    .map((file) => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      return {
        title: data.title,
        summary: data.summary,
        date: typeof data.date === "string"
          ? data.date
          : new Date(data.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
        slug: file.replace(".md", ""),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return <ArticlesClient articles={articles} />;
}
