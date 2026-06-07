import type { Metadata } from "next";
import { Suspense } from "react";
import EventRegistrationForm from "./EventRegistrationForm";

export const metadata: Metadata = {
  title: "Register for Event | Sridhar Prakash",
  description: "Register to attend or participate in a Sridhar Prakash community event.",
  alternates: { canonical: "/events/register" },
};

export default function EventRegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-24 text-[var(--foreground)] md:pb-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(245,158,11,0.15),transparent_35%),radial-gradient(circle_at_10%_82%,rgba(56,189,248,0.14),transparent_42%)]" />
      <section className="relative mx-auto max-w-3xl px-5 pb-14 pt-8 md:px-6 md:pt-12">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Event Registration</p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">Register for this event</h1>
        <p className="mt-3 text-sm text-slate-300 md:text-base">Share your details so the team can contact you with participation updates.</p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <EventRegistrationForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
