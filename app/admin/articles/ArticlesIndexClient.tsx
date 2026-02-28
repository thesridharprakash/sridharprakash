 "use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";
import type { ArticleMeta } from "@/app/articles/types/types";

type Props = {
  articles: ArticleMeta[];
};

type PreviewMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  img: string;
  videoUrl: string;
  voiceUrl: string;
  category: string;
  updatedAt?: string;
  updatedAtLabel?: string;
};

function getYouTubeEmbedUrl(input?: string) {
  if (!input) return "";
  try {
    const url = new URL(input);
    let videoId = "";
    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else if (url.searchParams.has("v")) {
      videoId = url.searchParams.get("v") ?? "";
    } else if (url.pathname.includes("/embed/")) {
      videoId = url.pathname.split("/embed/")[1].split("/")[0];
    }
    if (!videoId) return "";
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
}
export default function ArticlesIndexClient({ articles }: Props) {
  const [items, setItems] = useState(articles);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewMeta, setPreviewMeta] = useState<PreviewMeta | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const publishedCount = useMemo(
    () => items.filter((article) => article.status === "published").length,
    [items]
  );
  const draftCount = items.length - publishedCount;

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    setLoadingSlug(slug);
    setError(null);
    try {
      const response = await fetch(`/api/admin/articles?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!response.ok && payload?.error) {
        throw new Error(payload.error);
      }
      if (!response.ok) {
        throw new Error("Failed to delete article.");
      }
      setItems((prev) => prev.filter((article) => article.slug !== slug));
      if (previewSlug === slug) {
        setPreviewSlug(null);
        setPreviewHtml("");
        setPreviewMeta(null);
        setPreviewError(null);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoadingSlug(null);
    }
  };

  const loadPreview = async (article: ArticleMeta) => {
    if (previewSlug === article.slug) {
      setPreviewSlug(null);
      setPreviewHtml("");
      setPreviewMeta(null);
      setPreviewError(null);
      return;
    }

    setPreviewLoading(true);
    setPreviewError(null);

    try {
      const response = await fetch(`/api/admin/articles/detail?slug=${encodeURIComponent(article.slug)}`);
      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            article?: {
              title: string;
              summary: string;
              date: string;
              content: string;
              img: string;
              videoUrl: string;
              voiceUrl: string;
              category: string;
              updatedAt?: string;
              updatedAtLabel?: string;
            };
            error?: string;
          }
        | null;

      if (!response.ok || !payload?.article) {
        throw new Error(payload?.error || "Unable to load article preview.");
      }

      const processed = await remark().use(html).process(payload.article.content || "");
      setPreviewHtml(processed.toString());
      setPreviewSlug(article.slug);
      setPreviewMeta({
        slug: article.slug,
        title: payload.article.title,
        summary: payload.article.summary,
        date: payload.article.date,
        img: payload.article.img,
        videoUrl: payload.article.videoUrl,
        voiceUrl: payload.article.voiceUrl,
        category: payload.article.category,
        updatedAt: payload.article.updatedAt,
        updatedAtLabel: payload.article.updatedAtLabel,
      });
    } catch (err) {
      setPreviewError(String(err));
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Journal entries</p>
          <h2 className="text-3xl font-semibold text-white">Article Admin Index</h2>
          <p className="text-sm text-slate-300">
            {publishedCount} published • {draftCount} drafts
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-full border border-white/30 bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-[var(--accent-strong)]"
        >
          New article
        </Link>
      </div>

      {error ? <p className="text-xs text-rose-300">{error}</p> : null}

      <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
        <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-3 text-[11px] uppercase tracking-[0.3em] text-slate-500">
          <span>Entry</span>
          <span>Date</span>
          <span>Category</span>
          <span>Status</span>
          <span>Updated</span>
        </div>
        <div className="mt-3 space-y-3">
          {items.map((article) => (
            <div
              key={article.slug}
              className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-white/30"
            >
              <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-3 text-sm text-white/80">
                <div>
                  <div className="text-base font-semibold">{article.title}</div>
                  <p className="text-xs text-slate-400 line-clamp-2">{article.summary}</p>
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{article.date}</div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{article.category}</div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.4em] ${
                      article.status === "draft"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-200"
                    }`}
                  >
                    {article.status}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {article.updatedAtLabel ?? article.updatedAt ?? "—"}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.3em]">
                <Link
                  href={`/admin/articles/new?slug=${encodeURIComponent(article.slug)}`}
                  className="rounded-full border border-white/20 px-3 py-1 text-white transition hover:border-white"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => void loadPreview(article)}
                  className="rounded-full border border-white/20 px-3 py-1 text-white transition hover:border-white"
                >
                  {previewLoading && previewSlug === article.slug
                    ? "Loading preview…"
                    : previewSlug === article.slug
                      ? "Hide preview"
                      : "Preview"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(article.slug)}
                  disabled={loadingSlug === article.slug}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition ${
                    loadingSlug === article.slug
                      ? "border-rose-400 text-rose-300"
                      : "border-rose-400 hover:border-white"
                  }`}
                >
                  {loadingSlug === article.slug ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewSlug ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Preview</p>
              <h3 className="text-2xl font-semibold text-white">{previewMeta?.title}</h3>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {previewMeta?.date} · {previewMeta?.category}
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Updated {previewMeta?.updatedAtLabel ?? previewMeta?.updatedAt ?? "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPreviewSlug(null);
                setPreviewHtml("");
                setPreviewMeta(null);
                setPreviewError(null);
              }}
              className="text-xs uppercase tracking-[0.3em] text-slate-400 hover:text-white"
            >
              Close preview
            </button>
          </div>
          {previewMeta?.summary ? (
            <p className="text-sm italic text-slate-300">{previewMeta.summary}</p>
          ) : null}
          {previewMeta ? (
            (() => {
              const embedUrl = getYouTubeEmbedUrl(previewMeta.videoUrl);
              if (embedUrl) {
                return (
                  <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-black">
                    <div className="aspect-video">
                      <iframe
                        src={embedUrl}
                        title="YouTube video preview"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                );
              }
              if (previewMeta.img) {
                return (
                  <div className="mt-5 overflow-hidden rounded-3xl border border-white/5 bg-stone-900 bg-cover bg-center">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={previewMeta.img}
                        alt={previewMeta.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })()
          ) : null}
          {previewMeta?.voiceUrl ? (
            <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/5 p-3 text-xs uppercase tracking-[0.4em] text-amber-200">
              Voice clip:{" "}
              <a href={previewMeta.voiceUrl} target="_blank" rel="noreferrer" className="underline">
                Listen now
              </a>
            </div>
          ) : null}
          {previewError ? (
            <p className="text-xs text-rose-300">{previewError}</p>
          ) : previewLoading ? (
            <p className="text-xs text-slate-400">Loading preview…</p>
          ) : (
            <div className="mt-4">
              {previewHtml ? (
                <div
                  className="article-prose prose prose-slate max-w-none text-slate-100"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <p className="text-xs text-slate-400">No body content yet.</p>
              )}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
