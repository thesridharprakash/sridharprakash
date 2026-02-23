"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDaysIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { getAttributionContext, trackEvent } from "@/lib/analytics";
import bookContent from "@/data/pages/book.json";
import type { BookPageContent } from "@/types/pageContent";

const bookData = bookContent as BookPageContent;
const { hero, highlights, bookingTypes, bookingAreas, faqHeading, bookingFaqs, form } = bookData;
const highlightIconMap = {
  Scheduling: CalendarDaysIcon,
  "Campaign Fit": SparklesIcon,
  "Response Time": ClockIcon,
};

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
    const consent = (form.elements.namedItem("consent") as HTMLInputElement).checked;
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
          consent,
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
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{hero.eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">{hero.title}</h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">{hero.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={hero.ctaHref}
              className="inline-flex rounded-full border border-white/30 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:border-white"
            >
              {hero.ctaLabel}
            </a>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-10 md:grid-cols-3">
        {highlights.map((highlight, index) => {
          const Icon = highlightIconMap[highlight.title] ?? CalendarDaysIcon;
          return (
            <article key={`${highlight.label}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Icon className="h-7 w-7 text-[var(--accent)]" />
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{highlight.label}</p>
              <p className="mt-2 text-sm text-slate-200">{highlight.description}</p>
            </article>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">FAQ</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">{faqHeading}</h2>
          <div className="mt-6 space-y-3">
            {bookingFaqs.map((item) => (
              <article key={item.question} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-base font-semibold text-white md:text-lg">{item.question}</h3>
                <p className="mt-2 text-sm text-slate-300 md:text-base">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-8 md:p-10">
          {!submitted ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-3xl text-white md:text-4xl">{form.heading}</h2>
                <a
                  href={form.introLinkHref}
                  onClick={() => trackEvent("lead_click", { type: "email", section: "booking" })}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100 hover:border-white"
                >
                  {form.introLinkLabel}
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
                  <div>
                    <label htmlFor="book-name" className="sr-only">
                      Your Name
                    </label>
                    <input
                      id="book-name"
                      suppressHydrationWarning
                      name="name"
                      required
                      placeholder="Your Name"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="book-email" className="sr-only">
                      Your Email
                    </label>
                    <input
                      id="book-email"
                      suppressHydrationWarning
                      name="email"
                      type="email"
                      required
                      placeholder="Your Email"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="book-mobile" className="sr-only">
                      Mobile Number
                    </label>
                    <input
                      id="book-mobile"
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
                  <div>
                    <label htmlFor="book-brand" className="sr-only">
                      Brand or Company (optional)
                    </label>
                    <input
                      id="book-brand"
                      suppressHydrationWarning
                      name="brand"
                      placeholder="Brand / Company (optional)"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="book-type" className="sr-only">
                      Booking Type
                    </label>
                    <select
                      id="book-type"
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
                  </div>
                  <div>
                    <label htmlFor="book-area" className="sr-only">
                      Project Area
                    </label>
                    <select
                      id="book-area"
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
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label htmlFor="book-preferred-date" className="sr-only">
                      Preferred Date (optional)
                    </label>
                    <input
                      id="book-preferred-date"
                      suppressHydrationWarning
                      name="preferredDate"
                      type="date"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="book-preferred-time" className="sr-only">
                      Preferred Time (optional)
                    </label>
                    <input
                      id="book-preferred-time"
                      suppressHydrationWarning
                      name="preferredTime"
                      placeholder="Preferred Time (optional)"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="book-budget" className="sr-only">
                      Budget (optional)
                    </label>
                    <input
                      id="book-budget"
                      suppressHydrationWarning
                      name="budget"
                      placeholder="Budget (optional, e.g. INR 60,000)"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="book-brief" className="sr-only">
                    Campaign Brief
                  </label>
                  <textarea
                    id="book-brief"
                    suppressHydrationWarning
                    name="brief"
                    required
                    rows={5}
                    placeholder="Share campaign goals, deliverables, target audience, and deadlines."
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                </div>
                <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <input
                    suppressHydrationWarning
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
                  />
                  <span>
                    I agree to the <Link href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link> and{" "}
                    <Link href="/terms" className="text-[var(--accent)] hover:underline">Terms</Link>, and consent to being contacted about this booking request.
                  </span>
                </label>
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
                  {submitting ? "Sending..." : form.buttonLabel}
                </button>
                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            </>
          ) : (
            <div className="text-center" role="status" aria-live="polite" aria-atomic="true">
              <h2 className="font-display text-3xl text-white md:text-4xl">{form.successTitle}</h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">{form.successDescription}</p>
              <Link
                href={form.successLinkHref}
                className="mt-6 inline-flex rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:border-white"
              >
                {form.successLinkLabel}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
