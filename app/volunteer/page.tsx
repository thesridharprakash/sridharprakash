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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
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
      await fetch(
        "https://script.google.com/macros/s/AKfycbzSt7eCHxSPV_QHcbY7GpKIXnXVHVLyBA6txMMhCJmk7CzMBqx6gmFbXisAMbEnm3-8LQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data),
        }
      );
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed", err);
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
            Volunteer With Purpose
          </h1>
          <div className="w-16 h-1 bg-orange-600 mx-auto my-6" />
          <p className="text-gray-700">
            Join me in serving the people of Bengaluru through meaningful,
            grassroots action.
          </p>
        </motion.section>

        {/* WHY VOLUNTEER */}
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
            <div
              key={i}
              className="
                bg-white
                border border-gray-200
                rounded-xl
                p-6
                text-center
                shadow-sm
                transition-shadow transition-border
                hover:shadow-md
                hover:border-gray-300
              "
            >
              <item.icon className="h-8 w-8 text-orange-600 mx-auto" />

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </section>

        {/* VOLUNTEER FORM */}
        <section className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {!submitted ? (
            <>
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Volunteer Registration
              </h2>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <input
                  name="name"
                  required
                  placeholder="Full Name"
                  minLength={2}
                  className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                />

                <input
                  name="mobile"
                  type="tel"
                  required
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number"
                  placeholder="Mobile Number"
                  className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email (optional)"
                  className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                />

                <input
                  name="area"
                  placeholder="Area / Ward"
                  className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                />

                <select
                  name="interest"
                  className="w-full bg-white text-gray-900 border border-gray-300 p-3 rounded-md"
                >
                  <option>Ground-level volunteering</option>
                  <option>Event support</option>
                  <option>Social media & outreach</option>
                  <option>Professional expertise</option>
                </select>

                <label className="flex items-start gap-2 text-sm text-gray-600">
                  <input type="checkbox" name="consent" required />
                  <span>
                    I consent to being contacted regarding volunteer activities.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 rounded-md font-medium transition ${
                    submitting
                      ? "bg-gray-400 text-white"
                      : "bg-orange-600 hover:bg-orange-700 text-white"
                  }`}
                >
                  {submitting ? "Submitting..." : "Register as Volunteer"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12">
              <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Thank you for volunteering!
              </h2>
              <p className="mt-2 text-gray-600">
                We’ll be in touch with you soon.
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
