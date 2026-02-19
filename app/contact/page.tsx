"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EnvelopeIcon, MegaphoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTwitch } from "react-icons/fa6";
import { SiKick } from "react-icons/si";
import { socialProfiles } from "@/constants/socials";
import { getAttributionContext, trackEvent } from "@/lib/analytics";

const collaborationTypes = [
  "Political campaign social media promotion",
  "On-ground campaign trail coverage and reporting",
  "IRL streaming and public event storytelling",
  "Travel vlogging and creator-led outreach content",
];

const socialIcons = {
  YouTube: FaYoutube,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Twitch: FaTwitch,
  Kick: SiKick,
};

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSocialClick(platform: string) {
    trackEvent("social_click", { section: "contact", platform });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const attribution = getAttributionContext();
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      budget: (form.elements.namedItem("budget") as HTMLInputElement).value,
      timeline: (form.elements.namedItem("timeline") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      attribution,
    };

    setSubmitting(true);
    setError(null);

    trackEvent("contact_submit_attempt", {
      form: "contact",
      source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
      campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        trackEvent("contact_submit_error", {
          form: "contact",
          status: response.status,
          reason: payload?.error || "unknown_error",
        });
        setError(payload?.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }

      trackEvent("contact_submit_success", {
        form: "contact",
        source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
        campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
      });
      setSubmitted(true);
    } catch (submitError) {
      console.error("Contact submission failed", submitError);
      trackEvent("contact_submit_error", {
        form: "contact",
        reason: "network_error",
      });
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

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
            Let us build social media campaigns people actually connect with.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
            For political promotion, campaign coverage, event invites, and creator partnerships, reach out with your goals, timeline, and expected deliverables.
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
          <a
            href="mailto:thesridharprakash@gmail.com"
            onClick={() => trackEvent("lead_click", { type: "email", section: "contact" })}
            className="mt-2 block break-all text-lg font-semibold text-white hover:text-[var(--accent)]"
          >
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
          <p className="mt-2 text-sm text-slate-300">Please include budget range, campaign location, and timeline.</p>
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
        <div className="rounded-3xl border border-white/15 bg-black/25 p-8 md:p-10">
          {!submitted ? (
            <>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Quick Brief</p>
              <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Send collaboration details</h2>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                  suppressHydrationWarning
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    suppressHydrationWarning
                    name="name"
                    required
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                  <input
                    suppressHydrationWarning
                    name="email"
                    type="email"
                    required
                    placeholder="Your Email"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    suppressHydrationWarning
                    name="budget"
                    placeholder="Estimated Budget (optional)"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                  <input
                    suppressHydrationWarning
                    name="timeline"
                    placeholder="Campaign Timeline (optional)"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                </div>
                <textarea
                  suppressHydrationWarning
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your political or social media campaign, expected deliverables, and goals."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                />
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={submitting}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                    submitting
                      ? "cursor-not-allowed bg-white/20 text-slate-200"
                      : "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]"
                  }`}
                >
                  {submitting ? "Sending..." : "Send Brief"}
                </button>
                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="font-display text-3xl text-white md:text-4xl">Brief received</h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Thanks for sharing the details. I will get back to you within 24-48 hours with the next step.
              </p>
            </div>
          )}
        </div>
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
              onClick={() => handleSocialClick(social.name)}
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
