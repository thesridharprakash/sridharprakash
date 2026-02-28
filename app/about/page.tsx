"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLongRightIcon, Cog6ToothIcon, FireIcon, MapPinIcon } from "@heroicons/react/24/outline";

const storyFacts = [
  { label: "Born", value: "1991" },
  { label: "City", value: "Bengaluru, Karnataka" },
  { label: "Path", value: "On-Ground Storytelling" },
  { label: "Chapter", value: "Political + IRL Coverage" },
];

const journeySteps = [
  {
    title: "Roots",
    text: "Born in Bengaluru in 1991, where crowded roads and changing skies taught me to observe everything.",
    icon: MapPinIcon,
  },
  {
    title: "Creator focus",
    text: "I create content around real people and public spaces, with an approach built on consistency and trust.",
    icon: Cog6ToothIcon,
  },
  {
    title: "Current mission",
    text: "I am actively covering political campaigns on the ground while continuing travel, IRL, and social media projects.",
    icon: FireIcon,
  },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden pt-24 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(245,158,11,0.16),transparent_32%),radial-gradient(circle_at_12%_78%,rgba(56,189,248,0.16),transparent_38%)]" />

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-black/30"
        >
          <div className="relative min-h-[560px] md:min-h-[620px]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a,#111827)]" />
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/story-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.9))]" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="absolute right-4 top-4 z-20 whitespace-nowrap rounded-full border border-white/20 bg-black/35 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-100 md:right-6 md:top-6 md:px-4"
            >
              Story Film | Current Chapter
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pt-40 md:p-10 md:pt-24 lg:pt-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">The Story</p>
              <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white md:text-7xl">
                Born in Bengaluru, 1991.
                <br />
                Chilling, chasing storylines, and building a life worth filming.
              </h1>
              <p className="mt-5 max-w-3xl text-sm text-slate-200 md:text-lg">
                I’m just a guy wandering cityscapes, capturing curious people, and turning those moments into loud, honest stories that feel like a late-night chat with friends.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/volunteer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[var(--accent-strong)]"
                >
                  Hangout & collab
                  <ArrowLongRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/press"
                  className="rounded-full border border-white/35 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur transition hover:border-white"
                >
                  See what I’ve been up to
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {storyFacts.map((item, idx) => (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Search profile</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Sridhar Prakash</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Full name</p>
              <p className="mt-2 text-sm font-semibold text-white">Sridhar Prakash</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">What I do</p>
              <p className="mt-2 text-sm font-semibold text-white">
                Creator focused on political campaign coverage, field reports, travel stories, and IRL content.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">City / State</p>
              <p className="mt-2 text-sm font-semibold text-white">Bengaluru, Karnataka</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-white md:text-4xl">Journey Markers</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Creator Storyline</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {journeySteps.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-6 transition hover:border-[var(--accent)]/50"
            >
              <item.icon className="h-7 w-7 text-[var(--accent)]" />
              <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-white/15 bg-[linear-gradient(130deg,rgba(15,23,42,0.92),rgba(30,41,59,0.88))] p-8 md:p-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Approach</p>
          <p className="mt-4 max-w-3xl text-xl text-slate-200 md:text-2xl">
            I’m just here to vibe, chase sunsets, and capture the voices that make every city feel alive. Bring your idea or your curiosity—I’ll turn it into something loud and true.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Life log</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Today</p>
              <p className="mt-2 font-semibold text-white">Coffee, chai, and a spontaneous drive out of the city.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Tonight</p>
              <p className="mt-2 font-semibold text-white">Editing ambient sound reels while the streetlights hum.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Tomorrow</p>
              <p className="mt-2 font-semibold text-white">Drop a new voice story and see who swings by with a fresh idea.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
