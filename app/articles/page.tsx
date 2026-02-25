import Image from "next/image";
import Link from "next/link";
import {
  BookOpenIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import ShareButton from "@/components/ShareButton";
import { getAllArticles } from "./lib";

export default function ArticlesPage() {
  const articles = getAllArticles();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.sridharprakash.in";

  return (
    <main className="relative overflow-hidden pt-28 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_12%,rgba(245,158,11,0.16),transparent_32%),radial-gradient(circle_at_12%_84%,rgba(56,189,248,0.14),transparent_35%)]" />

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-8">
        <div className="max-w-4xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            <SparklesIcon className="h-4 w-4" />
            Field Journal
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">
            Ground reports, campaign notes,
            <br />
            and creator updates.
          </h1>
          <p className="mt-5 max-w-3xl text-sm text-slate-300 md:text-lg">
            This journal tracks my political coverage, on-ground public conversations, travel logs, and social media experiments.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            No entries yet. Add a markdown file to `content/articles/*.md` to publish your first field note.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((art) => (
              <article key={art.slug} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 transition hover:border-[var(--accent)]/45">
                <Link
                  href={`/articles/${art.slug}`}
                  className="flex h-full flex-col"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={art.img || "/images/og-image.jpg"}
                      alt={art.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div
                      className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-sky-300/25 bg-sky-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200"
                    >
                      <BookOpenIcon className="h-4 w-4" />
                      article
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 pr-14">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">{art.date}</p>
                    <h2 className="mt-3 font-display text-2xl leading-tight text-white transition group-hover:text-[var(--accent)]">
                      {art.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm text-slate-300">{art.summary}</p>
                    <div className="mt-5 border-t border-white/10 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300 group-hover:text-white">
                      Open Field Note
                    </div>
                  </div>
                </Link>
                <div className="absolute bottom-4 right-4">
                  <ShareButton
                    title={art.title}
                    description={art.summary}
                    url={`${baseUrl}/articles/${art.slug}`}
                    iconOnly
                    ariaLabel={`Share ${art.title}`}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
