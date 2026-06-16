"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDaysIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { getAttributionContext, trackEvent } from "@/lib/analytics";
import bookContent from "@/data/pages/book.json";
import type { BookPageContent } from "@/types/pageContent";

const bookData = bookContent as BookPageContent;
const { hero, highlights, bookingTypes, faqHeading, bookingFaqs, form } = bookData;
const highlightIconMap = {
  "Youth Platform": CalendarDaysIcon,
  Seva: SparklesIcon,
  "Follow Up": ClockIcon,
};

const yuvaMorchaPillars = [
  {
    title: "Nation First",
    text: "BJP Yuva Morcha encourages young people to place national interest, public responsibility, and disciplined service at the center of their public life.",
  },
  {
    title: "Seva On The Ground",
    text: "Real leadership begins with listening, showing up, organizing responsibly, and helping people through practical local action.",
  },
  {
    title: "Youth With Purpose",
    text: "The platform gives young volunteers a way to build confidence, communication, teamwork, and civic awareness through meaningful participation.",
  },
  {
    title: "Digital Responsibility",
    text: "Young karyakartas can support verified communication, social media outreach, public updates, and technology-enabled citizen connection.",
  },
];

const participationSteps = [
  "Share your details and area of interest.",
  "The team reviews your availability, skills, and preferred area.",
  "You are connected with suitable seva, outreach, digital, or event coordination work.",
];

const districts = ["Bangalore Urban", "Bangalore Rural"];

const taluksByDistrict: Record<string, string[]> = {
  "Bangalore Urban": ["Bangalore North", "Bangalore South", "Bangalore East", "Anekal", "Yelahanka"],
  "Bangalore Rural": ["Devanahalli (Rural)", "Doddaballapur (Rural)", "Hoskote", "Nelamangala"],
};

const assemblyConstituencies = [
  "Anekal",
  "B.T.M. Layout",
  "Basavanagudi",
  "Bommanahalli",
  "Byatarayanapura",
  "C.V. Raman Nagar",
  "Dasarahalli",
  "Govindarajanagar",
  "Hebbal",
  "Jayanagar",
  "K.R. Pura",
  "Mahadevapura",
  "Malleshwaram",
  "Padmanabhanagar",
  "Pulakeshinagar",
  "Rajarajeshwarinagar",
  "Rajajinagar",
  "Sarvagnanagar",
  "Shanti Nagar",
  "Shivajinagar",
  "Vijayanagar",
  "Yelahanka",
  "Yeshwanthpur",
  "Chickpet",
  "Chamrajpet",
  "Gandhinagar",
];

const bbmpZones = [
  "East Zone",
  "West Zone",
  "South Zone",
  "North Zone",
  "Mahadevapura Zone",
  "Bommanahalli Zone",
  "RR Nagar Zone",
  "Yelahanka Zone",
  "Dasarahalli Zone",
];

export default function BookPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");
  const [selectedAssembly, setSelectedAssembly] = useState("");

  const talukOptions = selectedDistrict ? taluksByDistrict[selectedDistrict] ?? [] : [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const attribution = getAttributionContext();
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const mobile = (form.elements.namedItem("mobile") as HTMLInputElement).value;
    const brand = (form.elements.namedItem("brand") as HTMLInputElement).value;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value;
    const district = (form.elements.namedItem("district") as HTMLSelectElement).value;
    const taluk = (form.elements.namedItem("taluk") as HTMLSelectElement).value;
    const assembly = (form.elements.namedItem("assembly") as HTMLSelectElement).value;
    const zone = (form.elements.namedItem("zone") as HTMLSelectElement).value;
    const ward = (form.elements.namedItem("ward") as HTMLInputElement).value;
    const brief = (form.elements.namedItem("brief") as HTMLTextAreaElement).value;
    const consent = (form.elements.namedItem("consent") as HTMLInputElement).checked;
    const website = (form.elements.namedItem("website") as HTMLInputElement).value;

    const message = [
      "[YUVA MORCHA REQUEST]",
      `Participation type: ${type}`,
      `District: ${district || "-"}`,
      `Taluk: ${taluk || "-"}`,
      `Assembly Constituency: ${assembly || "-"}`,
      `Zone: ${zone || "-"}`,
      `Ward / Locality: ${ward || "-"}`,
      `Organization / Role: ${brand || "-"}`,
      `Mobile: ${mobile || "-"}`,
      `Message: ${brief}`,
    ].join("\n");

    setSubmitting(true);
    setError(null);

    trackEvent("booking_submit_attempt", {
      form: "booking",
      booking_type: type,
      source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
      campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadType: "yuva_morcha",
          name,
          email,
          mobile,
          area: [district, taluk, assembly, zone, ward].filter(Boolean).join(" | "),
          bookingType: type,
          brand,
          brief,
          consent,
          message,
          website,
          attribution,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        trackEvent("booking_submit_error", {
          form: "booking",
          status: response.status,
          reason: payload?.error || "unknown_error",
        });
        setError(payload?.error || "Could not submit details. Please try again.");
        setSubmitting(false);
        return;
      }

      trackEvent("booking_submit_success", {
        form: "booking",
        booking_type: type,
        source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
        campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
      });
      setSubmitted(true);
    } catch (submitError) {
      console.error("Yuva Morcha submission failed", submitError);
      trackEvent("booking_submit_error", {
        form: "booking",
        reason: "network_error",
      });
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_8%_80%,rgba(245,158,11,0.14),transparent_40%)]" />

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{hero.eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">{hero.title}</h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">{hero.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={hero.ctaHref}
              className="inline-flex rounded-full border border-white/30 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:border-white"
            >
              {hero.ctaLabel}
            </a>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-10 md:grid-cols-3">
        {highlights.map((highlight, index) => {
          const Icon = highlightIconMap[highlight.title] ?? CalendarDaysIcon;
          return (
            <article key={`${highlight.label}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Icon className="h-7 w-7 text-[var(--accent)]" />
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{highlight.label}</p>
              <p className="mt-2 text-sm text-slate-200">{highlight.description}</p>
            </article>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.88))] p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Purpose</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">A youth platform for service, discipline, and public leadership.</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300 md:text-base">
            BJP Yuva Morcha brings young people into constructive public work. The focus is not only participation, but preparation:
            learning how to serve people, communicate clearly, coordinate responsibly, and stand with the community when work needs to be done.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {yuvaMorchaPillars.map((pillar) => (
              <article key={pillar.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{pillar.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">How participation starts</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {participationSteps.map((step, index) => (
                <div key={step} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Step {index + 1}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-100">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">FAQ</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">{faqHeading}</h2>
          <div className="mt-6 space-y-3">
            {bookingFaqs.map((item) => (
              <article key={item.question} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-base font-semibold text-white md:text-lg">{item.question}</h3>
                <p className="mt-2 text-sm text-slate-300 md:text-base">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-8 md:p-10">
          {!submitted ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-3xl text-white md:text-4xl">{form.heading}</h2>
                <a
                  href={form.introLinkHref}
                  onClick={() => trackEvent("lead_click", { type: "email", section: "booking" })}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100 hover:border-white"
                >
                  {form.introLinkLabel}
                </a>
              </div>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                  suppressHydrationWarning
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="book-name" className="sr-only">
                      Your Name
                    </label>
                    <input
                      id="book-name"
                      suppressHydrationWarning
                      name="name"
                      required
                      placeholder="Your Name"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="book-email" className="sr-only">
                      Your Email
                    </label>
                    <input
                      id="book-email"
                      suppressHydrationWarning
                      name="email"
                      type="email"
                      required
                      placeholder="Your Email"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="book-mobile" className="sr-only">
                      Mobile Number
                    </label>
                    <input
                      id="book-mobile"
                      suppressHydrationWarning
                      name="mobile"
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      title="Enter a valid 10-digit mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Mobile Number"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="book-brand" className="sr-only">
                      Organization or Role (optional)
                    </label>
                    <input
                      id="book-brand"
                      suppressHydrationWarning
                      name="brand"
                      placeholder="Organization / Role (optional)"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="book-type" className="sr-only">
                      Participation Type
                    </label>
                    <select
                      id="book-type"
                      suppressHydrationWarning
                      name="type"
                      defaultValue={bookingTypes[0]}
                      className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    >
                      {bookingTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="book-district" className="sr-only">
                      District
                    </label>
                    <select
                      id="book-district"
                      suppressHydrationWarning
                      name="district"
                      required
                      value={selectedDistrict}
                      onChange={(event) => {
                        setSelectedDistrict(event.target.value);
                        setSelectedTaluk("");
                      }}
                      className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    >
                      <option value="" disabled>
                        Step 1: Select District
                      </option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="book-taluk" className="sr-only">
                      Taluk
                    </label>
                    <select
                      id="book-taluk"
                      suppressHydrationWarning
                      name="taluk"
                      required
                      disabled={!selectedDistrict}
                      value={selectedTaluk}
                      onChange={(event) => setSelectedTaluk(event.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    >
                      <option value="" disabled>
                        Step 2: Select Taluk
                      </option>
                      {talukOptions.map((taluk) => (
                        <option key={taluk} value={taluk}>
                          {taluk}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="book-assembly" className="sr-only">
                      Assembly Constituency
                    </label>
                    <select
                      id="book-assembly"
                      suppressHydrationWarning
                      name="assembly"
                      required
                      value={selectedAssembly}
                      onChange={(event) => setSelectedAssembly(event.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    >
                      <option value="" disabled>
                        Step 3: Select Assembly Constituency
                      </option>
                      {assemblyConstituencies.map((assembly) => (
                        <option key={assembly} value={assembly}>
                          {assembly}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="book-zone" className="sr-only">
                      Zone Optional
                    </label>
                    <select
                      id="book-zone"
                      suppressHydrationWarning
                      name="zone"
                      defaultValue=""
                      className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    >
                      <option value="">Step 4: Select Zone (optional)</option>
                      {bbmpZones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="book-ward" className="sr-only">
                      Ward
                    </label>
                    <input
                      id="book-ward"
                      suppressHydrationWarning
                      name="ward"
                      disabled={!selectedAssembly}
                      placeholder={selectedAssembly ? "Step 5: Enter Ward / Booth / Locality" : "Step 5: Select Assembly first"}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="book-brief" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="book-brief"
                    suppressHydrationWarning
                    name="brief"
                    required
                    rows={5}
                    placeholder="Tell us why you want to join BJP Yuva Morcha, your area, skills, availability, or how you would like to support the team."
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                </div>
                <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <input
                    suppressHydrationWarning
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
                  />
                  <span>
                    I agree to the <Link href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link> and{" "}
                    <Link href="/terms" className="text-[var(--accent)] hover:underline">Terms</Link>, and consent to being contacted by the BJP Yuva Morcha team about this request.
                  </span>
                </label>
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={submitting}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                    submitting
                      ? "cursor-not-allowed bg-white/20 text-slate-200"
                      : "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]"
                  }`}
                >
                  {submitting ? "Sending..." : form.buttonLabel}
                </button>
                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            </>
          ) : (
            <div className="text-center" role="status" aria-live="polite" aria-atomic="true">
              <h2 className="font-display text-3xl text-white md:text-4xl">{form.successTitle}</h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">{form.successDescription}</p>
              <Link
                href={form.successLinkHref}
                className="mt-6 inline-flex rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:border-white"
              >
                {form.successLinkLabel}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
