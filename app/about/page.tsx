"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLongRightIcon, FireIcon } from "@heroicons/react/24/outline";

const storyFacts = [
  { label: "Name", value: "Sridhar Prakash" },
  { label: "Base", value: "Bengaluru, Karnataka" },
  { label: "Area", value: "Byatarayanapura" },
  { label: "Focus", value: "Seva, Youth & Community" },
];

const journeySteps = [
  {
    title: "Vaktha - Prashikshan Mahabhiyan 2026",
    text: "Trained karyakartas on social media, AI tools, NaMo App, and Saral App for effective digital engagement.",
  },
  {
    title: "BLA 2 - Booth 323, Doddabommasandra",
    text: "Managed voter verification and electoral roll updates while supporting booth-level coordination with the Election Commission of India.",
  },
  {
    title: "Yuva Morcha President - Doddabommasandra",
    text: "Led youth engagement, organizational activities, and grassroots campaigns.",
  },
];

const yuvaMorchaPrinciples = [
  "Youth participation rooted in public service.",
  "Local action guided by discipline, teamwork, and accountability.",
  "Community outreach that keeps people informed and involved.",
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
            <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline>
              <source src="/videos/story-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.9))]" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="absolute right-4 top-4 z-20 whitespace-nowrap rounded-full border border-white/20 bg-black/35 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-100 md:right-6 md:top-6 md:px-4"
            >
              Public Service | Current Chapter
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 z-10 p-5 pt-36 md:p-9 md:pt-24 lg:pt-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">The Story</p>
              <h1 className="mt-3 max-w-4xl font-display text-3xl leading-tight text-white sm:text-4xl md:text-6xl">
                Sridhar Prakash.
                <br />
                Rooted in service, community, and responsible public leadership.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-200 md:text-base md:leading-7">
                A public-service focused platform for community updates, local concerns, youth participation, and direct connection with people in Bengaluru.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-[var(--accent-strong)] md:px-6 md:tracking-[0.22em]"
                >
                  Contact
                  <ArrowLongRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/yuva-morcha"
                  className="rounded-full border border-[var(--accent)]/70 bg-[var(--accent)]/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)] backdrop-blur transition hover:border-[var(--accent)] hover:bg-[var(--accent)]/25 md:px-6 md:tracking-[0.22em]"
                >
                  Yuva Morcha
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
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Short Bio</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">A public-service voice rooted in Bengaluru.</h2>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300 md:text-base">
            Sridhar Prakash works around Byatarayanapura and Bengaluru North with a focus on seva, youth participation, and community connection. His approach is direct and people-first: stay accessible, listen carefully, follow up on local concerns, and keep residents informed through consistent public work.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-white md:text-4xl">Journey Markers</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Public Service Path</p>
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
              <FireIcon className="h-7 w-7 text-[var(--accent)]" />
              <h3 className="mt-4 break-words text-xl font-semibold leading-tight text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-white/15 bg-[linear-gradient(130deg,rgba(15,23,42,0.92),rgba(30,41,59,0.88))] p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Approach</p>
          <p className="mt-4 max-w-4xl font-display text-2xl leading-tight text-slate-100 md:text-3xl">
            Guided by Antyodaya and Nation First, Sridhar Prakash believes public work should reach the last person and stay accountable to people.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Yuva Morcha Connection</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Building youth participation through service.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            The BJP Yuva Morcha team focuses on bringing young people into constructive community action, public outreach, and responsible local leadership.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {yuvaMorchaPrinciples.map((item) => (
              <article key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold leading-6 text-slate-100">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Focus Areas</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Service</p>
              <p className="mt-2 font-semibold text-white">Supporting public concerns with discipline, follow-through, and direct communication.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Youth</p>
              <p className="mt-2 font-semibold text-white">Encouraging young people to participate in community work and civic life.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Connection</p>
              <p className="mt-2 font-semibold text-white">Keeping residents informed through updates, events, and accessible communication.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
