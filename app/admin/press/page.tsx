"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageJsonEditor from "@/components/admin/PageJsonEditor";
import type { MediaPageContent, PressPageContent, PressMention } from "@/types/pageContent";

const defaultPressForm = {
  title: "",
  outlet: "",
  date: "",
  note: "",
  link: "",
  mediaType: "text" as const,
  mediaUrl: "",
  previewImage: "",
};

const defaultMediaForm = {
  title: "",
  type: "",
  image: "",
  description: "",
};

type AuthHeadersInit = RequestInit & { headers?: Record<string, string> };

export default function AdminPressPage() {
  const [otpCode, setOtpCode] = useState("");
  const [pressData, setPressData] = useState<PressPageContent | null>(null);
  const [mediaData, setMediaData] = useState<MediaPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [pressStatus, setPressStatus] = useState<string | null>(null);
  const [mediaStatus, setMediaStatus] = useState<string | null>(null);
  const [pressError, setPressError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState({ press: false, media: false });
  const [pressForm, setPressForm] = useState(defaultPressForm);
  const [mediaForm, setMediaForm] = useState(defaultMediaForm);
  const [showJson, setShowJson] = useState(false);

  const authFetch = useCallback(
    async (url: string, init: AuthHeadersInit = {}) => {
      const headers = {
        ...(init.headers ?? {}),
        ...(otpCode ? { "x-admin-otp": otpCode } : {}),
      };
      return fetch(url, { credentials: "include", ...init, headers });
    },
    [otpCode],
  );

  const loadContent = useCallback(async () => {
    setLoading(true);
    setPressError(null);
    setMediaError(null);
    try {
      const [pressResponse, mediaResponse] = await Promise.all([
        fetch("/api/admin/press", { credentials: "include" }),
        fetch("/api/admin/media", { credentials: "include" }),
      ]);
      const pressPayload = (await pressResponse.json().catch(() => null)) as { data?: PressPageContent } | null;
      const mediaPayload = (await mediaResponse.json().catch(() => null)) as { data?: MediaPageContent } | null;

      if (pressPayload?.data) {
        setPressData(pressPayload.data);
      } else {
        setPressError("Unable to load press content.");
      }
      if (mediaPayload?.data) {
        setMediaData(mediaPayload.data);
      } else {
        setMediaError("Unable to load media content.");
      }
    } catch {
      setPressError("Network error while loading press content.");
      setMediaError("Network error while loading media content.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const handleAddPressEntry = useCallback(async () => {
    if (!pressData) return;
    if (!pressForm.title.trim() || !pressForm.outlet.trim()) {
      setPressError("Title and outlet are required.");
      return;
    }

    const entry: PressMention = {
      title: pressForm.title.trim(),
      outlet: pressForm.outlet.trim(),
      date: pressForm.date.trim() || new Date().toLocaleDateString("en-US"),
      note: pressForm.note.trim(),
      link: pressForm.link.trim() || undefined,
      mediaType: pressForm.mediaType,
      mediaUrl: pressForm.mediaUrl.trim() || undefined,
      previewImage: pressForm.previewImage.trim() || undefined,
    };

    const updatedPress = {
      ...pressData,
      mediaCoverage: [entry, ...pressData.mediaCoverage],
    };

    setSubmitting((prev) => ({ ...prev, press: true }));
    setPressStatus(null);
    setPressError(null);
    try {
      const response = await authFetch("/api/admin/press", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPress),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        data?: PressPageContent;
        error?: string;
      } | null;
      if (!response.ok || !payload?.data) {
        setPressError(payload?.error || "Unable to save coverage.");
        return;
      }
      setPressData(payload.data);
      setPressStatus("Press coverage saved.");
      setPressForm(defaultPressForm);
    } catch {
      setPressError("Network error while saving coverage.");
    } finally {
      setSubmitting((prev) => ({ ...prev, press: false }));
    }
  }, [authFetch, pressData, pressForm]);

  const handleAddMediaFeature = useCallback(async () => {
    if (!mediaData) return;
    if (!mediaForm.title.trim()) {
      setMediaError("Title is required.");
      return;
    }

    const entry = {
      title: mediaForm.title.trim(),
      type: mediaForm.type.trim() || "Featured moment",
      image: mediaForm.image.trim() || "/images/og-image.jpg",
      description: mediaForm.description.trim(),
    };

    const updatedMedia = {
      ...mediaData,
      featuredSeries: [entry, ...mediaData.featuredSeries],
    };

    setSubmitting((prev) => ({ ...prev, media: true }));
    setMediaStatus(null);
    setMediaError(null);
    try {
      const response = await authFetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMedia),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        data?: MediaPageContent;
        error?: string;
      } | null;
      if (!response.ok || !payload?.data) {
        setMediaError(payload?.error || "Unable to save featured moment.");
        return;
      }
      setMediaData(payload.data);
      setMediaStatus("Featured moment added.");
      setMediaForm(defaultMediaForm);
    } catch {
      setMediaError("Network error while saving featured moment.");
    } finally {
      setSubmitting((prev) => ({ ...prev, media: false }));
    }
  }, [authFetch, mediaData, mediaForm]);

  const heroCopy = useMemo(() => {
    if (!pressData || !mediaData) return [];
    return [
      pressData.hero.title,
      mediaData.hero.title,
      pressData.hero.description,
      mediaData.hero.description,
    ];
  }, [mediaData, pressData]);

  return (
    <main className="min-h-screen bg-black/90 py-16 text-white">
      <section className="mx-auto max-w-5xl space-y-8 px-6">
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Protected Admin</p>
          <h1 className="text-4xl font-semibold">Press & Media Uploads</h1>
          <p className="text-sm text-slate-300">
            Manage interviews, press coverage, and featured media series from a single place. Authenticator code is required before changes can be published.
          </p>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Authenticator code</p>
              <input
                type="text"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                inputMode="numeric"
                className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Enter your MFA code once before saving coverage or featured updates.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow">
            <h2 className="text-lg font-semibold text-white">Log of what is visible on press</h2>
            {heroCopy.length ? (
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                {heroCopy.map((item, index) => (
                  <p key={`${item}-${index}`} className="leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400">Loading press & media hero content…</p>
            )}
          </div>
          <section className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 shadow">
            <h2 className="text-lg font-semibold text-white">Status</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Press updates: {pressStatus || (pressError ? pressError : loading ? "loading…" : "ready")}</p>
              <p>Media updates: {mediaStatus || (mediaError ? mediaError : loading ? "loading…" : "ready")}</p>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleAddPressEntry();
            }}
            className="space-y-3 rounded-3xl border border-white/10 bg-black/30 p-6 shadow"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Add Press Coverage</p>
              <h3 className="text-sm font-semibold text-white">Links, articles, and video coverage</h3>
            </div>
            <input
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Title"
              value={pressForm.title}
              onChange={(event) => setPressForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <input
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Outlet (source)"
              value={pressForm.outlet}
              onChange={(event) => setPressForm((prev) => ({ ...prev, outlet: event.target.value }))}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="Date"
                value={pressForm.date}
                onChange={(event) => setPressForm((prev) => ({ ...prev, date: event.target.value }))}
              />
              <select
                className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                value={pressForm.mediaType}
                onChange={(event) =>
                  setPressForm((prev) => ({ ...prev, mediaType: event.target.value as typeof pressForm.mediaType }))
                }
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
            </div>
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="One-line description"
              value={pressForm.note}
              onChange={(event) => setPressForm((prev) => ({ ...prev, note: event.target.value }))}
            />
            <input
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Primary link (article/video)"
              value={pressForm.link}
              onChange={(event) => setPressForm((prev) => ({ ...prev, link: event.target.value }))}
            />
            <input
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Alternate media URL (optional)"
              value={pressForm.mediaUrl}
              onChange={(event) => setPressForm((prev) => ({ ...prev, mediaUrl: event.target.value }))}
            />
            <input
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Preview image path (optional)"
              value={pressForm.previewImage}
              onChange={(event) => setPressForm((prev) => ({ ...prev, previewImage: event.target.value }))}
            />
            <button
              type="submit"
              disabled={submitting.press}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-black transition ${
                submitting.press ? "bg-white/30" : "bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
              }`}
            >
              {submitting.press ? "Saving…" : "Save press coverage"}
            </button>
            {pressError ? <p className="text-xs text-rose-300">{pressError}</p> : null}
          </form>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleAddMediaFeature();
            }}
            className="space-y-3 rounded-3xl border border-white/10 bg-black/30 p-6 shadow"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Add Media Moment</p>
              <h3 className="text-sm font-semibold text-white">Featured series and partnerships</h3>
            </div>
            <input
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Title"
              value={mediaForm.title}
              onChange={(event) => setMediaForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <input
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Type (series, campaign, format)"
              value={mediaForm.type}
              onChange={(event) => setMediaForm((prev) => ({ ...prev, type: event.target.value }))}
            />
            <input
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Image URL"
              value={mediaForm.image}
              onChange={(event) => setMediaForm((prev) => ({ ...prev, image: event.target.value }))}
            />
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Short summary"
              value={mediaForm.description}
              onChange={(event) => setMediaForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <button
              type="submit"
              disabled={submitting.media}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-black transition ${
                submitting.media ? "bg-white/30" : "bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
              }`}
            >
              {submitting.media ? "Saving…" : "Save featured media"}
            </button>
            {mediaError ? <p className="text-xs text-rose-300">{mediaError}</p> : null}
          </form>
        </div>

        {pressData ? (
          <section className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 shadow">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Coverage queue</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {pressData.mediaCoverage.length} entries
              </p>
            </header>
            <div className="grid gap-4">
              {pressData.mediaCoverage.map((item) => (
                <article key={`${item.title}-${item.outlet}-${item.date}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                    <span>{item.outlet}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{item.note}</p>
                  {item.link ? (
                    <p className="mt-3 text-xs text-[var(--accent)]">{item.link}</p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.4em] text-slate-400">
                    <span className="rounded-full border border-white/20 px-3 py-1 text-xs">{(item.mediaType ?? "text").toUpperCase()}</span>
                    {item.mediaUrl ? <span className="rounded-full border border-white/20 px-3 py-1 text-xs">Media asset</span> : null}
                    {item.previewImage ? <span className="rounded-full border border-white/20 px-3 py-1 text-xs">Image preview</span> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Raw data</p>
              <h2 className="text-lg font-semibold text-white">JSON payload</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowJson((prev) => !prev)}
              className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white"
            >
              {showJson ? "Hide payload" : "Show payload"}
            </button>
          </div>

          {showJson ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <PageJsonEditor
                title="Press JSON"
                description="Use this if you need to adjust hero copy or arrays directly."
                apiPath="/api/admin/press"
              />
              <PageJsonEditor
                title="Media JSON"
                description="Use this to refresh featured series or hero copy used on the homepage."
                apiPath="/api/admin/media"
              />
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Raw JSON is hidden by default to keep the admin page focused. Click “Show payload” when you need to edit the source data.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
