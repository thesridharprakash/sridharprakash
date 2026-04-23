import type { Metadata } from "next";
import Link from "next/link";
import YouTubeEventsSection from "@/components/YouTubeEventsSection";
import { readPlannedEvents } from "@/lib/plannedEvents";
import { getYouTubeEventsPayload } from "@/lib/youtubeEvents";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events",
  description: "Watch live and past public events, community updates, and outreach streams by Sridhar Prakash.",
  alternates: {
    canonical: "/events",
  },
};

type EventsPageProps = {
  searchParams?: Promise<{
    v?: string | string[];
  }>;
};

function formatPlannedEventDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatPlannedEventRange(event: { date: string; endDate?: string }) {
  if (!event.endDate || event.endDate === event.date) return formatPlannedEventDate(event.date);
  return `${formatPlannedEventDate(event.date)} - ${formatPlannedEventDate(event.endDate)}`;
}

function formatEventTime(event: { time?: string; startTime?: string; endTime?: string }) {
  if (event.time) return event.time;
  const startTime = formatClockTime(event.startTime);
  const endTime = formatClockTime(event.endTime);
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  return startTime || endTime || "";
}

function formatClockTime(value?: string) {
  if (!value) return "";
  const [hoursText, minutesText] = value.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return value;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedVideoId = Array.isArray(resolvedSearchParams?.v) ? resolvedSearchParams?.v[0] : resolvedSearchParams?.v;
  const initialEventsData = await getYouTubeEventsPayload();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = readPlannedEvents()
    .filter((event) => {
      const eventDate = new Date(`${event.date}T00:00:00`);
      const eventEndDate = event.endDate ? new Date(`${event.endDate}T00:00:00`) : eventDate;
      return !Number.isNaN(eventDate.getTime()) && !Number.isNaN(eventEndDate.getTime()) && eventEndDate >= today;
    })
    .sort((a, b) => new Date(`${a.date}T00:00:00`).getTime() - new Date(`${b.date}T00:00:00`).getTime());

  return (
    <main className="relative overflow-hidden text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(239,68,68,0.16),transparent_34%),radial-gradient(circle_at_8%_82%,rgba(56,189,248,0.14),transparent_38%)]" />

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-8 pt-28 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Events</p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">Public events, outreach updates, and live replays.</h1>
        <p className="mt-4 text-base text-slate-300 md:text-lg">
          Follow Sridhar Prakash&apos;s public meetings, community programs, and live coverage when available. Recent streams stay here for easy catch-up.
        </p>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-3xl border border-white/15 bg-black/25 p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Upcoming Events</p>
              <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">Scheduled programs and public meetings.</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Follow upcoming community programs, youth participation activities, public meetings, and outreach events.
              </p>
            </div>
            <Link
              href="/contact"
              className="rounded-full border border-white/25 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-white"
            >
              Share Event Details
            </Link>
          </div>

          <div className="mt-6">
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <article key={`${event.date}-${event.title}`} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                      {formatPlannedEventRange(event)}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{event.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{event.description}</p>
                    <div className="mt-4 space-y-1 border-t border-white/10 pt-4 text-sm text-slate-300">
                      {formatEventTime(event) ? <p>{formatEventTime(event)}</p> : null}
                      {event.location ? <p>{event.location}</p> : null}
                      {event.mapUrl ? (
                        <Link
                          href={event.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white"
                        >
                          Open Map
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                No upcoming events have been announced yet. New programs can be added through the events data file.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <YouTubeEventsSection mode="page" selectedVideoId={selectedVideoId ?? null} initialData={initialEventsData} />
      </div>
    </main>
  );
}
