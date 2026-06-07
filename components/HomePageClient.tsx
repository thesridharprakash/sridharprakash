"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTwitch } from "react-icons/fa6";
import { SiKick } from "react-icons/si";
import { CheckCircleIcon, EyeIcon, HandRaisedIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { socialProfiles } from "@/constants/socials";
import { trackEvent } from "@/lib/analytics";
import YouTubeEventsSection from "@/components/YouTubeEventsSection";
import type { YouTubeEventsPayload } from "@/lib/youtubeEvents";

const storyBeats = [
  {
    title: "Public leadership",
    body: "This platform brings together Sridhar Prakash's public work, community initiatives, and updates for people who want to stay connected.",
  },
  {
    title: "Service focus",
    body: "Seva, local problem-solving, public outreach, and youth participation are at the center of the work shown here.",
  },
  {
    title: "Why this site matters",
    body: "People should be able to follow current activity, join community efforts, and contact Sridhar Prakash without confusion.",
  },
];

const futurePlans = [
  "Expand youth participation and volunteer-led community work.",
  "Publish regular updates from events, meetings, and local outreach.",
  "Highlight seva activities, field work, and citizen-focused initiatives.",
  "Build a stronger direct connection between residents and Sridhar Prakash.",
];

const values = [
  {
    title: "Seva",
    body: "Public work must be grounded in service, responsiveness, and discipline.",
  },
  {
    title: "Youth participation",
    body: "Young people should have a clear role in service, outreach, and civic engagement.",
  },
  {
    title: "Public connection",
    body: "Residents should be able to track activities, initiatives, and communication in one place.",
  },
];

const timeline = [
  {
    title: "Now",
    body: "Building an active platform for updates, participation, and community communication.",
  },
  {
    title: "Next 90 days",
    body: "Organize more public programs, strengthen volunteer participation, and improve direct engagement.",
  },
  {
    title: "This year",
    body: "Strengthen Sridhar Prakash's public-service presence through visible, consistent, and people-focused work.",
  },
];

const trustCards = [
  {
    icon: HandRaisedIcon,
    title: "Public Service Focus",
    body: "Built around seva, local problem-solving, youth participation, and direct community connection.",
  },
  {
    icon: EyeIcon,
    title: "Transparent Initiatives",
    body: "Community activities, events, and volunteer opportunities are presented clearly for public participation.",
  },
  {
    icon: CheckCircleIcon,
    title: "Easy Participation",
    body: "Residents can join initiatives, register for blood donation, volunteer, or raise local concerns through simple forms.",
  },
  {
    icon: RocketLaunchIcon,
    title: "Action-Oriented Platform",
    body: "Every page should guide visitors toward a useful action: join, register, report, attend, or connect.",
  },
];

const socialIcons = {
  YouTube: FaYoutube,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Twitch: FaTwitch,
  Kick: SiKick,
};

const socialHoverStyles: Record<keyof typeof socialIcons, string> = {
  YouTube: "hover:border-red-400/60 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-red-900/25",
  Facebook: "hover:border-blue-400/60 hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-blue-900/25",
  Instagram:
    "hover:border-pink-400/60 hover:bg-[linear-gradient(135deg,rgba(225,48,108,0.22),rgba(245,96,64,0.16),rgba(252,175,69,0.12))]",
  Twitch: "hover:border-violet-400/60 hover:bg-gradient-to-br hover:from-violet-500/20 hover:to-violet-900/25",
  Kick: "hover:border-lime-300/60 hover:bg-gradient-to-br hover:from-lime-400/20 hover:to-lime-900/25",
};

const socialIconHoverStyles: Record<keyof typeof socialIcons, string> = {
  YouTube: "group-hover:text-red-300",
  Facebook: "group-hover:text-blue-300",
  Instagram: "group-hover:text-pink-300",
  Twitch: "group-hover:text-violet-300",
  Kick: "group-hover:text-lime-300",
};

type HomePageClientProps = {
  initialEventsData?: YouTubeEventsPayload | null;
};

export default function HomePageClient({ initialEventsData = null }: HomePageClientProps) {
  function handleCtaClick(label: string) {
    trackEvent("cta_click", { section: "home", label });
  }

  function handleSocialClick(platform: string) {
    trackEvent("social_click", { section: "home", platform });
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(249,115,22,0.2),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.15),transparent_32%)]" />

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-36 md:grid-cols-[1.05fr_0.95fr] md:items-start">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)] backdrop-blur">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
            Public Service & Community Leadership
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
            Inspired by Antyodaya, uplifting the last person, building an inclusive society.
          </h1>
          <p className="mt-6 max-w-xl text-base text-slate-200 md:text-lg">
            Guided by core principles of Nationalism, Democracy, Integral Humanism, and value-based politics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/about"
              onClick={() => handleCtaClick("read_story")}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              About
            </Link>
            <Link
              href="/gallery"
              onClick={() => handleCtaClick("follow_updates")}
              className="rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
            >
              Gallery
            </Link>
            <Link
              href="/book"
              onClick={() => handleCtaClick("join_yuva_morcha")}
              className="rounded-full border border-[var(--accent)]/70 bg-[var(--accent)]/15 px-6 py-3 text-sm font-semibold text-[var(--accent)] backdrop-blur transition hover:border-[var(--accent)] hover:bg-[var(--accent)]/25"
            >
              Yuva Morcha
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="space-y-4 md:pt-1">
          <div className="glass-card overflow-hidden rounded-3xl border border-white/15 bg-black/30">
            <div className="relative h-[340px] w-full md:h-[500px]">
              <Image
                src="/images/og-image.jpg"
                alt="Sridhar Prakash public service and community leadership"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="p-5">
              <p className="whitespace-pre-line text-sm font-medium leading-6 text-slate-100">
                Nation First 🇮🇳 | Party Next 🤝 | Self Last 🙏
                {"\n"}Serving the country above everything
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Current Focus</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
            Active now: community outreach, youth engagement, public programs, and people-focused service.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
            The goal is straightforward: stay visible on the ground, stay connected to residents, and keep people informed.
          </p>
        </div>
      </section>

      <YouTubeEventsSection mode="home" initialData={initialEventsData} />

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Trust & Participation</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-5xl">Why People Connect With This Platform</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trustCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[var(--accent)]/45 hover:bg-[var(--accent)]/[0.06]"
              >
                <card.icon className="h-7 w-7 text-[var(--accent)]" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{card.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">The Story</p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Why this platform exists.</h2>
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
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">What Sridhar Prakash is building next.</h2>
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
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">How Sridhar Prakash works.</h2>
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
            <h2 className="mt-3 font-display text-3xl text-white">Roadmap</h2>
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
              const hoverCard = socialHoverStyles[platform.name];
              const hoverIcon = socialIconHoverStyles[platform.name];
              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  onClick={() => handleSocialClick(platform.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-2xl border border-white/10 bg-black/20 p-4 transition ${hoverCard}`}
                >
                  <Icon className={`h-5 w-5 text-slate-200 ${hoverIcon}`} />
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
          <h2 className="mt-3 font-display text-3xl text-white md:text-5xl">Want to connect, collaborate, or share a local concern?</h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
            Connect with Sridhar Prakash for community work, event coordination, public outreach, or local concerns.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/contact"
              onClick={() => handleCtaClick("open_contact")}
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Contact
            </Link>
            <Link
              href="/book"
              onClick={() => handleCtaClick("say_hello")}
              className="inline-flex rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
            >
              Yuva Morcha
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
