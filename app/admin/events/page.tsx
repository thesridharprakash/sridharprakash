import EventsArchiveEditorClient from "@/components/admin/EventsArchiveEditorClient";
import PlannedEventsEditorClient from "@/components/admin/PlannedEventsEditorClient";
import { readPlannedEvents } from "@/lib/plannedEvents";
import { readEventsArchive } from "@/lib/youtubeEvents";

export default function AdminEventsPage() {
  const initialArchiveItems = readEventsArchive();
  const initialPlannedItems = readPlannedEvents();

  return (
    <main className="min-h-screen bg-black/80 pb-20 pt-24 text-white">
      <section className="mx-auto max-w-6xl space-y-6 px-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin</p>
          <h1 className="text-4xl font-semibold">Manage Events</h1>
          <p className="text-sm text-slate-300">
            Add upcoming public programs and keep replay tiles visible on the Events page.
          </p>
        </header>
        <PlannedEventsEditorClient initialItems={initialPlannedItems} />
        <EventsArchiveEditorClient initialItems={initialArchiveItems} />
      </section>
    </main>
  );
}
