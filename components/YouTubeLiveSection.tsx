"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type LiveResponse = {
  isLive: boolean;
  videoId?: string;
  title?: string;
  watchUrl?: string;
  embedUrl?: string;
  liveChannelUrl?: string;
  error?: string;
};

const defaultChannelUrl = "https://www.youtube.com/@sridhar_prakash/live";

export default function YouTubeLiveSection() {
  const [data, setData] = useState<LiveResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchLiveStatus() {
    try {
      const res = await fetch("/api/youtube/live", { cache: "no-store" });
      const json = (await res.json()) as LiveResponse;
      setData(json);
    } catch {
      setData({ isLive: false, error: "Unable to check live status right now." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 60_000);
    return () => clearInterval(interval);
  }, []);

  const channelUrl = useMemo(
    () => data?.liveChannelUrl ?? defaultChannelUrl,
    [data?.liveChannelUrl],
  );

  if (loading) {
    return null;
  }

  if (!data?.isLive || !data.embedUrl) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="rounded-3xl border border-white/15 bg-black/25 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Live Feed</p>
        <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">YouTube Live Stream</h2>
        <div className="mt-6 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={data.embedUrl}
                title={data.title ?? "YouTube live stream"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              >
                Your browser does not support embedded video.{" "}
                <a href={data.watchUrl ?? channelUrl}>Open on YouTube</a>.
              </iframe>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-red-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              Live Now
            </span>
            <p className="text-sm text-slate-200">{data.title ?? "Streaming on YouTube"}</p>
          </div>
          <Link
            href={data.watchUrl ?? channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-white/25 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-white"
          >
            Open on YouTube
          </Link>
        </div>
      </div>
    </section>
  );
}
