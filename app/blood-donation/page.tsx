import type { Metadata } from "next";
import { HeartIcon, MegaphoneIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import ShareButton from "@/components/ShareButton";
import BloodDonationForm from "./BloodDonationForm";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.sridharprakash.in";
const faqs = [
  {
    question: "Who can register for blood donation?",
    answer: "Residents who are interested in donating blood, volunteering, organizing camps, or supporting awareness can register their interest.",
  },
  {
    question: "Is blood donation eligibility checked?",
    answer: "Yes. Final donor eligibility will be confirmed by qualified medical professionals at the camp.",
  },
  {
    question: "Can I volunteer without donating blood?",
    answer: "Yes. You can help with camp coordination, awareness, registration support, or other volunteer roles.",
  },
  {
    question: "Can I help organize a camp in my area?",
    answer: "Yes. Share your area and select the organizer option so the team can follow up with you.",
  },
  {
    question: "How will I be contacted?",
    answer: "The team will contact you using the mobile number or email address submitted in the form.",
  },
];

export const metadata: Metadata = {
  title: "Blood Donation Initiative Bengaluru | Register as Donor or Volunteer",
  description:
    "Register your interest to donate blood, volunteer at blood donation camps, or support community health initiatives in Bengaluru.",
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
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Blood Donation Initiative",
    description:
      "Support life-saving blood donation efforts by registering as a donor, volunteer, or organizer.",
    images: ["/images/og-image.jpg"],
  },
};

export default function BloodDonationPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-24 text-[var(--foreground)] md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,rgba(245,158,11,0.18),transparent_34%),radial-gradient(circle_at_12%_80%,rgba(56,189,248,0.14),transparent_42%)]" />

      <section className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Blood Donation Bengaluru
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
            Register for Blood Donation Support
          </h1>
          <p className="mt-5 max-w-xl text-xl font-semibold text-slate-100 md:text-2xl">
            Every Blood Donor is a Lifesaver
          </p>
          <p className="mt-3 max-w-xl text-base text-slate-300 md:text-lg">
            Donate blood, volunteer at camps, or help organize life-saving community health initiatives.
          </p>
          <div className="mt-5">
            <ShareButton
              title="Join the Blood Donation Initiative"
              description="Join the Blood Donation Initiative and help support life-saving community health efforts."
              url={`${siteUrl}/blood-donation`}
              className="bg-[var(--accent)]/15"
            />
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { icon: HeartIcon, label: "Step 1: Fill your details" },
              { icon: UserGroupIcon, label: "Step 2: Select how you want to support" },
              { icon: MegaphoneIcon, label: "Step 3: Team contacts you for upcoming camps" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <item.icon className="h-6 w-6 text-[var(--accent)]" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
              <span className="font-semibold text-white">Eligibility note:</span> Final donor eligibility will be confirmed by qualified medical professionals at the camp.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
              <span className="font-semibold text-white">Safety note:</span> Blood donation camps will be coordinated with authorized medical teams and blood banks.
            </div>
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

      <section className="relative mx-auto max-w-6xl px-5 pb-14 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">FAQ</p>
          <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">Blood donation questions</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h3 className="text-base font-semibold text-white">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
