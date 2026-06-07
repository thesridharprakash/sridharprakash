"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import CampaignFields from "@/components/CampaignFields";
import { getAttributionContext, trackEvent } from "@/lib/analytics";

const participationOptions = [
  "I am willing to donate blood",
  "I can volunteer during camps",
  "I can help organize a camp",
  "I can support awareness campaigns",
  "I can provide medical support",
];
const whatsappUpdatesUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || "";

function getDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BloodDonationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [today] = useState(() => getDateInputValue(new Date()));
  const [lastDonationDate, setLastDonationDate] = useState("");
  const [lastDonationDateError, setLastDonationDateError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    if (lastDonationDate && lastDonationDate > today) {
      setLastDonationDateError("Last donation date cannot be in the future.");
      setError(null);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const attribution = getAttributionContext();
    formData.set("attribution", JSON.stringify(attribution));

    setSubmitting(true);
    setError(null);
    setLastDonationDateError(null);

    trackEvent("blood_donation_submit_attempt", {
      form: "blood_donation",
      source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
      campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
    });

    try {
      const response = await fetch("/api/blood-donation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        trackEvent("blood_donation_submit_error", {
          form: "blood_donation",
          status: response.status,
          reason: payload?.error || "unknown_error",
        });
        setError(payload?.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }

      trackEvent("blood_donation_submit_success", {
        form: "blood_donation",
        source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
        campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
      });
      trackEvent("blood_donation_registration", { form: "blood_donation" });
      setSubmitted(true);
    } catch {
      trackEvent("blood_donation_submit_error", {
        form: "blood_donation",
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
        <h2 className="mt-4 font-display text-3xl text-white">Registration received</h2>
        <p className="mt-3 text-sm text-slate-300 md:text-base">
          Thank you for registering. Our team will contact you about upcoming blood donation camps.
        </p>
        {whatsappUpdatesUrl ? (
          <a
            href={whatsappUpdatesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-strong)]"
          >
            Join Blood Donation Updates on WhatsApp
          </a>
        ) : null}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/15 bg-black/30 p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
      <input suppressHydrationWarning name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <CampaignFields />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="blood-donation-name" className="mb-2 block text-sm font-medium text-slate-300">
            Full Name <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="blood-donation-name"
            suppressHydrationWarning
            name="name"
            required
            autoComplete="name"
            placeholder="Full Name"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
        <div>
          <label htmlFor="blood-donation-mobile" className="mb-2 block text-sm font-medium text-slate-300">
            Mobile Number <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="blood-donation-mobile"
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
          <label htmlFor="blood-donation-email" className="mb-2 block text-sm font-medium text-slate-300">
            Email Address <span className="text-slate-500">(optional)</span>
          </label>
          <input
            id="blood-donation-email"
            suppressHydrationWarning
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
        <div>
          <label htmlFor="blood-donation-area" className="mb-2 block text-sm font-medium text-slate-300">
            Area / Locality <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="blood-donation-area"
            suppressHydrationWarning
            name="area"
            required
            autoComplete="address-level2"
            placeholder="Area / Locality"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="blood-donation-group" className="mb-2 block text-sm font-medium text-slate-300">
            Blood Group <span className="text-slate-500">(optional)</span>
          </label>
          <select
            id="blood-donation-group"
            suppressHydrationWarning
            name="bloodGroup"
            defaultValue=""
            className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          >
            <option value="">Select blood group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bloodGroup) => (
              <option key={bloodGroup} value={bloodGroup}>
                {bloodGroup}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="blood-donation-last-date" className="mb-2 block text-sm font-medium text-slate-300">
            Last Blood Donation Date <span className="text-slate-500">(optional)</span>
          </label>
          <input
            id="blood-donation-last-date"
            suppressHydrationWarning
            name="lastBloodDonationDate"
            type="date"
            value={lastDonationDate}
            max={today}
            aria-describedby="blood-donation-last-date-help blood-donation-last-date-error"
            aria-invalid={Boolean(lastDonationDateError)}
            onChange={(event) => {
              const selectedDate = event.target.value;
              const errorMessage = selectedDate && selectedDate > today ? "Last donation date cannot be in the future." : null;
              setLastDonationDate(selectedDate);
              setLastDonationDateError(errorMessage);
              event.target.setCustomValidity(errorMessage || "");
            }}
            onInvalid={(event) => {
              if (event.currentTarget.validity.rangeOverflow) {
                setLastDonationDateError("Last donation date cannot be in the future.");
                event.currentTarget.setCustomValidity("Last donation date cannot be in the future.");
              }
            }}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
          <p id="blood-donation-last-date-help" className="mt-2 text-xs text-slate-500">
            Select your most recent blood donation date. Future dates are not allowed.
          </p>
          {lastDonationDateError ? (
            <p id="blood-donation-last-date-error" className="mt-2 text-xs text-red-400" role="alert">
              {lastDonationDateError}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/[0.05] p-4 md:p-5">
        <legend className="px-1 text-sm font-semibold text-white">How would you like to participate?</legend>
        <p className="mt-1 text-xs text-slate-400">Select all that apply.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {participationOptions.map((option) => (
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

      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
        <input suppressHydrationWarning type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
        <span>
          I agree to the <a href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</a> and consent to being contacted about blood donation camps and volunteer opportunities.
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
        {submitting ? "Registering..." : "Register My Interest"}
      </motion.button>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
