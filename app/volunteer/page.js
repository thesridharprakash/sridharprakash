"use client";
import Hero from "@/components/Hero";

<Hero
  title="Events & Community Engagements"
  subtitle="Public meetings, grassroots interactions, and citizen-first initiatives."
/>

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

  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;

    const data = {
      name: form.name.value,
      mobile: form.mobile.value,
      email: form.email.value,
      area: form.area.value,
      interest: form.interest.value,
      consent: form.consent.checked,
    };

    await fetch(
      "https://script.google.com/macros/s/AKfycbzSt7eCHxSPV_QHcbY7GpKIXnXVHVLyBA6txMMhCJmk7CzMBqx6gmFbXisAMbEnm3-8LQ/exec",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
            Volunteer With Purpose
          </h1>

          <div className="w-16 h-1 bg-orange-600 mx-auto my-6"></div>

          <p className="text-gray-700">
            Join me in serving the people of Bengaluru and contributing to
            nation-building through disciplined, grassroots public service.
          </p>
        </motion.div>

        {/* Why Volunteer */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {[
            {
              title: "Community Impact",
              text: "Contribute directly to local initiatives and grassroots efforts.",
              icon: UserGroupIcon,
            },
            {
              title: "Meaningful Engagement",
              text: "Participate in development-focused programs and events.",
              icon: HandRaisedIcon,
            },
            {
              title: "Nation Building",
              text: "Be part of initiatives that put citizens and country first.",
              icon: BuildingOffice2Icon,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-200 p-6 rounded-lg text-center hover:shadow-md transition"
            >
              <item.icon className="h-8 w-8 text-orange-600 mx-auto" />
              <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Form */}
        <section className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-3xl mx-auto"
          >
            {!submitted ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 text-center">
                  Volunteer Registration
                </h2>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <input name="name" required placeholder="Full Name" className="input" />
                  <input name="mobile" required placeholder="Mobile Number" className="input" />
                  <input name="email" placeholder="Email (optional)" className="input" />
                  <input name="area" placeholder="Area / Ward" className="input" />

                  <select name="interest" className="input">
                    <option>Ground-level volunteering</option>
                    <option>Event support</option>
                    <option>Social media & outreach</option>
                    <option>Professional expertise</option>
                  </select>

                  <label className="flex gap-2 text-sm text-gray-600">
                    <input type="checkbox" name="consent" required />
                    I consent to being contacted for volunteer activities.
                  </label>

                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-medium transition">
                    Register as Volunteer
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  Thank you for volunteering
                </h2>
                <p className="mt-2 text-gray-700">
                  Our team will connect with you shortly.
                </p>
              </div>
            )}
          </motion.div>
        </section>

        {/* Privacy */}
        <p className="mt-10 text-xs text-gray-500 text-center max-w-xl mx-auto">
          Your information is used only for volunteer coordination and public engagement.
        </p>

      </div>
    </main>
  );
}
