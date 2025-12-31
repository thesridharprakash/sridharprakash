"use client";

import { useState } from "react";

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

  await fetch("https://script.google.com/macros/s/AKfycbx97Uh4XJPeK_NhAEl9KhwF05l129gJlNXcD8_PLhpXA-psrEuFfRGPyibJDkXpT9jkPA/exec", {
    method: "POST",
    body: JSON.stringify(data),
  });

  setSubmitted(true);
}


  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight text-center">
          Volunteer With Me
        </h1>

        <p className="mt-4 text-gray-700 text-center">
          Join me in serving the people of Bengaluru and contributing to
          nation-building through disciplined, grassroots public service.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
               type="text"
                name="name"
                required
                placeholder="Your full name"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
                focus:border-orange-600 focus:outline-none"
              />

            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
               type="tel"
               name="mobile"
               required
               placeholder="10-digit mobile number"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
               focus:border-orange-600 focus:outline-none"
            />

            </div>

            {/* Email */}
             <div>
             <label className="block text-sm font-medium text-gray-700">
               Email Address (optional)
             </label>
               <input
                type="email"
                name="email"
                placeholder="you@example.com"
                 className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
                  focus:border-orange-600 focus:outline-none"
               />

             </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Area / Ward (Bengaluru)
              </label>
              <input
               type="text"
               name="area"
               placeholder="Your area or ward"
               className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
                focus:border-orange-600 focus:outline-none"
             />

            </div>

            {/* Interest */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                How would you like to contribute?
              </label>
              <select
               name="interest"
               className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
               focus:border-orange-600 focus:outline-none"
              >

                <option>Ground-level volunteering</option>
                <option>Event support</option>
                <option>Social media & outreach</option>
                <option>Professional expertise</option>
              </select>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-2">
              <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 accent-orange-600"
             />

                <p className="text-sm text-gray-600">
                I consent to being contacted via phone, email, or messaging platforms
                regarding volunteer activities and public initiatives.
              </p>
            </div>


            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-md font-medium hover:bg-orange-700 transition"
            >
              Register as Volunteer
            </button>
            <p className="mt-6 text-xs text-gray-500 text-center">
             Your personal information is used only for volunteer coordination and
             public initiatives. We respect your privacy and do not share your data
             with third parties.
            </p>

          </form>
        ) : (
          <div className="mt-10 text-center">
            <div className="text-4xl">🙏</div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Thank you for volunteering
            </h2>
            <p className="mt-2 text-gray-700">
              Your willingness to serve is appreciated. Our team will
              connect with you shortly.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
