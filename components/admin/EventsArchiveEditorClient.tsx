"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ArchiveItem = {
  videoId: string;
  title: string;
  channelTitle?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  status?: "live" | "completed";
  durationLabel?: string;
  themeLabel?: string;
};

type Props = {
  initialItems: ArchiveItem[];
};

const emptyItem: ArchiveItem = {
  videoId: "",
  title: "",
  channelTitle: "",
  publishedAt: "",
  thumbnailUrl: "",
  status: "completed",
  durationLabel: "",
  themeLabel: "",
};

function extractVideoId(input: string) {
  const value = input.trim();
  if (!value) return "";
  if (/^[a-zA-Z0-9_-]{8,20}$/.test(value) && !value.includes("http")) return value;

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1);
    }
    if (url.searchParams.get("v")) {
      return url.searchParams.get("v") ?? "";
    }
    const embedMatch = url.pathname.match(/\/embed\/([^/?#]+)/);
    if (embedMatch) {
      return embedMatch[1];
    }
  } catch {}

  return value;
}

export default function EventsArchiveEditorClient({ initialItems }: Props) {
  const [items, setItems] = useState<ArchiveItem[]>(initialItems);
  const [form, setForm] = useState<ArchiveItem>(emptyItem);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bTime - aTime;
      }),
    [items],
  );

  async function loadArchive() {
    setRefreshing(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/events", { credentials: "include" });
      const payload = (await response.json().catch(() => null)) as { items?: ArchiveItem[]; error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to load events archive.");
      }
      setItems(payload?.items ?? []);
    } catch (err) {
      setError(String(err));
    } finally {
      setRefreshing(false);
    }
  }

  function resetForm() {
    setForm(emptyItem);
    setEditingId(null);
  }

  function handleAddOrUpdate() {
    setError(null);
    setMessage(null);

    const videoId = extractVideoId(form.videoId);
    if (!videoId) {
      setError("Video ID or YouTube URL is required.");
      return;
    }
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    const nextItem: ArchiveItem = {
      videoId,
      title: form.title.trim(),
      channelTitle: form.channelTitle?.trim() ?? "",
      publishedAt: form.publishedAt?.trim() ?? "",
      thumbnailUrl: form.thumbnailUrl?.trim() ?? "",
      status: form.status === "live" ? "live" : "completed",
      durationLabel: form.durationLabel?.trim() ?? "",
      themeLabel: form.themeLabel?.trim() ?? "",
    };

    setItems((prev) => {
      const withoutCurrent = prev.filter((item) => item.videoId !== (editingId ?? videoId));
      return [nextItem, ...withoutCurrent];
    });

    setMessage(editingId ? "Entry updated locally. Click Save archive." : "Entry added locally. Click Save archive.");
    resetForm();
  }

  function handleEdit(item: ArchiveItem) {
    setEditingId(item.videoId);
    setForm({
      videoId: item.videoId,
      title: item.title,
      channelTitle: item.channelTitle ?? "",
      publishedAt: item.publishedAt ?? "",
      thumbnailUrl: item.thumbnailUrl ?? "",
      status: item.status ?? "completed",
      durationLabel: item.durationLabel ?? "",
      themeLabel: item.themeLabel ?? "",
    });
    setMessage(null);
    setError(null);
  }

  function handleDelete(videoId: string) {
    setItems((prev) => prev.filter((item) => item.videoId !== videoId));
    if (editingId === videoId) {
      resetForm();
    }
    setMessage("Entry removed locally. Click Save archive.");
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const payload = (await response.json().catch(() => null)) as { items?: ArchiveItem[]; error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save events archive.");
      }
      setItems(payload?.items ?? []);
      setMessage(`Saved ${payload?.items?.length ?? 0} archive entries.`);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleImportRecent() {
    setImporting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/events/import", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxResults: 8 }),
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            items?: ArchiveItem[];
            importedCount?: number;
            newCount?: number;
            updatedCount?: number;
            payloadError?: string;
            error?: string;
          }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to import recent YouTube events.");
      }

      setItems(payload?.items ?? []);
      const importedCount = payload?.importedCount ?? 0;
      const newCount = payload?.newCount ?? 0;
      const updatedCount = payload?.updatedCount ?? 0;
      const apiNote = payload?.payloadError ? ` (YouTube note: ${payload.payloadError})` : "";
      setMessage(`Imported ${importedCount} recent events (${newCount} new, ${updatedCount} updated).${apiNote}`);
    } catch (err) {
      setError(String(err));
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Events Archive</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Add or edit replay tiles</h2>
            <p className="mt-2 text-sm text-slate-300">
              Save past live streams here so they keep appearing on the events page even after YouTube stops returning them.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleImportRecent()}
              disabled={importing}
              className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100 transition hover:border-cyan-200/50 disabled:opacity-60"
            >
              {importing ? "Importing..." : "Import Recent"}
            </button>
            <button
              type="button"
              onClick={() => void loadArchive()}
              disabled={refreshing}
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white transition hover:border-white disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Archive"}
            </button>
          </div>
        </div>

        {message ? <p className="mt-3 text-xs text-emerald-300">{message}</p> : null}
        {error ? <p className="mt-3 text-xs text-rose-300">{error}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
        <section className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-white">{editingId ? "Edit entry" : "Add entry"}</h3>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Video ID or YouTube URL</span>
              <input
                value={form.videoId}
                onChange={(e) => setForm((prev) => ({ ...prev, videoId: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 focus:border-white/30"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Title</span>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 focus:border-white/30"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Published At (ISO or date)</span>
              <input
                value={form.publishedAt}
                onChange={(e) => setForm((prev) => ({ ...prev, publishedAt: e.target.value }))}
                placeholder="2026-02-23T14:30:00.000Z"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 focus:border-white/30"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Thumbnail URL (optional)</span>
              <input
                value={form.thumbnailUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, thumbnailUrl: e.target.value }))}
                placeholder="https://i.ytimg.com/..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 focus:border-white/30"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Theme label</span>
                <input
                  value={form.themeLabel}
                  onChange={(e) => setForm((prev) => ({ ...prev, themeLabel: e.target.value }))}
                  placeholder="Rally"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 focus:border-white/30"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Duration label</span>
                <input
                  value={form.durationLabel}
                  onChange={(e) => setForm((prev) => ({ ...prev, durationLabel: e.target.value }))}
                  placeholder="1:32:44"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 focus:border-white/30"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Channel title</span>
                <input
                  value={form.channelTitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, channelTitle: e.target.value }))}
                  placeholder="Sridhar Prakash"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 focus:border-white/30"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</span>
                <select
                  value={form.status ?? "completed"}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as "live" | "completed" }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-0 focus:border-white/30"
                >
                  <option value="completed">Completed</option>
                  <option value="live">Live</option>
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={handleAddOrUpdate}
              className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white"
            >
              {editingId ? "Update Local Entry" : "Add Local Entry"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">Archive Entries ({sortedItems.length})</h3>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Saved after you click Save archive
            </p>
          </div>

          {sortedItems.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No archive entries yet. Add one on the left and save.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {sortedItems.map((item) => (
                <article key={item.videoId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 gap-3">
                      <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.title}
                            fill
                            sizes="144px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-500">
                            No thumbnail
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${
                            item.status === "live" ? "bg-red-500/20 text-red-200" : "border border-white/15 text-slate-200"
                          }`}
                        >
                          {item.status === "live" ? "Live" : "Replay"}
                        </span>
                        {item.themeLabel ? (
                          <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200">
                            {item.themeLabel}
                          </span>
                        ) : null}
                        {item.durationLabel ? (
                          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{item.durationLabel}</span>
                        ) : null}
                      </div>
                      <h4 className="mt-2 text-sm font-semibold text-white">{item.title}</h4>
                      <p className="mt-1 break-all text-xs text-slate-400">Video ID: {item.videoId}</p>
                      {item.publishedAt ? <p className="mt-1 text-xs text-slate-400">Published: {item.publishedAt}</p> : null}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:border-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.videoId)}
                        className="rounded-full border border-rose-400/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-rose-200 transition hover:border-rose-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
