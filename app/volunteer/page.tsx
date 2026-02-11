"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserGroupIcon,
  HandRaisedIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;

    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      mobile: (form.elements.namedItem("mobile") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      area: (form.elements.namedItem("area") as HTMLInputElement).value,
      interest: (form.elements.namedItem("interest") as HTMLSelectElement).value,
      consent: (form.elements.namedItem("consent") as HTMLInputElement).checked,
    };

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed", err);
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    /* Solid background gradient - removed distracting pulse/blur elements */
    <main className="relative min-h-screen bg-gradient-to-br from-[#f8f5f2] to-[#eeebe8] px-6 py-24 md:py-32 text-[#332f2c]">
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-24">

        {/* HERO SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#2d2a27]">
            Volunteer With <span className="text-[#ff7000]">Purpose</span>
          </h1>
          
          <div className="flex items-center justify-center mt-8 gap-4">
             <div className="h-[1px] w-12 md:w-24 bg-[#ff7000] opacity-30"></div>
             <div className="w-1.5 h-1.5 rotate-45 bg-[#ff7000]"></div>
             <div className="h-[1px] w-12 md:w-24 bg-[#ff7000] opacity-30"></div>
          </div>

          <p className="text-[#635c55] text-lg leading-relaxed font-light mt-8">
            Join me in serving the people of Bengaluru through meaningful,
            grassroots action. Together, we build the future of 2026.
          </p>
        </motion.section>

        {/* WHY VOLUNTEER (Solid Cards) */}
        <section className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: UserGroupIcon,
              title: "Grassroots Engagement",
              text: "Work directly with communities and understand real issues.",
            },
            {
              icon: HandRaisedIcon,
              title: "Active Participation",
              text: "Contribute your time and skills to citizen-first initiatives.",
            },
            {
              icon: BuildingOffice2Icon,
              title: "Long-Term Impact",
              text: "Help build systems that create lasting change beyond elections.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="relative overflow-hidden bg-[#fcfaf8] border border-[#e5e0da] rounded-3xl p-8 text-center shadow-md transition-all"
            >
              <div className="bg-[#f8f5f2] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <item.icon className="h-8 w-8 text-[#ff7000]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#2d2a27] mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-[#7c746e] leading-relaxed font-light">{item.text}</p>
            </motion.div>
          ))}
        </section>

        {/* FORM SECTION (Solid Panel) */}
        <section className="max-w-3xl mx-auto">
          <div className="bg-white border border-[#e5e0da] rounded-[2.5rem] p-8 md:p-12 shadow-xl">
            {!submitted ? (
              <>
                <h2 className="text-2xl font-serif font-bold text-[#2d2a27] text-center mb-10">
                  Registration Portal
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      name="name"
                      required
                      placeholder="Full Name"
                      className="w-full bg-[#f8f5f2] border border-[#e5e0da] text-[#2d2a27] placeholder-[#7c746e] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff7000]/20 transition-all"
                    />
                    <input
                      name="mobile"
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      placeholder="Mobile Number"
                      className="w-full bg-[#f8f5f2] border border-[#e5e0da] text-[#2d2a27] placeholder-[#7c746e] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff7000]/20 transition-all"
                    />
                  </div>

                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-[#f8f5f2] border border-[#e5e0da] text-[#2d2a27] placeholder-[#7c746e] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff7000]/20 transition-all"
                  />

                  <input
                    name="area"
                    placeholder="Area / Ward in Bengaluru"
                    className="w-full bg-[#f8f5f2] border border-[#e5e0da] text-[#2d2a27] placeholder-[#7c746e] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff7000]/20 transition-all"
                  />

                  <select
                    name="interest"
                    className="w-full bg-[#f8f5f2] border border-[#e5e0da] text-[#635c55] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff7000]/20 transition-all"
                  >
                    <option>Ground-level volunteering</option>
                    <option>Event support</option>
                    <option>Social media & outreach</option>
                    <option>Professional expertise</option>
                  </select>

                  <label className="flex items-center gap-3 text-sm text-[#635c55] px-2 cursor-pointer">
                    <input type="checkbox" name="consent" required className="accent-[#ff7000] w-4 h-4" />
                    <span>I consent to being contacted for volunteer activities.</span>
                  </label>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg transition-all ${
                      submitting
                        ? "bg-[#e5e0da] text-white cursor-not-allowed"
                        : "bg-[#ff7000] hover:bg-[#e66500] text-white"
                    }`}
                  >
                    {submitting ? "Processing..." : "Submit Registration"}
                  </motion.button>

                  {error ? (
                    <p className="text-sm text-red-600 text-center" role="alert">
                      {error}
                    </p>
                  ) : null}
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-10"
              >
                <CheckCircleIcon className="w-20 h-20 text-[#ff7000] mx-auto mb-6" />
                <h2 className="text-2xl font-serif font-bold text-[#2d2a27] mb-4">
                  Registration Successful!
                </h2>
                <p className="text-[#635c55]">
                  Thank you for volunteering. We will reach out to you shortly with next steps.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
