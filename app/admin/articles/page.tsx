import ArticlesIndexClient from "@/app/admin/articles/ArticlesIndexClient";
import { getAllArticles } from "@/app/articles/lib";

export default function AdminArticlesPage() {
  const entries = getAllArticles({ includeDrafts: true });

  return (
    <main className="min-h-screen bg-black/80 pb-20 pt-24 text-white">
      <section className="mx-auto max-w-5xl space-y-6 px-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin</p>
          <h1 className="text-4xl font-semibold">Manage Articles</h1>
          <p className="text-sm text-slate-300">
            Track every published article, flag drafts, preview markdown, and jump into the editor.
          </p>
        </header>
        <ArticlesIndexClient articles={entries} />
      </section>
    </main>
  );
}
