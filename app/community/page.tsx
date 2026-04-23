"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BuildingOffice2Icon, CheckCircleIcon, HandRaisedIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { getAttributionContext, trackEvent } from "@/lib/analytics";

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interest, setInterest] = useState("Volunteer for seva activities");
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: string; longitude: string; accuracy: string } | null>(null);
  const isSharingConcern = interest === "Share a local concern";

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported on this device.");
      return;
    }

    setLocationStatus("Fetching location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        const accuracy = Math.round(position.coords.accuracy).toString();
        setLocation({ latitude, longitude, accuracy });
        setLocationStatus("Location added to this request.");
      },
      () => {
        setLocationStatus("Could not fetch location. You can still type the location in the message.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;

    const attribution = getAttributionContext();
    const formData = new FormData(form);
    formData.set("attribution", JSON.stringify(attribution));
    if (location) {
      formData.set("latitude", location.latitude);
      formData.set("longitude", location.longitude);
      formData.set("accuracy", location.accuracy);
      formData.set("locationUrl", `https://www.google.com/maps?q=${location.latitude},${location.longitude}`);
    }

    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      mobile: (form.elements.namedItem("mobile") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      area: (form.elements.namedItem("area") as HTMLInputElement).value,
      interest: (form.elements.namedItem("interest") as HTMLSelectElement).value,
      concern: (form.elements.namedItem("concern") as HTMLTextAreaElement).value,
      consent: (form.elements.namedItem("consent") as HTMLInputElement).checked,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      attribution,
    };

    trackEvent("volunteer_submit_attempt", {
      form: "volunteer",
      interest: data.interest,
      source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
      campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
    });

    try {
      const response = await fetch("/api/community", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        trackEvent("volunteer_submit_error", {
          form: "volunteer",
          status: response.status,
          reason: payload?.error || "unknown_error",
        });
        setError(payload?.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }

      trackEvent("volunteer_submit_success", {
        form: "volunteer",
        source: attribution.last_touch.utm_source || attribution.first_touch.utm_source || "direct",
        campaign: attribution.last_touch.utm_campaign || attribution.first_touch.utm_campaign || "",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed", err);
      trackEvent("volunteer_submit_error", {
        form: "volunteer",
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Community Circle</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">Join Sridhar Prakash&apos;s community network.</h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
            Take part in seva, youth participation, public outreach, and constructive local work across Bengaluru.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Use this form to volunteer for community programs, support public outreach, or share a local concern that needs follow-up.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-12 md:grid-cols-3">
        {[
          {
            icon: UserGroupIcon,
            title: "Community Volunteers",
            text: "Join people working together on disciplined, people-first community activity.",
          },
          {
            icon: HandRaisedIcon,
            title: "Seva Volunteers",
            text: "Support public programs, local outreach, resident coordination, and follow-up work.",
          },
          {
            icon: BuildingOffice2Icon,
            title: "Public Updates",
            text: "Help keep residents informed through clear communication, event updates, and verified information.",
          },
        ].map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 + index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <item.icon className="h-7 w-7 text-[var(--accent)]" />
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{item.title}</p>
            <p className="mt-2 text-sm text-slate-300">{item.text}</p>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-8 md:p-10">
          {!submitted ? (
            <>
              <h2 className="font-display text-3xl text-white md:text-4xl">Community participation form</h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">Share your details and how you would like to connect with Sridhar Prakash&apos;s team.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input suppressHydrationWarning name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="volunteer-name" className="sr-only">
                      Full Name
                    </label>
                    <input
                      id="volunteer-name"
                      suppressHydrationWarning
                      name="name"
                      required
                      placeholder="Full Name"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="volunteer-mobile" className="sr-only">
                      Mobile Number
                    </label>
                    <input
                      id="volunteer-mobile"
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
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="volunteer-email" className="sr-only">
                      Email Address (optional)
                    </label>
                    <input
                      id="volunteer-email"
                      suppressHydrationWarning
                      name="email"
                      type="email"
                      placeholder="Email Address (optional)"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="volunteer-area" className="sr-only">
                      City or Area
                    </label>
                    <input
                      id="volunteer-area"
                      suppressHydrationWarning
                      name="area"
                      placeholder="Area / Ward"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="volunteer-interest" className="sr-only">
                    Interest
                  </label>
                  <select
                    id="volunteer-interest"
                    suppressHydrationWarning
                    name="interest"
                    value={interest}
                    onChange={(event) => setInterest(event.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#081025] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  >
                    <option>Volunteer for seva activities</option>
                    <option>Support public outreach</option>
                    <option>Share a local concern</option>
                    <option>Help with digital updates</option>
                    <option>Event coordination support</option>
                  </select>
                </div>

                {isSharingConcern ? (
                  <>
                    <div>
                      <label htmlFor="volunteer-concern" className="sr-only">
                        Local Concern or Message
                      </label>
                      <textarea
                        id="volunteer-concern"
                        suppressHydrationWarning
                        name="concern"
                        rows={5}
                        maxLength={1200}
                        placeholder="Type your local concern, request, or message here"
                        className="min-h-32 w-full resize-y rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                      />
                      <p className="mt-2 text-xs text-slate-500">Please include the location and a short description.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Location</p>
                        <p className="mt-2 text-sm text-slate-400">
                          {location
                            ? `Added: ${location.latitude}, ${location.longitude} (approx. ${location.accuracy}m)`
                            : "Add your current location if the issue is tied to a specific place."}
                        </p>
                        {locationStatus ? <p className="mt-2 text-xs text-[var(--accent)]">{locationStatus}</p> : null}
                      </div>
                      <button
                        suppressHydrationWarning
                        type="button"
                        onClick={handleUseLocation}
                        className="rounded-full border border-[var(--accent)]/70 bg-[var(--accent)]/15 px-5 py-3 text-sm font-semibold text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[var(--accent)]/25"
                      >
                        Use my location
                      </button>
                    </div>

                    <div>
                      <label htmlFor="volunteer-photo" className="sr-only">
                        Upload Photo
                      </label>
                      <input
                        id="volunteer-photo"
                        suppressHydrationWarning
                        name="photo"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                      />
                      <p className="mt-2 text-xs text-slate-500">Optional: upload one JPG, PNG, or WEBP photo up to 5 MB.</p>
                    </div>
                  </>
                ) : null}

                <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <input suppressHydrationWarning type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
                  <span>
                    I agree to the <a href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</a> and{" "}
                    <a href="/terms" className="text-[var(--accent)] hover:underline">Terms</a>, and consent to being contacted by Sridhar Prakash&apos;s team about this request.
                  </span>
                </label>

                <motion.button
                  suppressHydrationWarning
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                    submitting ? "cursor-not-allowed bg-white/20 text-slate-200" : "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]"
                  }`}
                >
                  {submitting ? "Sending..." : "Submit Details"}
                </motion.button>

                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center" role="status" aria-live="polite" aria-atomic="true">
              <CheckCircleIcon className="mx-auto h-16 w-16 text-[var(--accent)]" />
              <h2 className="mt-4 font-display text-3xl text-white md:text-4xl">Details received</h2>
              <p className="mt-3 text-sm text-slate-300 md:text-base">Thank you. Sridhar Prakash&apos;s team will reach out shortly with next steps.</p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
