"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ShareButton from "@/components/ShareButton";
import { trackEvent } from "@/lib/analytics";
import type { EventItem, YouTubeEventsPayload } from "@/lib/youtubeEvents";

type Props = {
  mode?: "home" | "page";
  selectedVideoId?: string | null;
  initialData?: YouTubeEventsPayload | null;
};

const defaultChannelUrl = "https://www.youtube.com/@sridhar_prakash";

function formatEventDate(value?: string) {
  if (!value) return "Recent stream";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent stream";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function eventPageHref(videoId: string, includeAnchor = false) {
  return `/events?v=${videoId}${includeAnchor ? "#event-player" : ""}`;
}

function absoluteUrl(path: string) {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

function EventsSkeleton({ mode }: { mode: "home" | "page" }) {
  return (
    <section className={`mx-auto max-w-6xl px-6 ${mode === "home" ? "pb-16" : "pb-20"}`}>
      <div className={`rounded-3xl border border-white/15 ${mode === "home" ? "bg-black/25 p-6 md:p-8" : "bg-white/5 p-6 md:p-8"}`}>
        <div className="animate-pulse">
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="mt-4 h-8 w-72 rounded bg-white/10" />
          <div className="mt-3 h-4 w-full max-w-2xl rounded bg-white/10" />
          <div className="mt-2 h-4 w-4/5 max-w-xl rounded bg-white/10" />
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="aspect-video bg-white/5" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="h-4 w-full rounded bg-white/10" />
                  <div className="h-4 w-2/3 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function YouTubeEventsSection({
  mode = "home",
  selectedVideoId = null,
  initialData = null,
}: Props) {
  const [data, setData] = useState<YouTubeEventsPayload | null>(initialData);
  const [loading, setLoading] = useState(!initialData);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/youtube/events", { cache: "no-store" });
      const json = (await res.json()) as YouTubeEventsPayload;
      setData(json);
    } catch {
      setData((prev) => ({
        isLive: false,
        currentLive: null,
        events: prev?.events ?? [],
        liveChannelUrl: prev?.liveChannelUrl,
        channelUrl: prev?.channelUrl,
        updatedAt: new Date().toISOString(),
        error: "Unable to load events right now.",
      }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!initialData) {
      void fetchEvents();
    }

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void fetchEvents();
    }, 60_000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void fetchEvents();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [initialData]);

  const channelUrl = data?.liveChannelUrl ?? data?.channelUrl ?? defaultChannelUrl;
  const selectedEvent = useMemo(() => {
    if (mode !== "page") return null;
    if (selectedVideoId) {
      return data?.events.find((item) => item.videoId === selectedVideoId) ?? data?.currentLive ?? data?.events[0] ?? null;
    }
    return data?.currentLive ?? data?.events[0] ?? null;
  }, [data?.currentLive, data?.events, mode, selectedVideoId]);

  const visibleEvents = mode === "home" ? (data?.events ?? []).slice(0, 3) : (data?.events ?? []);
  const hasAnyContent = Boolean(data?.currentLive) || visibleEvents.length > 0;
  const shouldShowHomeSection = mode === "home" && (loading || hasAnyContent || Boolean(data?.error));

  function handleTileClick(event: EventItem, surface: "thumbnail" | "title") {
    trackEvent("event_tile_click", {
      section: mode,
      surface,
      video_id: event.videoId,
      status: event.status,
    });
  }

  function handleShareAction(event: EventItem, action: "share" | "copy" | "error" | "click") {
    trackEvent("event_share", {
      section: mode,
      action,
      video_id: event.videoId,
      status: event.status,
    });
  }

  function handleWatchOnYouTube(event: EventItem) {
    trackEvent("event_watch_on_youtube", {
      section: mode,
      video_id: event.videoId,
      status: event.status,
    });
  }

  if (loading && !initialData) {
    return <EventsSkeleton mode={mode} />;
  }

  if (mode === "home" && !shouldShowHomeSection) {
    return null;
  }

  return (
    <section className={`mx-auto max-w-6xl px-6 ${mode === "home" ? "pb-16" : "pb-20"}`}>
      <div className={`rounded-3xl border border-white/15 ${mode === "home" ? "bg-black/25 p-6 md:p-8" : "bg-white/5 p-6 md:p-8"}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Events</p>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
              {mode === "page" ? "Live and past stream events" : "Catch ongoing and past streams"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              {mode === "page"
                ? "Watch the current live stream here when available, and replay recent events from the same page."
                : "Live now shows up automatically. Recent streams are saved as event tiles so visitors can catch up."}
            </p>
          </div>
          <Link
            href={mode === "home" ? "/events" : channelUrl}
            target={mode === "page" ? "_blank" : undefined}
            rel={mode === "page" ? "noopener noreferrer" : undefined}
            onClick={() =>
              trackEvent("events_cta_click", {
                section: mode,
                target: mode === "home" ? "events_page" : "youtube_channel",
              })
            }
            className="inline-flex rounded-full border border-white/25 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-white"
          >
            {mode === "home" ? "Open Events Page" : "Open YouTube Channel"}
          </Link>
        </div>

        {mode === "page" ? (
          <div id="event-player" className="mt-6">
            {selectedEvent ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div className="aspect-video">
                  <iframe
                    className="h-full w-full"
                    src={selectedEvent.status === "live" ? selectedEvent.embedUrl : `${selectedEvent.embedUrl}?rel=0`}
                    title={selectedEvent.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedEvent.status === "live" ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-red-200">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                          Live now
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">
                          Replay
                        </span>
                      )}
                      {selectedEvent.themeLabel ? (
                        <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-200">
                          {selectedEvent.themeLabel}
                        </span>
                      ) : null}
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{formatEventDate(selectedEvent.publishedAt)}</span>
                      {selectedEvent.durationLabel && selectedEvent.status !== "live" ? (
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{selectedEvent.durationLabel}</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-white md:text-base">{selectedEvent.title}</p>
                  </div>
                  <Link
                    href={selectedEvent.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleWatchOnYouTube(selectedEvent)}
                    className="inline-flex rounded-full border border-white/25 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white"
                  >
                    Watch on YouTube
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-slate-300">
                <p>{loading ? "Loading event feed..." : data?.error ?? "No live or past events found yet."}</p>
                <Link
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full border border-white/25 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                >
                  Open YouTube Channel
                </Link>
              </div>
            )}
          </div>
        ) : data?.currentLive ? (
          <div className="mt-6 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={data.currentLive.embedUrl}
                  title={data.currentLive.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-red-200">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                Live Now
              </span>
              {data.currentLive.themeLabel ? (
                <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-200">
                  {data.currentLive.themeLabel}
                </span>
              ) : null}
              <p className="text-sm text-slate-200">{data.currentLive.title}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{mode === "page" ? "Event tiles" : "Recent event tiles"}</h3>
            {mode === "page" && data?.updatedAt ? (
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Updates every minute (visible tabs only)</p>
            ) : null}
          </div>

          {visibleEvents.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-slate-300">
              <p>{loading ? "Loading event feed..." : data?.error ?? "No event tiles yet. Go live once and they will appear here."}</p>
              <Link
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-full border border-white/25 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                Open YouTube Channel
              </Link>
            </div>
          ) : (
            <div className={`grid gap-5 ${mode === "home" ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-3"}`}>
              {visibleEvents.map((event) => {
                const tileHref = eventPageHref(event.videoId, mode === "page");
                const sharePath = eventPageHref(event.videoId, false);
                return (
                  <article
                    key={event.videoId}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                  >
                    <Link
                      href={tileHref}
                      className="block"
                      aria-label={`Open event: ${event.title}`}
                      onClick={() => handleTileClick(event, "thumbnail")}
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        {event.thumbnailUrl ? (
                          <Image
                            src={event.thumbnailUrl}
                            alt={event.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes={mode === "home" ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 1280px) 50vw, 33vw"}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-400">No preview image</div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                              event.status === "live"
                                ? "bg-red-500/90 text-white"
                                : "border border-white/20 bg-black/60 text-slate-100"
                            }`}
                          >
                            {event.status === "live" ? "Live" : "Replay"}
                          </span>
                          {event.themeLabel ? (
                            <span className="inline-flex rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-100">
                              {event.themeLabel}
                            </span>
                          ) : null}
                        </div>
                        {event.durationLabel && event.status !== "live" ? (
                          <div className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/70 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-white">
                            {event.durationLabel}
                          </div>
                        ) : null}
                      </div>
                    </Link>

                    <div className="relative p-4 pr-14">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{formatEventDate(event.publishedAt)}</p>
                      <Link
                        href={tileHref}
                        onClick={() => handleTileClick(event, "title")}
                        className="mt-2 block text-sm font-semibold text-white transition group-hover:text-[var(--accent)]"
                      >
                        {event.title}
                      </Link>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                        {event.channelTitle || "YouTube Event"} {event.status === "live" ? "| ongoing" : "| past stream"}
                      </p>

                      <div className="absolute bottom-3 right-3">
                        <ShareButton
                          title={event.title}
                          description={`Watch ${event.status === "live" ? "the live stream" : "this event replay"} on Sridhar Prakash Events`}
                          url={absoluteUrl(sharePath)}
                          iconOnly
                          ariaLabel={`Share ${event.title}`}
                          onAction={(action) => handleShareAction(event, action)}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
