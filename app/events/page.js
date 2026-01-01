import events from "@/data/events.json";

export const metadata = {
  title: "Events | Sridhar Prakash",
  description:
    "Public meetings, community interactions, and development-focused events in Bengaluru.",
};




export default function EventsPage() {
  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter(e => e.date >= today);
  const pastEvents = events.filter(e => e.date < today);

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
  <div className="relative rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition">
    
    {/* Accent bar */}
    <div className="absolute left-0 top-0 h-full w-1 bg-orange-600 rounded-l-xl"></div>

    <div className="pl-4">
      {/* Title */}
      <h3 className="text-lg md:text-xl font-semibold text-gray-900">
        {event.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm md:text-base text-gray-600">
        {event.description}
      </p>

      {/* Meta */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
        <div>
          <p className="font-medium text-gray-900">Date</p>
          <p>{event.date}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Time</p>
          <p>{event.time}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Location</p>
          <p>{event.location}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <a
          href={googleCalendarLink(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline text-sm font-medium"
        >
          Add to Google Calendar
        </a>

        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          RSVP coming soon
        </span>
      </div>
    </div>
  </div>
);


  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900">
          Events
        </h1>

        <div className="w-16 h-1 bg-orange-600 mx-auto my-6"></div>

        {/* Upcoming Events */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h2>

          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No upcoming events announced yet.
            </p>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Past Events
          </h2>

          {pastEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No past events yet.
            </p>
          ) : (
            <div className="space-y-6">
              {pastEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
