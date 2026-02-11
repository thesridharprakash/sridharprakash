"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpenIcon,
  MicrophoneIcon,
  PlayCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { allArticles } from "../../constants/articles";

const contentTypes = [
  { id: "all", label: "All Entries" },
  { id: "article", label: "Writing" },
  { id: "video", label: "Video Logs" },
  { id: "audio", label: "Voice Notes" },
];

const typeStyles: Record<string, string> = {
  article: "bg-sky-400/15 text-sky-200 border-sky-300/25",
  video: "bg-amber-400/15 text-amber-200 border-amber-300/25",
  audio: "bg-emerald-400/15 text-emerald-200 border-emerald-300/25",
};

function TypeIcon({ type }: { type: string }) {
  if (type === "video") return <PlayCircleIcon className="h-4 w-4" />;
  if (type === "audio") return <MicrophoneIcon className="h-4 w-4" />;
  return <BookOpenIcon className="h-4 w-4" />;
}

export default function ArticlesPage() {
  const [filter, setFilter] = useState("all");

  const filteredArticles = useMemo(
    () => allArticles.filter((art) => filter === "all" || art.type === filter),
    [filter]
  );

  return (
    <main className="relative overflow-hidden pt-28 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_12%,rgba(245,158,11,0.16),transparent_32%),radial-gradient(circle_at_12%_84%,rgba(56,189,248,0.14),transparent_35%)]" />

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            <SparklesIcon className="h-4 w-4" />
            Journal
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">
            Notes from the road,
            <br />
            before and after day one.
          </h1>
          <p className="mt-5 max-w-3xl text-sm text-slate-300 md:text-lg">
            This is my personal journal. Raw thoughts, travel logs, video drops, and voice notes from a life that is finally
            moving.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  filter === t.id
                    ? "bg-white text-slate-900"
                    : "border border-white/10 bg-black/20 text-slate-300 hover:border-white/25"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((art, idx) => (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <Link
                href={`/articles/${art.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/25 transition hover:border-[var(--accent)]/45"
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
                    className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      typeStyles[art.type] || "bg-white/15 text-white border-white/30"
                    }`}
                  >
                    <TypeIcon type={art.type} />
                    {art.type}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">{art.date}</p>
                  <h2 className="mt-3 font-display text-2xl leading-tight text-white transition group-hover:text-[var(--accent)]">
                    {art.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-300">{art.summary}</p>
                  <div className="mt-5 border-t border-white/10 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300 group-hover:text-white">
                    Open Journal Entry
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
