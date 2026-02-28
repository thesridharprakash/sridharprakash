import type { Metadata } from "next";
import YouTubeEventsSection from "@/components/YouTubeEventsSection";
import { getYouTubeEventsPayload } from "@/lib/youtubeEvents";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events",
  description: "Watch ongoing and past YouTube live stream events by Sridhar Prakash.",
  alternates: {
    canonical: "/events",
  },
};

type EventsPageProps = {
  searchParams?: Promise<{
    v?: string | string[];
  }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedVideoId = Array.isArray(resolvedSearchParams?.v) ? resolvedSearchParams?.v[0] : resolvedSearchParams?.v;
  const initialEventsData = await getYouTubeEventsPayload();

  return (
    <main className="relative overflow-hidden text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(239,68,68,0.16),transparent_34%),radial-gradient(circle_at_8%_82%,rgba(56,189,248,0.14),transparent_38%)]" />

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-8 pt-28 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Events</p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">Catch live streams and replays in one place.</h1>
        <p className="mt-4 text-base text-slate-300 md:text-lg">
          This page shows ongoing YouTube live coverage when available and keeps recent streams as event tiles for easy catch-up.
        </p>
      </section>

      <div className="relative z-10">
        <YouTubeEventsSection mode="page" selectedVideoId={selectedVideoId ?? null} initialData={initialEventsData} />
      </div>
    </main>
  );
}
