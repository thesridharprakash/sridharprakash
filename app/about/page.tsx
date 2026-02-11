"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLongRightIcon,
  Cog6ToothIcon,
  FireIcon,
  MapPinIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const storyFacts = [
  { label: "Born", value: "1991" },
  { label: "City", value: "Bengaluru, Karnataka" },
  { label: "Path", value: "Unscripted" },
  { label: "Chapter", value: "Nomad Beginning" },
];

const journeySteps = [
  {
    title: "Roots",
    text: "Born in Bengaluru in 1991, where crowded roads and changing skies taught me to observe everything.",
    icon: MapPinIcon,
  },
  {
    title: "No template",
    text: "I never followed the usual work script. No office ladder, no polished plan, no borrowed identity.",
    icon: Cog6ToothIcon,
  },
  {
    title: "Open road",
    text: "Now I begin a nomad journey to explore, create, and respond to life exactly as it arrives.",
    icon: FireIcon,
  },
];

const manifesto = [
  "I choose movement over comfort.",
  "I choose stories over status.",
  "I choose honesty over performance.",
  "I choose life as it is, not life as it should look.",
];

const timeline = [
  { phase: "Now", text: "Beginning from zero with full commitment." },
  { phase: "Next", text: "Traveling city to city and documenting real moments." },
  { phase: "Then", text: "Building a body of work that feels raw, human, and alive." },
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
              className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-100 md:left-6 md:top-6"
            >
              Story Film | Chapter 01
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">The Story</p>
              <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white md:text-7xl">
                Born in Bengaluru, 1991.
                <br />
                Starting late, but finally starting true.
              </h1>
              <p className="mt-5 max-w-3xl text-sm text-slate-200 md:text-lg">
                I have not worked in life till now in the usual way. I am about to begin a nomad journey and let the road
                shape me. I want to live fully, explore deeply, and create from whatever life throws at me.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-strong)]"
                >
                  Travel With Me
                  <ArrowLongRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/media"
                  className="rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
                >
                  Watch Visual Journal
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
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-white md:text-4xl">Journey Markers</h2>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            <SparklesIcon className="h-4 w-4" />
            Visual Storyline
          </p>
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

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/15 bg-[linear-gradient(130deg,rgba(15,23,42,0.92),rgba(30,41,59,0.88))] p-8 md:p-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Manifesto</p>
          <p className="mt-4 max-w-4xl font-display text-3xl leading-tight text-white md:text-5xl">
            I am not behind.
            <br />
            I am becoming, on my own timing.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {manifesto.map((line) => (
              <p key={line} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-white md:text-4xl">Now, Next, Then</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Path In Motion</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {timeline.map((item, idx) => (
            <motion.article
              key={item.phase}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{item.phase}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
