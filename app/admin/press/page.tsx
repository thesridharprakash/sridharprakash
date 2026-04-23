"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageJsonEditor from "@/components/admin/PageJsonEditor";
import type { FeaturedSeriesEntry, MediaPageContent, PressPageContent, PressMention } from "@/types/pageContent";

type PressMediaType = NonNullable<PressMention["mediaType"]>;
type PressSectionKey = "interviews" | "mediaCoverage";

type PressFormState = {
  title: string;
  outlet: string;
  date: string;
  note: string;
  link: string;
  mediaType: PressMediaType;
  mediaUrl: string;
  previewImage: string;
};

const pressMediaTypeOptions: Array<{ label: string; value: PressMediaType }> = [
  { label: "Article", value: "article" },
  { label: "Text", value: "text" },
  { label: "Video", value: "video" },
  { label: "Audio", value: "audio" },
];

const defaultPressForm: PressFormState = {
  title: "",
  outlet: "",
  date: "",
  note: "",
  link: "",
  mediaType: "article",
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

function buildPressEntry(form: PressFormState): PressMention {
  return {
    title: form.title.trim(),
    outlet: form.outlet.trim(),
    date: form.date.trim() || new Date().toISOString().slice(0, 10),
    note: form.note.trim(),
    link: form.link.trim() || undefined,
    mediaType: form.mediaType,
    mediaUrl: form.mediaUrl.trim() || undefined,
    previewImage: form.previewImage.trim() || undefined,
  };
}

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
  const [pressForm, setPressForm] = useState<PressFormState>(defaultPressForm);
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

  const savePressData = useCallback(
    async (updatedPress: PressPageContent, successMessage: string) => {
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
          setPressError(payload?.error || "Unable to save press coverage.");
          return false;
        }
        setPressData(payload.data);
        setPressStatus(successMessage);
        return true;
      } catch {
        setPressError("Network error while saving press coverage.");
        return false;
      } finally {
        setSubmitting((prev) => ({ ...prev, press: false }));
      }
    },
    [authFetch],
  );

  const saveMediaData = useCallback(
    async (updatedMedia: MediaPageContent, successMessage: string) => {
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
          setMediaError(payload?.error || "Unable to save featured media.");
          return false;
        }
        setMediaData(payload.data);
        setMediaStatus(successMessage);
        return true;
      } catch {
        setMediaError("Network error while saving featured media.");
        return false;
      } finally {
        setSubmitting((prev) => ({ ...prev, media: false }));
      }
    },
    [authFetch],
  );

  const handleAddPressEntry = useCallback(async () => {
    if (!pressData) return;
    if (!pressForm.title.trim() || !pressForm.outlet.trim()) {
      setPressError("Title and outlet are required.");
      return;
    }

    const entry = buildPressEntry(pressForm);
    const updatedPress = {
      ...pressData,
      mediaCoverage: [entry, ...pressData.mediaCoverage],
    };

    const saved = await savePressData(updatedPress, "Press coverage saved.");
    if (saved) {
      setPressForm(defaultPressForm);
    }
  }, [pressData, pressForm, savePressData]);

  const handleUpdatePressEntry = useCallback(
    async (section: PressSectionKey, index: number) => {
      if (!pressData) return;
      const entry = pressData[section][index];
      if (!entry?.title.trim() || !entry?.outlet.trim()) {
        setPressError("Title and outlet are required before saving an entry.");
        return;
      }
      await savePressData(pressData, "Press coverage updated.");
    },
    [pressData, savePressData],
  );

  const handleRemovePressEntry = useCallback(
    async (section: PressSectionKey, index: number) => {
      if (!pressData) return;
      const updatedPress = {
        ...pressData,
        [section]: pressData[section].filter((_, itemIndex) => itemIndex !== index),
      };
      await savePressData(updatedPress, "Press coverage removed.");
    },
    [pressData, savePressData],
  );

  const updatePressEntry = useCallback(
    (section: PressSectionKey, index: number, field: keyof PressFormState, value: string) => {
      setPressData((current) => {
        if (!current) return current;
        return {
          ...current,
          [section]: current[section].map((item, itemIndex) => {
            if (itemIndex !== index) return item;
            if (field === "mediaType") {
              return { ...item, mediaType: value as PressMediaType };
            }
            if (field === "link" || field === "mediaUrl" || field === "previewImage") {
              return { ...item, [field]: value.trim() || undefined };
            }
            return { ...item, [field]: value };
          }),
        };
      });
    },
    [],
  );

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

    const saved = await saveMediaData(updatedMedia, "Featured moment added.");
    if (saved) {
      setMediaForm(defaultMediaForm);
    }
  }, [mediaData, mediaForm, saveMediaData]);

  const updateMediaFeature = useCallback((index: number, field: keyof FeaturedSeriesEntry, value: string) => {
    setMediaData((current) => {
      if (!current) return current;
      return {
        ...current,
        featuredSeries: current.featuredSeries.map((item, itemIndex) => (
          itemIndex === index ? { ...item, [field]: value } : item
        )),
      };
    });
  }, []);

  const handleUpdateMediaFeature = useCallback(
    async (index: number) => {
      if (!mediaData) return;
      const entry = mediaData.featuredSeries[index];
      if (!entry?.title.trim()) {
        setMediaError("Title is required before saving featured media.");
        return;
      }
      await saveMediaData(mediaData, "Featured media updated.");
    },
    [mediaData, saveMediaData],
  );

  const handleRemoveMediaFeature = useCallback(
    async (index: number) => {
      if (!mediaData) return;
      const updatedMedia = {
        ...mediaData,
        featuredSeries: mediaData.featuredSeries.filter((_, itemIndex) => itemIndex !== index),
      };
      await saveMediaData(updatedMedia, "Featured media removed.");
    },
    [mediaData, saveMediaData],
  );

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
            Add and edit article, text, video, and audio links. Authenticator code is required before changes can be published.
          </p>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Authenticator code</p>
              <input
                suppressHydrationWarning
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
              <p className="mt-3 text-xs text-slate-400">Loading press & media hero content...</p>
            )}
          </div>
          <section className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 shadow">
            <h2 className="text-lg font-semibold text-white">Status</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Press updates: {pressStatus || (pressError ? pressError : loading ? "loading..." : "ready")}</p>
              <p>Media updates: {mediaStatus || (mediaError ? mediaError : loading ? "loading..." : "ready")}</p>
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
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Add Press Link</p>
              <h3 className="text-sm font-semibold text-white">Articles, text notes, videos, and audio</h3>
            </div>
            <input
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Title"
              value={pressForm.title}
              onChange={(event) => setPressForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <input
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Outlet or source"
              value={pressForm.outlet}
              onChange={(event) => setPressForm((prev) => ({ ...prev, outlet: event.target.value }))}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                suppressHydrationWarning
                className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="Date"
                value={pressForm.date}
                onChange={(event) => setPressForm((prev) => ({ ...prev, date: event.target.value }))}
              />
              <select
                suppressHydrationWarning
                className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                value={pressForm.mediaType}
                onChange={(event) =>
                  setPressForm((prev) => ({ ...prev, mediaType: event.target.value as PressMediaType }))
                }
              >
                {pressMediaTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              suppressHydrationWarning
              rows={3}
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Short description"
              value={pressForm.note}
              onChange={(event) => setPressForm((prev) => ({ ...prev, note: event.target.value }))}
            />
            <input
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Main link: article, text page, video, or audio"
              value={pressForm.link}
              onChange={(event) => setPressForm((prev) => ({ ...prev, link: event.target.value }))}
            />
            <input
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Upload link or alternate media URL"
              value={pressForm.mediaUrl}
              onChange={(event) => setPressForm((prev) => ({ ...prev, mediaUrl: event.target.value }))}
            />
            <input
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Preview image path (optional)"
              value={pressForm.previewImage}
              onChange={(event) => setPressForm((prev) => ({ ...prev, previewImage: event.target.value }))}
            />
            <button
              suppressHydrationWarning
              type="submit"
              disabled={submitting.press}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-black transition ${
                submitting.press ? "bg-white/30" : "bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
              }`}
            >
              {submitting.press ? "Saving..." : "Save press link"}
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
              <h3 className="text-sm font-semibold text-white">Featured series and public visuals</h3>
            </div>
            <input
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Title"
              value={mediaForm.title}
              onChange={(event) => setMediaForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <input
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Type (series, campaign, format)"
              value={mediaForm.type}
              onChange={(event) => setMediaForm((prev) => ({ ...prev, type: event.target.value }))}
            />
            <input
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Image URL"
              value={mediaForm.image}
              onChange={(event) => setMediaForm((prev) => ({ ...prev, image: event.target.value }))}
            />
            <textarea
              suppressHydrationWarning
              rows={3}
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Short summary"
              value={mediaForm.description}
              onChange={(event) => setMediaForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <button
              suppressHydrationWarning
              type="submit"
              disabled={submitting.media}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-black transition ${
                submitting.media ? "bg-white/30" : "bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
              }`}
            >
              {submitting.media ? "Saving..." : "Save featured media"}
            </button>
            {mediaError ? <p className="text-xs text-rose-300">{mediaError}</p> : null}
          </form>
        </div>

        {pressData ? (
          <section className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 shadow">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Edit uploaded press links</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update interview links and media coverage already shown on the public Press page.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {pressData.interviews.length + pressData.mediaCoverage.length} entries
              </p>
            </header>
            {(["interviews", "mediaCoverage"] as const).map((section) => (
              <div key={section} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                  {section === "interviews" ? "Interviews" : "Media Coverage"}
                </h3>
                <div className="grid gap-4">
                  {pressData[section].map((item, index) => (
                    <article key={`${section}-${item.title}-${item.outlet}-${index}`} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          suppressHydrationWarning
                          className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                          value={item.title}
                          onChange={(event) => updatePressEntry(section, index, "title", event.target.value)}
                          placeholder="Title"
                        />
                        <input
                          suppressHydrationWarning
                          className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                          value={item.outlet}
                          onChange={(event) => updatePressEntry(section, index, "outlet", event.target.value)}
                          placeholder="Outlet or source"
                        />
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          suppressHydrationWarning
                          className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                          value={item.date}
                          onChange={(event) => updatePressEntry(section, index, "date", event.target.value)}
                          placeholder="Date"
                        />
                        <select
                          suppressHydrationWarning
                          className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                          value={item.mediaType ?? "article"}
                          onChange={(event) => updatePressEntry(section, index, "mediaType", event.target.value)}
                        >
                          {pressMediaTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        suppressHydrationWarning
                        rows={3}
                        className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        value={item.note}
                        onChange={(event) => updatePressEntry(section, index, "note", event.target.value)}
                        placeholder="Short description"
                      />
                      <input
                        suppressHydrationWarning
                        className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        value={item.link ?? ""}
                        onChange={(event) => updatePressEntry(section, index, "link", event.target.value)}
                        placeholder="Main link: article, text page, video, or audio"
                      />
                      <input
                        suppressHydrationWarning
                        className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        value={item.mediaUrl ?? ""}
                        onChange={(event) => updatePressEntry(section, index, "mediaUrl", event.target.value)}
                        placeholder="Upload link or alternate media URL"
                      />
                      <input
                        suppressHydrationWarning
                        className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        value={item.previewImage ?? ""}
                        onChange={(event) => updatePressEntry(section, index, "previewImage", event.target.value)}
                        placeholder="Preview image path (optional)"
                      />
                      <div className="flex flex-wrap gap-3">
                        <button
                          suppressHydrationWarning
                          type="button"
                          disabled={submitting.press}
                          onClick={() => void handleUpdatePressEntry(section, index)}
                          className="rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[var(--accent-strong)] disabled:bg-white/30"
                        >
                          Save changes
                        </button>
                        <button
                          suppressHydrationWarning
                          type="button"
                          disabled={submitting.press}
                          onClick={() => void handleRemovePressEntry(section, index)}
                          className="rounded-full border border-rose-300/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100 transition hover:border-rose-200 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {mediaData ? (
          <section className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 shadow">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Edit uploaded featured media</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update the media cards shown in the public Media Resources section.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {mediaData.featuredSeries.length} entries
              </p>
            </header>
            <div className="grid gap-4">
              {mediaData.featuredSeries.map((item, index) => (
                <article key={`${item.title}-${index}`} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      suppressHydrationWarning
                      className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      value={item.title}
                      onChange={(event) => updateMediaFeature(index, "title", event.target.value)}
                      placeholder="Title"
                    />
                    <input
                      suppressHydrationWarning
                      className="rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      value={item.type}
                      onChange={(event) => updateMediaFeature(index, "type", event.target.value)}
                      placeholder="Type"
                    />
                  </div>
                  <input
                    suppressHydrationWarning
                    className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    value={item.image}
                    onChange={(event) => updateMediaFeature(index, "image", event.target.value)}
                    placeholder="Image URL"
                  />
                  <textarea
                    suppressHydrationWarning
                    rows={3}
                    className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    value={item.description}
                    onChange={(event) => updateMediaFeature(index, "description", event.target.value)}
                    placeholder="Description"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      suppressHydrationWarning
                      type="button"
                      disabled={submitting.media}
                      onClick={() => void handleUpdateMediaFeature(index)}
                      className="rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[var(--accent-strong)] disabled:bg-white/30"
                    >
                      Save changes
                    </button>
                    <button
                      suppressHydrationWarning
                      type="button"
                      disabled={submitting.media}
                      onClick={() => void handleRemoveMediaFeature(index)}
                      className="rounded-full border border-rose-300/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100 transition hover:border-rose-200 disabled:opacity-50"
                    >
                      Remove
                    </button>
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
              suppressHydrationWarning
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
                description="Use this to refresh featured series or hero copy used on the public Press page."
                apiPath="/api/admin/media"
              />
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Raw JSON is hidden by default to keep the admin page focused. Open the payload when you need to edit the source data.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
