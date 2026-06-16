"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryPost } from "@/lib/galleryPosts";

type Props = {
  initialPost?: GalleryPost | null;
};

type FormState = {
  id?: string;
  title: string;
  description: string;
  location: string;
  pieces: string;
  date: string;
  image: string;
};

const MAX_IMAGES = 10;

const baseState = (): FormState => ({
  title: "",
  description: "",
  location: "",
  pieces: "",
  date: "",
  image: "",
});

export default function GalleryEditorClient({ initialPost }: Props) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(baseState);
  const [slots, setSlots] = useState<string[]>(() => Array(MAX_IMAGES).fill(""));
  const [secret, setSecret] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPost) {
      setFormState(baseState());
      setSlots(Array(MAX_IMAGES).fill(""));
      setStatus(null);
      return;
    }
    setFormState({
      id: initialPost.id,
      title: initialPost.title,
      description: initialPost.description,
      location: initialPost.location,
      pieces: initialPost.pieces,
      date: initialPost.date,
      image: initialPost.image,
    });
    const filled = initialPost.images?.length
      ? initialPost.images
      : initialPost.image
        ? [initialPost.image]
        : [];
    const nextSlots = Array(MAX_IMAGES).fill("");
    filled.slice(0, MAX_IMAGES).forEach((path, index) => {
      nextSlots[index] = path;
    });
    setSlots(nextSlots);
  }, [initialPost]);

  useEffect(() => {
    if (formState.date) return;
    setFormState((prev) => ({ ...prev, date: new Date().toISOString().slice(0, 10) }));
  }, [formState.date]);

  const authFetch = useCallback(
    async (url: string, init: RequestInit = {}) => {
      const headers = {
        ...(init.headers ?? {}),
        ...(otpCode ? { "x-admin-otp": otpCode } : {}),
      };
      return fetch(url, { credentials: "include", ...init, headers });
    },
    [otpCode],
  );

  const filledSlots = useMemo(() => slots.filter(Boolean), [slots]);
  const primaryImage = slots[0] || formState.image;

  const handleSlotUpload = async (file: File, index: number) => {
    if (uploadingSlot !== null) return;
    if (!secret.trim()) {
      setUploadMessage("Enter the admin secret before uploading.");
      return;
    }
    setUploadingSlot(index);
    setUploadMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("secret", secret.trim());
    formData.append("baseName", `${formState.title || "gallery"}-${index}-${Date.now()}`);
    try {
      const response = await authFetch("/api/admin/gallery/image", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; path?: string; error?: string } | null;
      if (!response.ok || !payload?.path) {
        setUploadMessage(payload?.error || "Upload failed for that slot.");
        return;
      }
      setSlots((prev) => {
        const copy = [...prev];
        copy[index] = payload.path;
        return copy;
      });
      setFormState((prev) => ({ ...prev, image: prev.image || payload.path }));
      setUploadMessage("Image saved to slot.");
    } catch {
      setUploadMessage("Network error while uploading.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const clearSlot = (index: number) => {
    setSlots((prev) => {
      const copy = [...prev];
      copy[index] = "";
      return copy;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    if (!secret.trim()) {
      setError("Set the admin secret before saving.");
      return;
    }
    if (!formState.title) {
      setError("Title is required.");
      return;
    }
    const payload = {
      ...formState,
      images: filledSlots,
      secret: secret.trim(),
    };
    setSaving(true);
    setError(null);
    try {
      const response = await authFetch("/api/admin/gallery/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string };
      if (!response.ok) {
        setError(data?.error || "Unable to save.");
        return;
      }
      setStatus("Gallery entry saved. Redirecting…");
      router.push("/admin/gallery");
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {initialPost ? "Edit gallery entry" : "New gallery entry"}
            </p>
            <h1 className="text-3xl font-semibold text-white">
              {initialPost ? `Editing ${initialPost.title}` : "Upload a new event"}
            </h1>
            <p className="text-sm text-slate-300">Capture up to {MAX_IMAGES} frames per entry.</p>
          </div>
          <div className="text-right text-sm text-slate-400">
            <p>Slots filled: {filledSlots.length}/{MAX_IMAGES}</p>
            <p>Cover image: {primaryImage ? "locked" : "unset"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {slots.map((path, index) => (
          <label
            key={`slot-${index}`}
            className="relative flex cursor-pointer flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs uppercase tracking-[0.3em] text-slate-400 transition hover:border-white/30"
          >
            <span className="text-[10px] text-slate-400">Slot {index + 1}</span>
            <div className="relative h-32 w-full overflow-hidden rounded-xl border border-white/20 bg-black/30">
              {path ? (
                <Image src={path} alt={`Slot ${index + 1}`} fill className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-[10px] text-slate-500">
                  Empty
                </span>
              )}
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="invisible absolute inset-0"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleSlotUpload(file, index);
                }
                event.target.value = "";
              }}
              disabled={uploadingSlot !== null}
            />
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-[9px] text-white/50">{path ? "Change" : "Upload"}</span>
              {path ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    clearSlot(index);
                  }}
                  className="text-rose-300"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </label>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Title
            <input
              value={formState.title}
              onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              placeholder="Event headline"
              required
            />
          </label>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Location
            <input
              value={formState.location}
              onChange={(event) => setFormState((prev) => ({ ...prev, location: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              placeholder="City or route"
            />
          </label>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Description</label>
          <textarea
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
            rows={4}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            placeholder="Summarize the scene."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Pieces
            <input
              value={formState.pieces}
              onChange={(event) => setFormState((prev) => ({ ...prev, pieces: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              placeholder="e.g. 12 frames"
            />
          </label>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Capture date
            <input
              type="date"
              value={formState.date}
              onChange={(event) => setFormState((prev) => ({ ...prev, date: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
          </label>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Primary image path
            <input
              value={formState.image}
              onChange={(event) => setFormState((prev) => ({ ...prev, image: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              placeholder="/images/gallery/cover.jpg"
              required
            />
          </label>
          <p className="mt-1 text-xs text-slate-400">This selects the hero frame.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Admin secret
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
          </label>
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Authenticator code
            <input
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              placeholder="6-digit TOTP"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
          <button
            type="submit"
            disabled={saving}
            className={`rounded-full px-6 py-2 font-semibold transition ${
              saving ? "bg-white/20 text-slate-400" : "bg-[var(--accent)] text-slate-900 hover:bg-[var(--accent-strong)]"
            }`}
          >
            {saving ? "Saving…" : initialPost ? "Update gallery entry" : "Publish gallery entry"}
          </button>
          {status ? <span className="text-emerald-300">{status}</span> : null}
          {error ? <span className="text-rose-300">{error}</span> : null}
          {uploadMessage ? <span className="text-slate-300">{uploadMessage}</span> : null}
        </div>
      </form>
    </div>
  );
}
