"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const featuredSeries = [
  {
    title: "Campaign Trail Diaries",
    type: "Political Coverage Series",
    image: "/images/img1.jpg",
    description: "On-ground political campaign moments, local voices, and rally-day storytelling.",
  },
  {
    title: "City Voices: Election Season",
    type: "IRL Public Conversation",
    image: "/images/img2.png",
    description: "Street interviews and city-level political pulse captured in short and long formats.",
  },
  {
    title: "Road + Report",
    type: "Travel and Ground Report",
    image: "/images/img3.jpg",
    description: "Travel vlogging blended with on-location political updates and audience engagement.",
  },
];

const mediaKit = [
  { label: "Primary Formats", value: "Reels, Shorts, Long-form" },
  { label: "Content Focus", value: "Politics, Campaigns, Travel, IRL" },
  { label: "Delivery Speed", value: "Draft in 48-72 hours" },
  { label: "Audience Mix", value: "Politically Active Youth + General Audience" },
];

const deliverables = [
  "Political campaign reels and short-form social edits",
  "IRL streams and on-ground campaign event coverage",
  "Travel vlog integration with public-interest storytelling",
  "Photo + thumbnail package for promotion rollouts",
];

export default function MediaPage() {
  return (
    <main className="relative overflow-hidden pt-28 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_12%,rgba(245,158,11,0.14),transparent_30%),radial-gradient(circle_at_12%_82%,rgba(56,189,248,0.14),transparent_35%)]" />

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Media Portfolio</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">
            Campaign-ready creator content with energy, personality, and strong retention.
          </h1>
          <p className="mt-6 max-w-3xl text-base text-slate-300 md:text-lg">
            This page features work across political campaign coverage, IRL field storytelling, and travel content built for audience attention and measurable impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/media-kit.pdf"
              download
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-strong)]"
            >
              Download 1-Page Media Kit (PDF)
            </a>
            <Link
              href="/book"
              className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              Start a Collaboration
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-4 md:grid-cols-4">
          {mediaKit.map((item, index) => (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.07, duration: 0.45 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-white md:text-4xl">Featured Series</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Recent Work</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredSeries.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{item.type}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-white md:text-4xl">Open to Partnerships</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Let&apos;s Collaborate</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <p className="text-base text-slate-200 md:text-lg">
            I am currently open to collaborations with political campaign teams, public-interest initiatives, and brands that need on-ground storytelling. If
            you are looking for fast, audience-first content with strong retention, let&apos;s build something together.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2">
              Launch-ready deliverables
            </span>
            <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2">
              Flexible creative formats
            </span>
            <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2">
              Rapid turnaround
            </span>
          </div>
          <Link
            href="/book"
            className="mt-6 inline-flex rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
          >
            Start a Collaboration
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.88))] p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Brand Deliverables</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">What you can book</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {deliverables.map((item) => (
              <p key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {item}
              </p>
            ))}
          </div>
          <Link
            href="/book"
            className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Start a Collaboration
          </Link>
        </div>
      </section>
    </main>
  );
}
