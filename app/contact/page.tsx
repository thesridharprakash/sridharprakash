"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EnvelopeIcon, MegaphoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTwitch } from "react-icons/fa6";
import { SiKick } from "react-icons/si";
import { socialProfiles } from "@/constants/socials";

const collaborationTypes = [
  "Travel campaigns and destination storytelling",
  "Food brand launches and tasting formats",
  "Moto products, rides, and roadtrip integrations",
  "IRL streaming events and live creator appearances",
];

const socialIcons = {
  YouTube: FaYoutube,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Twitch: FaTwitch,
  Kick: SiKick,
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-28 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_8%_80%,rgba(245,158,11,0.14),transparent_40%)]" />

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Contact & Bookings</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">
            Let us build a campaign your audience will remember.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
            For collaborations, event invites, and creator partnerships, reach out through email with your goals, timeline, and expected deliverables.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-14 md:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <EnvelopeIcon className="h-7 w-7 text-[var(--accent)]" />
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Email</p>
          <a href="mailto:thesridharprakash@gmail.com" className="mt-2 block break-all text-lg font-semibold text-white hover:text-[var(--accent)]">
            thesridharprakash@gmail.com
          </a>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <MegaphoneIcon className="h-7 w-7 text-[var(--accent)]" />
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Response Window</p>
          <p className="mt-2 text-lg font-semibold text-white">Within 24-48 hours</p>
          <p className="mt-2 text-sm text-slate-300">Please include budget range and campaign period.</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <MapPinIcon className="h-7 w-7 text-[var(--accent)]" />
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Base Location</p>
          <p className="mt-2 text-lg font-semibold text-white">Bengaluru, India</p>
          <p className="mt-2 text-sm text-slate-300">Available for domestic and international travel.</p>
        </motion.article>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.88))] p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Best Fit Collaborations</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Partnership categories I actively take on</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {collaborationTypes.map((item) => (
              <p key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-white md:text-4xl">Social Channels</h2>
          <Link href="/about" className="text-xs uppercase tracking-[0.16em] text-[var(--muted)] hover:text-white">
            View Creator Story
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {socialProfiles.map((social) => {
            const Icon = socialIcons[social.name];
            return (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-black/20 p-6 transition hover:border-[var(--accent)]/55"
            >
              <Icon className="h-7 w-7 text-slate-200 group-hover:text-[var(--accent)]" />
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{social.name}</p>
              <p className="mt-2 text-lg font-semibold text-white">{social.handle}</p>
            </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
