"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { getAttributionContext, trackEvent } from "@/lib/analytics";
import type { CommunityInitiative } from "../initiatives";

type CommunityInitiativeFormProps = {
  initiative: CommunityInitiative;
};

export default function CommunityInitiativeForm({ initiative }: CommunityInitiativeFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const attribution = getAttributionContext();
    formData.set("attribution", JSON.stringify(attribution));
    formData.set("initiativeSlug", initiative.slug);
    formData.set("interest", initiative.interest);

    setSubmitting(true);
    setError(null);

    trackEvent("community_initiative_submit_attempt", {
      form: "community_initiative",
      initiative: initiative.slug,
      source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
      campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
    });

    try {
      const response = await fetch("/api/community-initiative", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        trackEvent("community_initiative_submit_error", {
          form: "community_initiative",
          initiative: initiative.slug,
          status: response.status,
          reason: payload?.error || "unknown_error",
        });
        setError(payload?.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }

      trackEvent("community_initiative_submit_success", {
        form: "community_initiative",
        initiative: initiative.slug,
        source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
        campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
      });
      setSubmitted(true);
    } catch {
      trackEvent("community_initiative_submit_error", {
        form: "community_initiative",
        initiative: initiative.slug,
        reason: "network_error",
      });
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] p-8 text-center md:p-10"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <CheckCircleIcon className="mx-auto h-16 w-16 text-[var(--accent)]" />
        <h2 className="mt-4 font-display text-3xl text-white">Details received</h2>
        <p className="mt-3 text-sm text-slate-300 md:text-base">{initiative.successMessage}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/15 bg-black/30 p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
      <input suppressHydrationWarning name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="initiativeSlug" value={initiative.slug} />
      <input type="hidden" name="interest" value={initiative.interest} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="initiative-name" className="mb-2 block text-sm font-medium text-slate-300">
            Full Name <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="initiative-name"
            suppressHydrationWarning
            name="name"
            required
            autoComplete="name"
            placeholder="Full Name"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
        <div>
          <label htmlFor="initiative-mobile" className="mb-2 block text-sm font-medium text-slate-300">
            Mobile Number <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="initiative-mobile"
            suppressHydrationWarning
            name="mobile"
            type="tel"
            required
            pattern="[6-9][0-9]{9}"
            title="Enter a valid 10-digit mobile number"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
            placeholder="10-digit mobile number"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="initiative-email" className="mb-2 block text-sm font-medium text-slate-300">
            Email Address <span className="text-slate-500">(optional)</span>
          </label>
          <input
            id="initiative-email"
            suppressHydrationWarning
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
        <div>
          <label htmlFor="initiative-area" className="mb-2 block text-sm font-medium text-slate-300">
            Area / Locality <span className="text-slate-500">(optional)</span>
          </label>
          <input
            id="initiative-area"
            suppressHydrationWarning
            name="area"
            autoComplete="address-level2"
            placeholder="Area / Locality"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
      </div>

      <fieldset className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/[0.05] p-4 md:p-5">
        <legend className="px-1 text-sm font-semibold text-white">Participation preferences</legend>
        <p className="mt-1 text-xs text-slate-400">Select all that apply.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {initiative.options.map((option) => (
            <label key={option} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-300">
              <input
                suppressHydrationWarning
                type="checkbox"
                name="participation"
                value={option}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="initiative-message" className="mb-2 block text-sm font-medium text-slate-300">
          {initiative.messageLabel} {initiative.messageRequired ? <span className="text-[var(--accent)]">*</span> : <span className="text-slate-500">(optional)</span>}
        </label>
        <textarea
          id="initiative-message"
          suppressHydrationWarning
          name="message"
          required={initiative.messageRequired}
          rows={5}
          maxLength={1200}
          placeholder={initiative.messagePlaceholder}
          className="min-h-32 w-full resize-y rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
        />
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
        <input suppressHydrationWarning type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
        <span>
          I agree to the <a href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</a> and consent to being contacted about this community participation request.
        </span>
      </label>

      <motion.button
        suppressHydrationWarning
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={submitting}
        className={`w-full rounded-full px-6 py-4 text-base font-semibold transition md:w-auto md:min-w-52 ${
          submitting ? "cursor-not-allowed bg-white/20 text-slate-200" : "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]"
        }`}
      >
        {submitting ? "Submitting..." : initiative.cta}
      </motion.button>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
