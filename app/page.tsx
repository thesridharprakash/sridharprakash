"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTwitch } from "react-icons/fa6";
import { SiKick } from "react-icons/si";
import { socialProfiles } from "@/constants/socials";
import { trackEvent } from "@/lib/analytics";

const storyBeats = [
  {
    title: "New direction",
    body: "I am expanding into political content to connect with politically interested audiences and communities.",
  },
  {
    title: "What I cover",
    body: "Political campaign ground reports, travel vlogs, IRL streams, and day-to-day social media storytelling.",
  },
  {
    title: "Why now",
    body: "This is the right time to build a strong on-ground voice and deliver promotion that feels real and human.",
  },
];

const futurePlans = [
  "On-ground political campaign coverage and field updates.",
  "Social media promotion support for candidates and campaign teams.",
  "Travel and IRL vlogging across cities and political events.",
  "Consistent short-form and long-form content across platforms.",
];

const values = [
  {
    title: "Real over scripted",
    body: "I document what is happening on the ground, not studio-only narratives.",
  },
  {
    title: "Respect every voice",
    body: "People, workers, volunteers, and local communities are represented with dignity.",
  },
  {
    title: "Consistency in public",
    body: "You will see regular updates from campaign trails, travel days, and live interactions.",
  },
];

const timeline = [
  {
    title: "Now",
    body: "Producing political and IRL content while expanding my network.",
  },
  {
    title: "Next 90 days",
    body: "Scaling campaign coverage, collaborations, and platform growth.",
  },
  {
    title: "This year",
    body: "Becoming a trusted creator for political promotion and on-ground storytelling.",
  },
];

const socialIcons = {
  YouTube: FaYoutube,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Twitch: FaTwitch,
  Kick: SiKick,
};

export default function HomePage() {
  function handleCtaClick(label: string) {
    trackEvent("cta_click", { section: "home", label });
  }

  function handleSocialClick(platform: string) {
    trackEvent("social_click", { section: "home", platform });
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(249,115,22,0.2),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.15),transparent_32%)]" />

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-36 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)] backdrop-blur">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
            Political + IRL Creator
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
            Covering politics on the ground while building a strong social media brand.
          </h1>
          <p className="mt-6 max-w-xl text-base text-slate-200 md:text-lg">
            I am Sridhar Prakash. I create political campaign coverage, social media promotion content, travel vlogs, and IRL videos that connect with real people.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/volunteer"
              onClick={() => handleCtaClick("join_volunteer_team")}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Volunteer With Us
            </Link>
            <Link
              href="/book"
              onClick={() => handleCtaClick("start_collaboration")}
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition hover:translate-y-[-1px] hover:bg-[var(--accent-strong)]"
            >
              Work With Me
            </Link>
            <Link
              href="/articles"
              onClick={() => handleCtaClick("follow_build")}
              className="rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
            >
              Follow Updates
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="glass-card overflow-hidden rounded-3xl border border-white/15 bg-black/30">
            <div className="relative h-[340px] w-full md:h-[420px]">
              <Image
                src="/images/og-image.jpg"
                alt="Portrait of Sridhar Prakash"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Home Base</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Politics, travel, and IRL stories from the ground.</h2>
              <p className="mt-2 text-sm text-slate-200">
                This space tracks my campaign coverage work, creator collaborations, and day-to-day field content.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Status</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Active now: political coverage + social media storytelling.</h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
            I am taking political and creator collaborations focused on campaign visibility, on-ground documentation, and audience engagement.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">The Story</p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Why I am doing this now.</h2>
            <div className="mt-6 space-y-4">
              {storyBeats.map((beat) => (
                <article key={beat.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="text-lg font-semibold text-white">{beat.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{beat.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Next Up</p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">What I am building next.</h2>
            <div className="mt-6 space-y-3">
              {futurePlans.map((plan) => (
                <div key={plan} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-slate-200">{plan}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-black/25 p-6 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Core Values</p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">How I want to show up.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {values.map((value) => (
                <article key={value.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="text-lg font-semibold text-white">{value.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{value.body}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Timeline</p>
            <h2 className="mt-3 font-display text-3xl text-white">The build</h2>
            <div className="mt-6 space-y-4">
              {timeline.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Socials</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Social Channels</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {socialProfiles.map((platform) => {
              const Icon = socialIcons[platform.name];
              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  onClick={() => handleSocialClick(platform.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-[var(--accent)]/55"
                >
                  <Icon className="h-5 w-5 text-slate-200 group-hover:text-[var(--accent)]" />
                  <p className="mt-3 text-sm text-slate-200">{platform.name}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.85),rgba(30,41,59,0.88))] p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Open Invite</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-5xl">
            Want to collaborate or volunteer for on-ground support?
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
            Join as a volunteer for campaign support, or connect for creator collaboration and social media promotion.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/volunteer"
              onClick={() => handleCtaClick("open_invite_volunteer")}
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Join as Volunteer
            </Link>
            <Link
              href="/book"
              onClick={() => handleCtaClick("say_hello")}
              className="inline-flex rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
            >
              Start Collaboration
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
