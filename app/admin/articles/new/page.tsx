"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import { TotpSetupInfo } from "@/app/admin/types";

type SubmitState = {
  ok: boolean;
  message: string;
  slug?: string;
};

type UploadEntry = {
  name: string;
  path: string;
  size: number;
  updatedAt: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function AdminNewArticlePageInner() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [date, setDate] = useState("");
  const [img, setImg] = useState("/images/og-image.jpg");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [voiceUrl, setVoiceUrl] = useState("");
  const [category, setCategory] = useState<"journal" | "video" | "voice">("journal");
  const [secret, setSecret] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [result, setResult] = useState<SubmitState | null>(null);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [totpInfo, setTotpInfo] = useState<TotpSetupInfo | null>(null);
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState<string | null>(null);
  const [totpCopyMessage, setTotpCopyMessage] = useState<string | null>(null);
  const totpCopyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [previewHtml, setPreviewHtml] = useState(
    "<p class='text-slate-400 text-xs'>Preview updates as you type.</p>"
  );
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [logEntries, setLogEntries] =
    useState<{ timestamp: string; action: string; payload: Record<string, unknown> }[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");

  const suggestedSlug = useMemo(() => {
    if (!date) return "";
    return slugify(`${date}-${title}`);
  }, [date, title]);
  const finalSlug = slug || suggestedSlug;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setDate((prev) => prev || getToday());
  }, []);

  const authFetch = useCallback(
    async (url: string, init: RequestInit = {}) => {
      const headers = {
        ...(init.headers ?? {}),
        ...(otpCode ? { "x-admin-otp": otpCode } : {}),
      };
      return fetch(url, { credentials: "include", ...init, headers });
    },
    [otpCode]
  );

  const submitArticle = useCallback(
    async (targetStatus: "published" | "draft") => {
      if (submitting) return;

      setSubmitting(true);
      setResult(null);

      try {
        const response = await authFetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            summary,
            date,
            img,
            slug,
            category,
            content,
            videoUrl,
            voiceUrl,
            overwrite: Boolean(selectedSlug),
            secret,
            status: targetStatus,
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { ok?: boolean; slug?: string; status?: string; storage?: "github" | "local"; error?: string }
          | null;

        if (!response.ok) {
          setResult({
            ok: false,
            message:
              payload?.error ||
              (targetStatus === "draft" ? "Failed to save draft." : "Failed to publish article."),
          });
          return;
        }

        const publishedSlug = payload?.slug || finalSlug;

        setSlug(publishedSlug);
        setSelectedSlug(publishedSlug);
        setFormStatus(targetStatus);

        setResult({
          ok: true,
          message:
            payload?.storage === "github"
              ? targetStatus === "draft"
                ? "Draft saved to GitHub. It will appear in the admin list after Vercel deploys the new commit, and it stays hidden publicly until you publish."
                : "Article published to GitHub. It will appear on the site after Vercel deploy completes."
              : targetStatus === "draft"
                ? "Draft saved successfully."
                : "Article published successfully.",
          slug: publishedSlug,
        });
      } catch {
        setResult({ ok: false, message: "Network error while publishing article." });
      } finally {
        setSubmitting(false);
      }
    },
    [
      authFetch,
      category,
      content,
      date,
      finalSlug,
      img,
      selectedSlug,
      slug,
      summary,
      videoUrl,
      voiceUrl,
      title,
      secret,
      submitting,
    ]
  );

  const handlePublish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitArticle("published");
  };

  async function handleImageUpload(file: File) {
    if (!secret.trim()) {
      setUploadMessage("Enter Admin Secret before uploading image.");
      return;
    }

    setUploadingImage(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("secret", secret);
      formData.append("baseName", title || "article-image");

      const response = await authFetch("/api/admin/articles/image", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; path?: string; error?: string }
        | null;

      if (!response.ok || !payload?.path) {
        setUploadMessage(payload?.error || "Image upload failed.");
        return;
      }

      setImg(payload.path);
      setUploadMessage(`Image uploaded: ${payload.path}`);
    } catch {
      setUploadMessage("Network error while uploading image.");
    } finally {
      setUploadingImage(false);
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const loadUploads = useCallback(async () => {
    setLoadingUploads(true);
    try {
      const response = await authFetch("/api/admin/articles/image/list");
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; uploads?: UploadEntry[] }
        | null;
      if (payload?.uploads) {
        setUploads(payload.uploads);
      }
    } finally {
      setLoadingUploads(false);
    }
  }, [authFetch]);

  useEffect(() => {
    void loadUploads();
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      if (totpCopyTimeoutRef.current) {
        clearTimeout(totpCopyTimeoutRef.current);
      }
    };
  }, [loadUploads]);

  const fetchTotpInfo = useCallback(async () => {
    if (!secret.trim()) {
      setTotpError("Enter Admin Secret before loading authenticator info.");
      setTotpInfo(null);
      return;
    }

    setTotpLoading(true);
    setTotpError(null);
    try {
      const response = await fetch("/api/admin/mfa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            secret?: string;
            qrCode?: string;
            provisioningUri?: string;
            error?: string;
          }
        | null;
      if (!response.ok || !payload?.ok) {
        setTotpError(payload?.error || "Unable to load authenticator info.");
        setTotpInfo(null);
        return;
      }
      if (!payload.secret || !payload.qrCode) {
        setTotpError("Authenticator setup is not available yet.");
        setTotpInfo(null);
        return;
      }
      setTotpInfo({
        secret: payload.secret,
        qrCode: payload.qrCode,
        provisioningUri: payload.provisioningUri || "",
      });
    } catch {
      setTotpError("Unable to reach the authenticator setup service.");
      setTotpInfo(null);
    } finally {
      setTotpLoading(false);
    }
  }, [secret]);

  const loadLogs = useCallback(async () => {
    setLoadingLogs(true);
    setLogError(null);
    try {
      const response = await authFetch("/api/admin/logs");
      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            entries?: { timestamp: string; action: string; payload: Record<string, unknown> }[];
            error?: string;
          }
        | null;
      if (!response.ok) {
        setLogError(payload?.error || "Failed to fetch logs.");
        return;
      }
      setLogEntries(payload?.entries || []);
    } finally {
      setLoadingLogs(false);
    }
  }, [authFetch]);

  const handleLogout = useCallback(async () => {
    setLogoutError(null);
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        setLogoutError("Failed to log out.");
        return;
      }
      router.push("/admin/login");
    } catch {
      setLogoutError("Unable to reach the logout service.");
    }
  }, [router]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Image path copied to clipboard.");
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setCopyMessage(null), 2500);
    } catch {
      setCopyMessage("Clipboard access denied.");
    }
  };

  const copyTotpSecret = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setTotpCopyMessage("Authenticator secret copied.");
      if (totpCopyTimeoutRef.current) {
        clearTimeout(totpCopyTimeoutRef.current);
      }
      totpCopyTimeoutRef.current = setTimeout(() => setTotpCopyMessage(null), 2500);
    } catch {
      setTotpCopyMessage("Clipboard access denied.");
    }
  };

  const loadArticleDetail = useCallback(
    async (slug: string) => {
      const response = await authFetch(`/api/admin/articles/detail?slug=${encodeURIComponent(slug)}`);
      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            article?: {
              slug: string;
              title: string;
              summary: string;
              date: string;
              img: string;
              videoUrl: string;
              voiceUrl?: string;
              category?: "journal" | "video" | "voice";
              status?: "draft" | "published";
              content: string;
            };
            error?: string;
          }
        | null;
      if (!response.ok || !payload?.article) {
        setArticleError(payload?.error || "Unable to load article.");
        return;
      }
      const { article } = payload;
      setTitle(article.title);
      setSummary(article.summary);
      setDate(article.date);
      setImg(article.img);
      setVideoUrl(article.videoUrl || "");
      setVoiceUrl(article.voiceUrl || "");
      setCategory(article.category as typeof category);
      setContent(article.content);
      setSlug(article.slug);
      setSelectedSlug(article.slug);
      setArticleError(null);
      setFormStatus(article.status === "draft" ? "draft" : "published");
      setResult(null);
    },
    [authFetch]
  );

  const querySlug = searchParams.get("slug") ?? "";
  useEffect(() => {
    if (!querySlug) return;
    void loadArticleDetail(querySlug);
  }, [querySlug, loadArticleDetail]);

  useEffect(() => {
    let active = true;
    (async () => {
      const processed = await remark().use(html).process(content || " ");
      if (active) {
        setPreviewHtml(processed.toString());
      }
    })();
    return () => {
      active = false;
    };
  }, [content]);

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 text-[var(--foreground)]">
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Admin</p>
            <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">Publish New Journal Article</h1>
            <p className="mt-2 text-sm text-slate-300 md:text-base">
              Creates a markdown file in <code>content/articles</code>.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white"
            >
              Log out
            </button>
            {logoutError ? (
              <p className="text-[11px] text-rose-300">{logoutError}</p>
            ) : null}
          </div>
        </div>

        <form onSubmit={handlePublish} className="mt-8 space-y-4 rounded-3xl border border-white/15 bg-black/25 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="admin-title" className="mb-1 block text-sm text-slate-200">
                Title
              </label>
              <input
                id="admin-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400"
                placeholder="Article title"
              />
            </div>
            <div>
              <label htmlFor="admin-date" className="mb-1 block text-sm text-slate-200">
                Date
              </label>
              <input
                id="admin-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-summary" className="mb-1 block text-sm text-slate-200">
              Summary
            </label>
            <textarea
              id="admin-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              rows={2}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400"
              placeholder="Short teaser shown on the journal list page"
            />
          </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="admin-img" className="mb-1 block text-sm text-slate-200">
              Cover Image Path
            </label>
              <input
                id="admin-img"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white"
                placeholder="/images/og-image.jpg"
              />
              <p className="mt-2 text-xs text-slate-400">
                Or upload below to auto-fill this field.
              </p>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-3 block w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20"
                onChange={(e) => {
                  const nextFile = e.target.files?.[0];
                  if (nextFile) {
                    void handleImageUpload(nextFile);
                  }
                  e.currentTarget.value = "";
                }}
                disabled={uploadingImage}
              />
            {uploadMessage ? (
              <p className="mt-2 text-xs text-slate-300" role="status" aria-live="polite">
                {uploadMessage}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="admin-slug" className="mb-1 block text-sm text-slate-200">
              Custom Slug (optional)
            </label>
          <div className="flex gap-3">
            <input
              id="admin-slug"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white"
              placeholder={suggestedSlug || "auto-generated"}
            />
            {selectedSlug ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedSlug(null);
                  setSlug("");
                  setArticleError(null);
                }}
                className="rounded-full border border-rose-400/40 px-3 py-3 text-xs uppercase tracking-[0.18em] text-rose-200 transition hover:border-rose-200"
              >
                Clear selection
            </button>
          ) : null}
        </div>
        {articleError ? (
          <p className="mt-2 text-xs text-rose-300">{articleError}</p>
        ) : null}
        </div>
      </div>

        <p className="text-xs text-slate-400">Final slug: {finalSlug || "will be generated from date + title"}</p>

        <div className="mt-4">
          <label htmlFor="admin-video" className="mb-1 block text-sm text-slate-200">
            YouTube / Video URL (optional)
          </label>
          <input
            id="admin-video"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400"
            placeholder="https://youtu.be/abc123"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="admin-voice" className="mb-1 block text-sm text-slate-200">
            Voice / Audio Link (optional)
          </label>
          <input
            id="admin-voice"
            value={voiceUrl}
            onChange={(e) => setVoiceUrl(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400"
            placeholder="https://podcast.example/voice123"
          />
          <p className="mt-2 text-xs text-slate-400">
            Share a link to a trimmed voice note, podcast, or audio clip connected to this article.
          </p>
        </div>
        <div className="mt-4">
          <label htmlFor="admin-category" className="mb-1 block text-sm text-slate-200">
            Article Category
          </label>
          <select
            id="admin-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white"
          >
            <option value="journal">Journal / Text</option>
            <option value="video">Video</option>
            <option value="voice">Voice / Audio</option>
          </select>
        </div>

          <div>
            <label htmlFor="admin-content" className="mb-1 block text-sm text-slate-200">
              Markdown Content
            </label>
            <textarea
              id="admin-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={14}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400"
              placeholder="Write article markdown here..."
            />
          </div>

          <div>
            <label htmlFor="admin-secret" className="mb-1 block text-sm text-slate-200">
              Admin Secret
            </label>
            <input
              id="admin-secret"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white"
              placeholder="Set in ADMIN_ARTICLES_SECRET"
            />
          </div>

          <div>
            <label htmlFor="admin-otp" className="mb-1 block text-sm text-slate-200">
              Authenticator Code
            </label>
            <input
              id="admin-otp"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white"
              placeholder="6-digit code"
            />
            <p className="mt-2 text-xs text-slate-400">
              Google Authenticator code is required to publish. Draft saves and image uploads can use only the admin secret.
            </p>
          </div>

          <section className="mt-4 rounded-3xl border border-white/15 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Multi-factor setup</p>
                <h2 className="text-lg font-semibold text-white">Google Authenticator</h2>
              </div>
              <button
                type="button"
                onClick={() => void fetchTotpInfo()}
                className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white"
              >
                Load QR
              </button>
            </div>
            {totpLoading ? (
              <p className="mt-3 text-xs text-slate-400">Loading authenticator info…</p>
            ) : totpError ? (
              <p className="mt-3 text-xs text-rose-300">{totpError}</p>
            ) : totpInfo ? (
              <div className="mt-4 grid gap-4 md:grid-cols-[150px_minmax(0,1fr)]">
                <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-3">
                  <Image
                    src={totpInfo.qrCode}
                    alt="Scan this code with Google Authenticator"
                    width={144}
                    height={144}
                    unoptimized
                    className="h-36 w-36 rounded-xl object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Manual secret</p>
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-semibold text-white">
                    {totpInfo.secret.match(/.{1,4}/g)?.join(" ") || totpInfo.secret}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void copyTotpSecret(totpInfo.secret)}
                      className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:border-white"
                    >
                      Copy secret
                    </button>
                    {totpInfo.provisioningUri ? (
                      <a
                        href={totpInfo.provisioningUri}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:border-white"
                      >
                        Open in authenticator
                      </a>
                    ) : null}
                  </div>
                  {totpCopyMessage ? (
                    <p className="text-[11px] text-emerald-400">{totpCopyMessage}</p>
                  ) : null}
                  <p className="text-xs text-slate-400">
                    Google Authenticator is free. Scan the QR code or paste the secret above to link your device.
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400">
                Enter your admin secret above and click <strong>Load QR</strong> to reveal the Google Authenticator setup.
              </p>
            )}
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={`rounded-full px-6 py-3 text-sm font-semibold ${
                submitting ? "cursor-not-allowed bg-white/20 text-slate-200" : "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]"
              }`}
            >
              {submitting ? "Publishing..." : "Publish Article"}
            </button>
            <button
              type="button"
              onClick={() => void submitArticle("draft")}
              disabled={submitting}
              className={`rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition ${
                submitting ? "cursor-not-allowed text-white/40" : "text-white hover:border-white/50"
              }`}
            >
              Save Draft
            </button>
            <div className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Status:{" "}
              <span
                className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase ${
                  formStatus === "draft"
                    ? "border-amber-400/50 text-amber-200 bg-amber-500/10"
                    : "border-emerald-400/50 text-emerald-200 bg-emerald-500/10"
                }`}
              >
                {formStatus}
              </span>
            </div>
          </div>

          {result ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                result.ok ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" : "border-red-400/30 bg-red-500/10 text-red-200"
              }`}
              role={result.ok ? "status" : "alert"}
              aria-live="polite"
            >
              <p>{result.message}</p>
              {result.ok && result.slug ? (
                <p className="mt-2">
                  View:{" "}
                  <Link href={`/articles/${result.slug}`} className="underline">
                    /articles/{result.slug}
                  </Link>
                </p>
              ) : null}
            </div>
          ) : null}
        </form>

        <section className="mt-10 rounded-3xl border border-white/15 bg-black/20 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Live Preview</p>
          <h2 className="mt-1 font-display text-2xl text-white">How the article will look</h2>
          <div
            className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-200"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </section>

        <section className="mt-10 rounded-3xl border border-white/15 bg-white/5 p-6">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <h2 className="font-display text-xl text-white">Existing Uploads</h2>
            <button
              type="button"
              onClick={() => void loadUploads()}
              className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white"
            >
              Refresh
            </button>
          </div>
          {loadingUploads ? (
            <p className="mt-4 text-xs text-slate-400">Loading…</p>
          ) : uploads.length === 0 ? (
            <p className="mt-4 text-xs text-slate-400">No uploads yet.</p>
          ) : (
            <div className="mt-4 grid gap-3 text-sm text-slate-200">
              {uploads.map((upload) => (
                <div
                  key={upload.name}
                  className="flex flex-col rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{upload.name}</span>
                    <span>{formatBytes(upload.size)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {upload.updatedAt.replace("T", " ").replace("Z", "")}
                  </p>
                  <p className="mt-2 text-[12px] text-slate-300">{upload.path}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImg(upload.path);
                        setUploadMessage(`Image path set to ${upload.path}`);
                      }}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white transition hover:border-white"
                    >
                      Use path
                    </button>
                    <button
                      type="button"
                      onClick={() => void copyToClipboard(upload.path)}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white transition hover:border-white"
                    >
                      Copy path
                    </button>
                  </div>
                  {copyMessage && (
                    <p className="mt-2 text-[11px] text-slate-300" role="status" aria-live="polite">
                      {copyMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-white/15 bg-white/5 p-6">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <h2 className="font-display text-xl text-white">Recent Admin Logs</h2>
            <button
              type="button"
              onClick={() => void loadLogs()}
              className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white"
            >
              Refresh
            </button>
          </div>
          {logError ? (
            <p className="mt-3 text-xs text-red-300">{logError}</p>
          ) : loadingLogs ? (
            <p className="mt-3 text-xs text-slate-400">Loading logs…</p>
          ) : logEntries.length === 0 ? (
            <p className="mt-3 text-xs text-slate-400">No log entries yet.</p>
          ) : (
            <div className="mt-4 grid gap-3 text-xs text-slate-300">
              {logEntries.map((entry) => (
                <div key={`${entry.timestamp}-${entry.action}`} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                    {entry.timestamp}
                  </div>
                  <div className="mt-1 font-semibold text-white">{entry.action}</div>
                  <pre className="mt-2 max-h-20 overflow-auto whitespace-pre-wrap text-[11px] text-slate-200">
                    {JSON.stringify(entry.payload)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default function AdminNewArticlePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black/80 pt-24 text-white"><section className="mx-auto max-w-6xl px-6"><p className="text-sm text-slate-400">Loading editor...</p></section></main>}>
      <AdminNewArticlePageInner />
    </Suspense>
  );
}
