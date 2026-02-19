"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDaysIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { getAttributionContext, trackEvent } from "@/lib/analytics";

const bookingTypes = [
  "Political campaign promotion",
  "On-ground campaign coverage",
  "Public event appearance",
  "Travel and IRL collaboration",
  "Social media strategy support",
  "Other",
];

const bookingAreas = [
  "Bengaluru",
  "Karnataka (outside Bengaluru)",
  "Other city in India",
  "International",
  "Not decided yet",
];

export default function BookPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const attribution = getAttributionContext();
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const mobile = (form.elements.namedItem("mobile") as HTMLInputElement).value;
    const brand = (form.elements.namedItem("brand") as HTMLInputElement).value;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value;
    const area = (form.elements.namedItem("area") as HTMLSelectElement).value;
    const preferredDate = (form.elements.namedItem("preferredDate") as HTMLInputElement).value;
    const preferredTime = (form.elements.namedItem("preferredTime") as HTMLInputElement).value;
    const budget = (form.elements.namedItem("budget") as HTMLInputElement).value;
    const brief = (form.elements.namedItem("brief") as HTMLTextAreaElement).value;
    const website = (form.elements.namedItem("website") as HTMLInputElement).value;

    const message = [
      "[BOOKING REQUEST]",
      `Booking type: ${type}`,
      `Area: ${area || "-"}`,
      `Brand / Company: ${brand || "-"}`,
      `Mobile: ${mobile || "-"}`,
      `Preferred date: ${preferredDate || "-"}`,
      `Preferred time: ${preferredTime || "-"}`,
      `Campaign brief: ${brief}`,
    ].join("\n");

    setSubmitting(true);
    setError(null);

    trackEvent("booking_submit_attempt", {
      form: "booking",
      booking_type: type,
      source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
      campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadType: "booking",
          name,
          email,
          mobile,
          area,
          bookingType: type,
          brand,
          preferredDate,
          preferredTime,
          brief,
          budget,
          timeline: preferredDate,
          message,
          website,
          attribution,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        trackEvent("booking_submit_error", {
          form: "booking",
          status: response.status,
          reason: payload?.error || "unknown_error",
        });
        setError(payload?.error || "Could not submit booking request. Please try again.");
        setSubmitting(false);
        return;
      }

      trackEvent("booking_submit_success", {
        form: "booking",
        booking_type: type,
        source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
        campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
      });
      setSubmitted(true);
    } catch (submitError) {
      console.error("Booking submission failed", submitError);
      trackEvent("booking_submit_error", {
        form: "booking",
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
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Direct Booking</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">
            Book political coverage, social media promotion, and creator partnerships.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
            Share your campaign timeline, goals, and preferred date. This booking form goes directly to my team.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-10 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <CalendarDaysIcon className="h-7 w-7 text-[var(--accent)]" />
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Scheduling</p>
          <p className="mt-2 text-sm text-slate-200">Tell us your preferred date and time window.</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <SparklesIcon className="h-7 w-7 text-[var(--accent)]" />
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Campaign Fit</p>
          <p className="mt-2 text-sm text-slate-200">Choose your requirement so we can respond with an exact collaboration plan.</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <ClockIcon className="h-7 w-7 text-[var(--accent)]" />
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Response Time</p>
          <p className="mt-2 text-sm text-slate-200">Expected response within 24-48 hours.</p>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-8 md:p-10">
          {!submitted ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-3xl text-white md:text-4xl">Booking request form</h2>
                <a
                  href="mailto:thesridharprakash@gmail.com?subject=Booking%20Request"
                  onClick={() => trackEvent("lead_click", { type: "email", section: "booking" })}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100 hover:border-white"
                >
                  Prefer Email Instead
                </a>
              </div>
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
                  <input
                    suppressHydrationWarning
                    name="brand"
                    placeholder="Brand / Company (optional)"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    suppressHydrationWarning
                    name="type"
                    defaultValue={bookingTypes[0]}
                    className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  >
                    {bookingTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    suppressHydrationWarning
                    name="area"
                    defaultValue=""
                    className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  >
                    <option value="" disabled>
                      Select Area
                    </option>
                    {bookingAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <input
                    suppressHydrationWarning
                    name="preferredDate"
                    type="date"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                  <input
                    suppressHydrationWarning
                    name="preferredTime"
                    placeholder="Preferred Time (optional)"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                  <input
                    suppressHydrationWarning
                    name="budget"
                    placeholder="Budget (optional)"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                </div>
                <textarea
                  suppressHydrationWarning
                  name="brief"
                  required
                  rows={5}
                  placeholder="Share campaign goals, deliverables, target audience, and deadlines."
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
                  {submitting ? "Sending..." : "Submit Booking Request"}
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
              <h2 className="font-display text-3xl text-white md:text-4xl">Booking request received</h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Thank you. We will reach out within 24-48 hours with next steps and collaboration options.
              </p>
              <Link
                href="/media"
                className="mt-6 inline-flex rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:border-white"
              >
                View Media Portfolio
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
