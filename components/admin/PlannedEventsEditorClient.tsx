"use client";

import { useMemo, useState } from "react";

type PlannedEvent = {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  startTime?: string;
  endTime?: string;
  location: string;
  mapUrl?: string;
};

type Props = {
  initialItems: PlannedEvent[];
};

const emptyItem: PlannedEvent = {
  title: "",
  description: "",
  date: "",
  endDate: "",
  time: "",
  startTime: "",
  endTime: "",
  location: "",
  mapUrl: "",
};

function eventKey(item: PlannedEvent) {
  return `${item.date}-${item.title}`.toLowerCase();
}

export default function PlannedEventsEditorClient({ initialItems }: Props) {
  const [items, setItems] = useState<PlannedEvent[]>(initialItems);
  const [form, setForm] = useState<PlannedEvent>(emptyItem);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(`${a.date}T00:00:00`).getTime() - new Date(`${b.date}T00:00:00`).getTime()),
    [items],
  );

  async function loadItems() {
    setRefreshing(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/planned-events", { credentials: "include" });
      const payload = (await response.json().catch(() => null)) as { items?: PlannedEvent[]; error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Unable to load upcoming events.");
      setItems(payload?.items ?? []);
      setMessage("Upcoming events refreshed.");
    } catch (err) {
      setError(String(err));
    } finally {
      setRefreshing(false);
    }
  }

  function resetForm() {
    setForm(emptyItem);
    setEditingKey(null);
  }

  function handleAddOrUpdate() {
    setError(null);
    setMessage(null);

    const nextItem: PlannedEvent = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date.trim(),
      endDate: form.endDate?.trim() ?? "",
      time: form.time.trim(),
      startTime: form.startTime?.trim() ?? "",
      endTime: form.endTime?.trim() ?? "",
      location: form.location.trim(),
      mapUrl: form.mapUrl?.trim() ?? "",
    };

    if (!nextItem.title) {
      setError("Title is required.");
      return;
    }
    if (!nextItem.date) {
      setError("Date is required.");
      return;
    }

    const nextKey = eventKey(nextItem);
    setItems((prev) => {
      const withoutCurrent = prev.filter((item) => eventKey(item) !== (editingKey ?? nextKey));
      return [nextItem, ...withoutCurrent];
    });
    setMessage(editingKey ? "Upcoming event updated locally. Click Save upcoming." : "Upcoming event added locally. Click Save upcoming.");
    resetForm();
  }

  function handleEdit(item: PlannedEvent) {
    setEditingKey(eventKey(item));
    setForm(item);
    setMessage(null);
    setError(null);
  }

  function handleDelete(key: string) {
    setItems((prev) => prev.filter((item) => eventKey(item) !== key));
    if (editingKey === key) resetForm();
    setMessage("Upcoming event removed locally. Click Save upcoming.");
  }

  function getMapsSearchUrl() {
    const query = [form.location, "Bengaluru"].filter(Boolean).join(" ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "Bengaluru")}`;
  }

  function handleUseCurrentLocation() {
    setLocationMessage(null);

    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported on this device.");
      return;
    }

    setLocationMessage("Fetching current location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        setForm((prev) => ({
          ...prev,
          mapUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
        }));
        setLocationMessage("Current location added as map link.");
      },
      () => {
        setLocationMessage("Could not fetch current location. You can still paste a Google Maps link.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/planned-events", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const payload = (await response.json().catch(() => null)) as { items?: PlannedEvent[]; error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Unable to save upcoming events.");
      setItems(payload?.items ?? []);
      setMessage(`Saved ${payload?.items?.length ?? 0} upcoming events.`);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Upcoming Events</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Add scheduled programs</h2>
            <p className="mt-2 text-sm text-slate-300">
              These entries appear in the Upcoming Events section on the public Events page.
            </p>
            <p className="mt-1 text-xs text-amber-200">
              Only future-dated entries appear publicly. Past dates stay saved here but are hidden from Upcoming Events.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadItems()}
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
              {saving ? "Saving..." : "Save Upcoming"}
            </button>
          </div>
        </div>

        {message ? <p className="mt-3 text-xs text-emerald-300">{message}</p> : null}
        {error ? <p className="mt-3 text-xs text-rose-300">{error}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
        <section className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-white">{editingKey ? "Edit upcoming event" : "Add upcoming event"}</h3>
            {editingKey ? (
              <button type="button" onClick={resetForm} className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                Cancel
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Title</span>
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Start date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">End date (optional)</span>
                <input
                  type="date"
                  value={form.endDate ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Legacy time label</span>
              <input
                value={form.time}
                onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                placeholder="Optional display override"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Start time</span>
                <input
                  type="time"
                  value={form.startTime ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, startTime: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">End time</span>
                <input
                  type="time"
                  value={form.endTime ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, endTime: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Venue / Location</span>
              <input
                value={form.location}
                onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                placeholder="Venue name, address, landmark"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <a
                href={getMapsSearchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-200/50"
              >
                Open Google Maps
              </a>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white transition hover:border-white"
              >
                Use current location
              </button>
            </div>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Google Maps link</span>
              <input
                value={form.mapUrl ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, mapUrl: event.target.value }))}
                placeholder="Paste Google Maps share link"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
              />
              <span className="mt-1 block text-xs text-slate-500">Open Google Maps, tap Share, then paste the venue link here.</span>
            </label>
            {form.mapUrl ? (
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <a
                  href={form.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-200/50"
                >
                  Preview map
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, mapUrl: "" }));
                    setLocationMessage("Map link removed locally. Click Save upcoming to publish.");
                  }}
                  className="rounded-full border border-rose-400/50 px-4 py-2 text-xs uppercase tracking-[0.18em] text-rose-200 transition hover:border-rose-300"
                >
                  Remove map link
                </button>
                <p className="min-w-0 flex-1 break-all text-xs text-slate-400">{form.mapUrl}</p>
              </div>
            ) : null}
            {locationMessage ? <p className="text-xs text-cyan-200">{locationMessage}</p> : null}
            <button type="button" onClick={handleAddOrUpdate} className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white">
              {editingKey ? "Update Local Event" : "Add Local Event"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">Upcoming Entries ({sortedItems.length})</h3>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Saved after you click Save upcoming</p>
          </div>

          {sortedItems.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No upcoming events yet. Add one on the left and save.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {sortedItems.map((item) => {
                const key = eventKey(item);
                return (
                  <article key={key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                          {item.endDate ? `${item.date} - ${item.endDate}` : item.date}
                        </p>
                        <h4 className="mt-2 text-sm font-semibold text-white">{item.title}</h4>
                        <p className="mt-1 text-xs leading-5 text-slate-300">{item.description}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          {item.time || [item.startTime, item.endTime].filter(Boolean).join(" - ") || "No time set"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{item.location || "No location set"}</p>
                        {item.mapUrl ? <p className="mt-1 break-all text-xs text-cyan-200">Map: {item.mapUrl}</p> : null}
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEdit(item)} className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:border-white">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(key)} className="rounded-full border border-rose-400/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-rose-200 transition hover:border-rose-300">
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
