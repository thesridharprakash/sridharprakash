"use client";

import { useEffect, useState } from "react";

type AnalyticsSnapshot = {
  totalVisitors: number;
  totalPageViews: number;
  visitorsByPage: Record<string, number>;
  formSubmissions: number;
  bloodDonationRegistrations: number;
  communityFormSubmissions: number;
  reportIssueSubmissions: number;
  contactFormSubmissions: number;
  eventRegistrations: number;
  whatsAppClicks: number;
  topTrafficSources: Record<string, number>;
  events: Record<string, number>;
  updatedAt: string | null;
};

function topEntries(values: Record<string, number>, limit = 8) {
  return Object.entries(values).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export default function AnalyticsDashboardClient() {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/analytics", { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as { snapshot?: AnalyticsSnapshot; error?: string } | null;
        if (!response.ok) throw new Error(payload?.error || "Unable to load analytics.");
        if (active) setSnapshot(payload?.snapshot ?? null);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError instanceof Error ? fetchError.message : "Unable to load analytics.");
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>;
  }

  if (!snapshot) {
    return <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Loading analytics...</p>;
  }

  const stats = [
    { label: "Total visitors", value: snapshot.totalVisitors },
    { label: "Page views", value: snapshot.totalPageViews },
    { label: "Form submissions", value: snapshot.formSubmissions },
    { label: "Blood donation registrations", value: snapshot.bloodDonationRegistrations },
    { label: "WhatsApp clicks", value: snapshot.whatsAppClicks },
    { label: "Event registrations", value: snapshot.eventRegistrations },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{stat.label}</p>
            <p className="mt-2 text-4xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white">Visitors by page</h2>
          <div className="mt-4 space-y-3">
            {topEntries(snapshot.visitorsByPage).length ? (
              topEntries(snapshot.visitorsByPage).map(([page, count]) => (
                <div key={page} className="flex items-center justify-between gap-4 rounded-2xl bg-black/20 px-4 py-3 text-sm">
                  <span className="break-all text-slate-300">{page}</span>
                  <span className="font-semibold text-white">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No page views recorded yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white">Top traffic sources</h2>
          <div className="mt-4 space-y-3">
            {topEntries(snapshot.topTrafficSources).length ? (
              topEntries(snapshot.topTrafficSources).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between gap-4 rounded-2xl bg-black/20 px-4 py-3 text-sm">
                  <span className="text-slate-300">{source}</span>
                  <span className="font-semibold text-white">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No traffic source data recorded yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold text-white">Conversion events</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            ["Community Form Submission", snapshot.communityFormSubmissions],
            ["Blood Donation Registration", snapshot.bloodDonationRegistrations],
            ["Report Issue Submission", snapshot.reportIssueSubmissions],
            ["Contact Form Submission", snapshot.contactFormSubmissions],
            ["Event Registration", snapshot.eventRegistrations],
            ["WhatsApp Button Click", snapshot.whatsAppClicks],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-black/20 px-4 py-3 text-sm">
              <span className="text-slate-300">{label}</span>
              <span className="font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-500">
        Dashboard data is aggregate-only and privacy-friendly. GA4 and Microsoft Clarity remain the source of truth for long-term analytics.
        {snapshot.updatedAt ? ` Last updated: ${new Date(snapshot.updatedAt).toLocaleString()}.` : ""}
      </p>
    </div>
  );
}
