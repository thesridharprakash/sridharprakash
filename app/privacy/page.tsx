export const metadata = {
  title: "Privacy Policy | Sridhar Prakash",
  description:
    "Privacy Policy for Sridhar Prakash website covering lead forms, analytics, data usage, retention, and contact rights.",
};

export default function PrivacyPage() {
  return (
    <main className="relative overflow-hidden pt-28 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_12%_84%,rgba(245,158,11,0.12),transparent_35%)]" />

      <section className="mx-auto max-w-4xl px-6 pb-24 pt-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Legal</p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-300">Last updated: February 19, 2026</p>

        <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-300">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">1. What data we collect</h2>
            <p className="mt-2">
              We collect information you submit in forms, including name, email, mobile number, location, campaign details, and consent status. We also collect
              basic attribution metadata (such as `utm_*`, `gclid`, and `fbclid`) and limited technical data like IP address for spam prevention and rate
              limiting.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">2. Why we collect it</h2>
            <p className="mt-2">
              Data is used to respond to booking, contact, and volunteer requests, coordinate campaign work, improve lead quality, and maintain service security.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">3. Sharing and processors</h2>
            <p className="mt-2">
              Submitted lead data may be routed to integrated operational tools such as Google Apps Script/Sheets and Telegram notifications used by the team for
              processing inquiries. We do not sell personal data.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">4. Retention and security</h2>
            <p className="mt-2">
              We keep data only as long as needed for inquiry handling, campaign operations, legal compliance, and security monitoring. Reasonable technical and
              organizational safeguards are used to protect stored data.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">5. Your choices and rights</h2>
            <p className="mt-2">
              You can request access, correction, or deletion of your submitted data by contacting us at{" "}
              <a href="mailto:thesridharprakash@gmail.com" className="text-[var(--accent)] hover:underline">
                thesridharprakash@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">6. Policy updates</h2>
            <p className="mt-2">We may update this policy periodically. Material changes will be reflected by updating the date at the top of this page.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
