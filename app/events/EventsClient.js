"use client";

import { useState } from "react";
import RSVPModal from "@/components/RSVPModal";

export default function EventsClient({ upcomingEvents = [], pastEvents = [] }) {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  const googleCalendarLink = (event) => {
    const start = event.date.replace(/-/g, "") + "T100000";
    const end = event.date.replace(/-/g, "") + "T120000";

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${start}/${end}&location=${encodeURIComponent(
      event.location
    )}&details=${encodeURIComponent(event.description)}`;
  };

  const EventCard = ({ event }) => (
    <div className="relative rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-lg hover:-translate-y-1">
      <div className="absolute left-0 top-0 h-full w-1 bg-orange-600 rounded-l-xl"></div>

      <div className="pl-4">
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>

        <p className="mt-2 text-sm text-gray-600">{event.description}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="font-medium">Date</p>
            <p>{event.date}</p>
          </div>
          <div>
            <p className="font-medium">Time</p>
            <p>{event.time}</p>
          </div>
          <div>
            <p className="font-medium">Location</p>
            <p>{event.location}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-4 items-center">
          <a
            href={googleCalendarLink(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-sm font-medium hover:underline"
          >
            Add to Google Calendar
          </a>

          <button
            onClick={() => setRsvpOpen(true)}
            className="rounded-full bg-orange-50 text-orange-700 px-3 py-1 text-xs font-medium"
          >
            RSVP
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Upcoming */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No upcoming events announced yet.
            </p>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((event, i) => (
                <EventCard key={i} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Past Events</h2>

          {pastEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">No past events yet.</p>
          ) : (
            <div className="space-y-6 opacity-90">
              {pastEvents.map((event, i) => (
                <EventCard key={i} event={event} />
              ))}
            </div>
          )}
        </section>

        <RSVPModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
      </div>
    </main>
  );
}
