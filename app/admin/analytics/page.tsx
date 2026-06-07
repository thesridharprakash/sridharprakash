import AdminProtectedShell from "@/app/admin/AdminProtectedShell";
import AnalyticsDashboardClient from "./AnalyticsDashboardClient";

export default function AdminAnalyticsPage() {
  return (
    <AdminProtectedShell>
      <main className="min-h-screen bg-black/80 py-16 text-white">
        <section className="mx-auto max-w-6xl space-y-6 px-6">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Analytics</p>
            <h1 className="text-4xl font-semibold">Visitor and conversion dashboard</h1>
            <p className="max-w-3xl text-sm text-slate-300">
              Aggregate view of page visits, campaign sources, form submissions, WhatsApp clicks, and event registrations.
            </p>
          </header>
          <AnalyticsDashboardClient />
        </section>
      </main>
    </AdminProtectedShell>
  );
}
