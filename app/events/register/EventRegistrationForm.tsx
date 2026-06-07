"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CampaignFields from "@/components/CampaignFields";
import { trackEvent } from "@/lib/analytics";

export default function EventRegistrationForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventTitle = searchParams.get("event") || "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/event-registration", { method: "POST", body: new FormData(event.currentTarget) });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error || "Submission failed. Please try again.");
      setSubmitting(false);
      return;
    }
    trackEvent("event_registration", { form: "event_registration", event: eventTitle });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] p-8 text-center">
        <h2 className="font-display text-3xl text-white">Registration received</h2>
        <p className="mt-3 text-sm text-slate-300">Our team will contact you with event participation details.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/15 bg-black/30 p-5 md:p-8">
      <input suppressHydrationWarning name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <CampaignFields />
      <div>
        <label htmlFor="event-title" className="mb-2 block text-sm font-medium text-slate-300">Event</label>
        <input id="event-title" suppressHydrationWarning name="eventTitle" required value={eventTitle} readOnly className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="event-name" className="mb-2 block text-sm font-medium text-slate-300">Full Name *</label>
          <input id="event-name" suppressHydrationWarning name="name" required autoComplete="name" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white" />
        </div>
        <div>
          <label htmlFor="event-mobile" className="mb-2 block text-sm font-medium text-slate-300">Mobile Number *</label>
          <input id="event-mobile" suppressHydrationWarning name="mobile" required type="tel" pattern="[6-9][0-9]{9}" maxLength={10} inputMode="numeric" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="event-email" className="mb-2 block text-sm font-medium text-slate-300">Email Address (optional)</label>
          <input id="event-email" suppressHydrationWarning name="email" type="email" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white" />
        </div>
        <div>
          <label htmlFor="event-area" className="mb-2 block text-sm font-medium text-slate-300">Area / Locality *</label>
          <input id="event-area" suppressHydrationWarning name="area" required className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white" />
        </div>
      </div>
      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
        <input suppressHydrationWarning type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
        <span>I agree to be contacted about this event registration.</span>
      </label>
      <button type="submit" disabled={submitting} className="w-full rounded-full bg-[var(--accent)] px-6 py-4 text-base font-semibold text-black md:w-auto">
        {submitting ? "Registering..." : "Register for Event"}
      </button>
      {error ? <p className="text-sm text-red-400" role="alert">{error}</p> : null}
    </form>
  );
}
