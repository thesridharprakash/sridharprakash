import type { Metadata } from "next";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ReportIssueForm from "./ReportIssueForm";

export const metadata: Metadata = {
  title: "Report a Local Civic Issue | Sridhar Prakash Community Platform",
  description: "Share a local civic issue with Sridhar Prakash's community platform for review and possible follow-up.",
  alternates: { canonical: "/report-issue" },
  openGraph: {
    title: "Report a Local Civic Issue | Sridhar Prakash Community Platform",
    description: "Submit a local civic issue with area, priority, landmark, and optional photo details.",
    url: "/report-issue",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Report a Local Civic Issue",
    description: "Submit a local civic issue for review and possible follow-up.",
    images: ["/images/og-image.jpg"],
  },
};

export default function ReportIssuePage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-24 text-[var(--foreground)] md:pb-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(245,158,11,0.15),transparent_35%),radial-gradient(circle_at_10%_82%,rgba(56,189,248,0.14),transparent_42%)]" />
      <section className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-14 pt-8 md:px-6 md:pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="inline-flex rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Local Concern
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">Report a Local Civic Issue</h1>
          <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
            Share clear details about a local issue so the team can review it and follow up where possible.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <ExclamationTriangleIcon className="h-8 w-8 text-[var(--accent)]" aria-hidden="true" />
            <p className="mt-3 text-sm text-slate-300">
              Please avoid emergency use. For immediate safety or medical emergencies, contact the relevant official emergency services directly.
            </p>
          </div>
        </div>
        <div>
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <h2 className="font-display text-2xl text-white">Submit issue details</h2>
            <p className="mt-1 text-sm text-slate-400">Add area, priority, landmark, and a clear description.</p>
          </div>
          <ReportIssueForm />
        </div>
      </section>
    </main>
  );
}
