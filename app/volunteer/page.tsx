"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserGroupIcon,
  HandRaisedIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { getAttributionContext, trackEvent } from "@/lib/analytics";

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;

    const attribution = getAttributionContext();
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      mobile: (form.elements.namedItem("mobile") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      area: (form.elements.namedItem("area") as HTMLInputElement).value,
      interest: (form.elements.namedItem("interest") as HTMLSelectElement).value,
      consent: (form.elements.namedItem("consent") as HTMLInputElement).checked,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      attribution,
    };

    trackEvent("volunteer_submit_attempt", {
      form: "volunteer",
      interest: data.interest,
      source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
      campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
    });

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        trackEvent("volunteer_submit_error", {
          form: "volunteer",
          status: response.status,
          reason: payload?.error || "unknown_error",
        });
        setError(payload?.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }

      trackEvent("volunteer_submit_success", {
        form: "volunteer",
        source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
        campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed", err);
      trackEvent("volunteer_submit_error", {
        form: "volunteer",
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
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Volunteer Program</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">
            Join the campaign and media volunteer team.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
            If you care about politics and public conversations, support on-ground coverage, event coordination, and social media execution.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-12 md:grid-cols-3">
        {[
          {
            icon: UserGroupIcon,
            title: "Ground Network",
            text: "Connect with local communities and help capture real campaign conversations.",
          },
          {
            icon: HandRaisedIcon,
            title: "Field Support",
            text: "Assist with events, campaign-day coordination, and on-location storytelling.",
          },
          {
            icon: BuildingOffice2Icon,
            title: "Digital Impact",
            text: "Support social content planning, posting, and audience engagement.",
          },
        ].map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 + index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <item.icon className="h-7 w-7 text-[var(--accent)]" />
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{item.title}</p>
            <p className="mt-2 text-sm text-slate-300">{item.text}</p>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-8 md:p-10">
          {!submitted ? (
            <>
              <h2 className="font-display text-3xl text-white md:text-4xl">
                Volunteer registration
              </h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Fill this form to share your details and volunteer interest area.
              </p>

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
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                  <input
                    suppressHydrationWarning
                    name="mobile"
                    type="tel"
                    required
                    pattern="[6-9][0-9]{9}"
                    title="Enter a valid 10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Mobile Number"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    suppressHydrationWarning
                    name="email"
                    type="email"
                    placeholder="Email Address (optional)"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                  <input
                    suppressHydrationWarning
                    name="area"
                    placeholder="City / Area"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                </div>

                <select
                  suppressHydrationWarning
                  name="interest"
                  className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                >
                  <option>Campaign trail support</option>
                  <option>Event and crowd coordination</option>
                  <option>Social media and digital outreach</option>
                  <option>Video shooting/editing support</option>
                </select>

                <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <input
                    suppressHydrationWarning
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
                  />
                  <span>I consent to being contacted for campaign and media volunteer activities.</span>
                </label>

                <motion.button
                  suppressHydrationWarning
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                    submitting
                      ? "cursor-not-allowed bg-white/20 text-slate-200"
                      : "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]"
                  }`}
                >
                  {submitting ? "Sending..." : "Submit Volunteer Request"}
                </motion.button>

                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <CheckCircleIcon className="mx-auto h-16 w-16 text-[var(--accent)]" />
              <h2 className="mt-4 font-display text-3xl text-white md:text-4xl">
                Request received
              </h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Thank you for volunteering. We will reach out shortly with role details and next steps.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
