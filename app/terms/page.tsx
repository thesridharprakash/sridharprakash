export const metadata = {
  title: "Terms | Sridhar Prakash",
  description:
    "Terms governing use of the Sridhar Prakash website, inquiry forms, booking engagements, and content usage.",
};

export default function TermsPage() {
  return (
    <main className="relative overflow-hidden pt-28 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(245,158,11,0.12),transparent_35%),radial-gradient(circle_at_10%_82%,rgba(56,189,248,0.12),transparent_35%)]" />

      <section className="mx-auto max-w-4xl px-6 pb-24 pt-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Legal</p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Terms of Use</h1>
        <p className="mt-3 text-sm text-slate-300">Last updated: February 19, 2026</p>

        <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-300">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">1. Scope</h2>
            <p className="mt-2">
              These terms apply to visitors, inquiry submissions, and collaborators using this website and related communication channels.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">2. Inquiry and booking terms</h2>
            <p className="mt-2">
              Submitting a form is a request for discussion, not a final contract. Project scope, pricing, timelines, deliverables, revisions, and payment
              schedules are confirmed separately in writing before work begins.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">3. Content and intellectual property</h2>
            <p className="mt-2">
              Website text, media, branding, and published materials are protected content. Reuse, redistribution, or commercial use requires prior written
              permission unless explicitly stated otherwise.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">4. Acceptable use</h2>
            <p className="mt-2">
              You agree not to submit misleading, abusive, or unlawful content through forms. Spam and automated abuse attempts may be blocked or reported.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">5. Liability and availability</h2>
            <p className="mt-2">
              We aim to keep information current and services available, but uninterrupted access and error-free operation are not guaranteed.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">6. Contact</h2>
            <p className="mt-2">
              For legal or policy questions, contact{" "}
              <a href="mailto:thesridharprakash@gmail.com" className="text-[var(--accent)] hover:underline">
                thesridharprakash@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
