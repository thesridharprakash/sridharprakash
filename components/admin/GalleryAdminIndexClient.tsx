"use client";

import Image from "next/image";
import Link from "next/link";
import type { GalleryPost } from "@/lib/galleryPosts";
import { useCallback, useMemo, useState } from "react";
import ClientOnly from "@/components/ClientOnly";

type Props = {
  posts: GalleryPost[];
  featuredId: string | null;
};

export default function GalleryAdminIndexClient({ posts, featuredId }: Props) {
  const [items, setItems] = useState<GalleryPost[]>(posts);
  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0)),
    [items],
  );
  const [currentFeatured, setCurrentFeatured] = useState<string | null>(featuredId);
  const [secret, setSecret] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleSetFeatured = async (id: string | null) => {
    if (!secret.trim()) {
      setError("Enter the admin secret before marking a featured story.");
      return;
    }
    setLoading(true);
    setStatus(null);
    setError(null);
    try {
      const response = await authFetch("/api/admin/gallery/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, secret: secret.trim() }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string };
      if (!response.ok || !payload?.ok) {
        setError(payload?.error || "Unable to set featured story.");
        return;
      }
      setCurrentFeatured(id);
      setStatus("Featured story updated.");
    } catch {
      setError("Network error while updating featured story.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: GalleryPost) => {
    const confirmed = window.confirm(`Delete gallery entry "${post.title}"?`);
    if (!confirmed) return;

    setDeletingId(post.id);
    setStatus(null);
    setError(null);
    try {
      const response = await authFetch(`/api/admin/gallery/posts?id=${encodeURIComponent(post.id)}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !payload?.ok) {
        setError(payload?.error || "Unable to delete gallery entry.");
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== post.id));
      if (currentFeatured === post.id) {
        setCurrentFeatured(null);
      }
      setStatus("Gallery entry deleted.");
    } catch {
      setError("Network error while deleting gallery entry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Uploads index</p>
            <h2 className="text-3xl font-semibold text-white">Latest multi-frame posts</h2>
            <p className="text-sm text-slate-300">Tap a card to edit the associated gallery story.</p>
          </div>
          <Link
            href="/admin/gallery/new"
            className="rounded-full border border-white/30 bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-[var(--accent-strong)]"
          >
            New gallery entry
          </Link>
        </div>
        <ClientOnly
          fallback={
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.3em] text-slate-200">
              <div className="h-20 rounded-2xl bg-white/5" />
            </div>
          }
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.3em] text-slate-200">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-[10px] tracking-[0.4em] text-white/70">
                Admin secret
                <input
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white"
                  placeholder="Set in ADMIN_ARTICLES_SECRET"
                />
              </label>
              <label className="text-[10px] tracking-[0.4em] text-white/70">
                Authenticator code
                <input
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white"
                  placeholder="6-digit TOTP"
                />
              </label>
              <div className="flex flex-wrap items-end gap-3 text-[10px] tracking-[0.4em]">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStatus(null)}
                  className="rounded-2xl border border-white/20 px-4 py-2 text-white transition hover:border-white"
                >
                  Ready to mark featured
                </button>
                <button
                  type="button"
                  disabled={loading || !currentFeatured}
                  onClick={() => handleSetFeatured(null)}
                  className="rounded-2xl border border-white/20 px-4 py-2 text-white transition hover:border-white disabled:border-white/10 disabled:text-white/40"
                >
                  Clear featured
                </button>
                {status ? <span className="text-[10px] text-emerald-300">{status}</span> : null}
                {error ? <span className="text-[10px] text-rose-400">{error}</span> : null}
              </div>
            </div>
          </div>
        </ClientOnly>
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((post) => (
          <article key={post.id} className="rounded-3xl border border-white/10 bg-black/20">
            <div className="relative h-40 w-full">
              <Image src={post.image} alt={post.title} fill className="object-cover" sizes="50vw" />
            </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  <span>{post.location}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-1 text-2xl font-semibold text-white">{post.title}</h3>
                <p className="mt-2 text-sm text-slate-300 line-clamp-3">{post.description}</p>
                <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  <span>{post.pieces}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/gallery/new?id=${post.id}`}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(post)}
                      disabled={deletingId === post.id || loading}
                      className="rounded-full border border-rose-300/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200 transition hover:border-rose-200 disabled:opacity-50"
                    >
                      {deletingId === post.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
                <ClientOnly
                  fallback={
                    <div className="mt-3 h-10 w-full rounded-2xl border border-white/20 bg-white/10" />
                  }
                >
                  <button
                    type="button"
                    onClick={() => handleSetFeatured(post.id)}
                    className={`mt-3 w-full rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                      currentFeatured === post.id
                        ? "border-[var(--accent)] bg-[var(--accent-strong)] text-black"
                        : "border-white/20 text-white hover:border-white/40"
                    }`}
                  >
                    {currentFeatured === post.id ? "Featured story" : "Mark featured"}
                  </button>
                </ClientOnly>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
