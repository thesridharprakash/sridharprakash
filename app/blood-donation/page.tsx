import type { Metadata } from "next";
import { HeartIcon, MegaphoneIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import BloodDonationForm from "./BloodDonationForm";

export const metadata: Metadata = {
  title: "Join the Blood Donation Initiative",
  description:
    "Register as a donor, volunteer, or organizer for blood donation camps and community health initiatives in Bengaluru.",
  keywords: [
    "Blood Donation Bengaluru",
    "Blood Donation Camp",
    "Volunteer Blood Donation",
    "Community Health Initiatives",
    "blood donor registration Bengaluru",
  ],
  alternates: {
    canonical: "/blood-donation",
  },
  openGraph: {
    title: "Join the Blood Donation Initiative",
    description:
      "Support life-saving blood donation efforts by registering as a donor, volunteer, or organizer in Bengaluru.",
    url: "/blood-donation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Blood Donation Initiative",
    description:
      "Support life-saving blood donation efforts by registering as a donor, volunteer, or organizer.",
  },
};

export default function BloodDonationPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-24 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,rgba(245,158,11,0.18),transparent_34%),radial-gradient(circle_at_12%_80%,rgba(56,189,248,0.14),transparent_42%)]" />

      <section className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Blood Donation Bengaluru
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
            Every Blood Donor is a Lifesaver
          </h1>
          <p className="mt-5 max-w-xl text-xl font-semibold text-slate-100 md:text-2xl">
            Join the Blood Donation Initiative
          </p>
          <p className="mt-3 max-w-xl text-base text-slate-300 md:text-lg">
            Support life-saving blood donation efforts by registering as a donor, volunteer, or organizer.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { icon: HeartIcon, label: "Register as a donor" },
              { icon: UserGroupIcon, label: "Volunteer at camps" },
              { icon: MegaphoneIcon, label: "Support awareness" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <item.icon className="h-6 w-6 text-[var(--accent)]" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="register" className="scroll-mt-28">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <h2 className="font-display text-2xl text-white">Register to support the initiative</h2>
            <p className="mt-1 text-sm text-slate-400">
              Share your details so our team can contact you about upcoming blood donation camps, donor registration, and volunteer opportunities.
            </p>
          </div>
          <BloodDonationForm />
        </div>
      </section>
    </main>
  );
}
