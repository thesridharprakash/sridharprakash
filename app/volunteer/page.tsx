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
      // mode: "no-cors" is used to bypass Google Apps Script CORS restrictions
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
    } catch (error) {
      console.error("Submission failed", error);
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Volunteer With Purpose</h1>
          <div className="w-16 h-1 bg-orange-600 mx-auto my-6"></div>
          <p className="text-gray-700">Join me in serving the people of Bengaluru.</p>
        </motion.div>

        <section className="mt-20">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-3xl mx-auto">
            {!submitted ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 text-center">Volunteer Registration</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {/* Name Validation */}
                  <input name="name" required placeholder="Full Name" className="w-full p-3 border rounded-md" minLength={2} />

                  {/* Mobile Validation: Exactly 10 digits starting with 6-9 */}
                  <input 
                    name="mobile" 
                    type="tel"
                    required 
                    placeholder="Mobile Number (10 digits)" 
                    pattern="[6-9][0-9]{9}" 
                    title="Please enter a valid 10-digit Indian mobile number."
                    className="w-full p-3 border rounded-md" 
                  />

                  {/* Email Validation: Standard email format */}
                  <input 
                    name="email" 
                    type="email"
                    placeholder="Email (optional)" 
                    className="w-full p-3 border rounded-md" 
                  />

                  <input name="area" placeholder="Area / Ward" className="w-full p-3 border rounded-md" />

                  <select name="interest" className="w-full p-3 border rounded-md">
                    <option>Ground-level volunteering</option>
                    <option>Event support</option>
                    <option>Social media & outreach</option>
                    <option>Professional expertise</option>
                  </select>

                  <label className="flex gap-2 text-sm text-gray-600">
                    <input type="checkbox" name="consent" required />
                    I consent to being contacted for volunteer activities.
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3 rounded-md font-medium transition ${
                      submitting ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700 text-white"
                    }`}
                  >
                    {submitting ? "Submitting..." : "Register as Volunteer"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">Thank you for volunteering</h2>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
