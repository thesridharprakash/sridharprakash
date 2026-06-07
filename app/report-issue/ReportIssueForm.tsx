"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import CampaignFields from "@/components/CampaignFields";
import { getAttributionContext, trackEvent } from "@/lib/analytics";

export default function ReportIssueForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const attribution = getAttributionContext();
    formData.set("attribution", JSON.stringify(attribution));

    setSubmitting(true);
    setError(null);
    trackEvent("issue_report_submit_attempt", { form: "issue_report" });

    try {
      const response = await fetch("/api/report-issue", { method: "POST", body: formData });
      const payload = (await response.json().catch(() => null)) as { error?: string; reference?: string } | null;

      if (!response.ok) {
        setError(payload?.error || "Submission failed. Please try again.");
        setSubmitting(false);
        trackEvent("issue_report_submit_error", { form: "issue_report", status: response.status });
        return;
      }

      setReference(payload?.reference || "");
      trackEvent("issue_report_submit_success", { form: "issue_report" });
      trackEvent("report_issue_submission", { form: "issue_report" });
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
      trackEvent("issue_report_submit_error", { form: "issue_report", reason: "network_error" });
    }
  }

  if (reference) {
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
        <h2 className="mt-4 font-display text-3xl text-white">Your issue has been received.</h2>
        <p className="mt-3 text-sm text-slate-300 md:text-base">Reference ID: <span className="font-semibold text-white">{reference}</span></p>
        <p className="mt-2 text-sm text-slate-400">Our team will review and follow up where possible.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/15 bg-black/30 p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
      <input suppressHydrationWarning name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <CampaignFields />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="issue-name" className="mb-2 block text-sm font-medium text-slate-300">Full Name <span className="text-[var(--accent)]">*</span></label>
          <input id="issue-name" suppressHydrationWarning name="name" required autoComplete="name" placeholder="Full Name" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </div>
        <div>
          <label htmlFor="issue-mobile" className="mb-2 block text-sm font-medium text-slate-300">Mobile Number <span className="text-[var(--accent)]">*</span></label>
          <input id="issue-mobile" suppressHydrationWarning name="mobile" type="tel" required pattern="[6-9][0-9]{9}" inputMode="numeric" maxLength={10} autoComplete="tel" placeholder="10-digit mobile number" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="issue-email" className="mb-2 block text-sm font-medium text-slate-300">Email Address <span className="text-slate-500">(optional)</span></label>
          <input id="issue-email" suppressHydrationWarning name="email" type="email" autoComplete="email" placeholder="Email Address" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </div>
        <div>
          <label htmlFor="issue-area" className="mb-2 block text-sm font-medium text-slate-300">Area / Locality <span className="text-[var(--accent)]">*</span></label>
          <input id="issue-area" suppressHydrationWarning name="area" required autoComplete="address-level2" placeholder="Area / Locality" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="issue-priority" className="mb-2 block text-sm font-medium text-slate-300">Priority</label>
          <select id="issue-priority" suppressHydrationWarning name="priority" defaultValue="Normal" className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30">
            <option>Normal</option>
            <option>Urgent</option>
            <option>Safety Concern</option>
          </select>
        </div>
        <div>
          <label htmlFor="issue-type" className="mb-2 block text-sm font-medium text-slate-300">Issue Type <span className="text-slate-500">(optional)</span></label>
          <input id="issue-type" suppressHydrationWarning name="issueType" placeholder="Road, water, safety..." className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </div>
        <div>
          <label htmlFor="issue-landmark" className="mb-2 block text-sm font-medium text-slate-300">Nearby Landmark <span className="text-slate-500">(optional)</span></label>
          <input id="issue-landmark" suppressHydrationWarning name="landmark" placeholder="Nearby Landmark" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </div>
      </div>

      <div>
        <label htmlFor="issue-details" className="mb-2 block text-sm font-medium text-slate-300">Issue Details <span className="text-[var(--accent)]">*</span></label>
        <textarea id="issue-details" suppressHydrationWarning name="details" required rows={5} maxLength={1200} placeholder="Describe the issue, location, and any relevant details." className="min-h-32 w-full resize-y rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
      </div>

      <div>
        <label htmlFor="issue-photo" className="mb-2 block text-sm font-medium text-slate-300">Photo <span className="text-slate-500">(optional)</span></label>
        <input id="issue-photo" suppressHydrationWarning name="photo" type="file" accept="image/png,image/jpeg,image/webp" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        <p className="mt-2 text-xs text-slate-500">Upload a clear photo if available.</p>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
        <input suppressHydrationWarning type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
        <span>I agree to the <a href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</a> and consent to being contacted about this issue report.</span>
      </label>

      <motion.button suppressHydrationWarning whileTap={{ scale: 0.98 }} type="submit" disabled={submitting} className={`w-full rounded-full px-6 py-4 text-base font-semibold transition md:w-auto md:min-w-52 ${submitting ? "cursor-not-allowed bg-white/20 text-slate-200" : "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]"}`}>
        {submitting ? "Submitting..." : "Submit Issue Report"}
      </motion.button>

      {error ? <p className="text-sm text-red-400" role="alert">{error}</p> : null}
    </form>
  );
}
