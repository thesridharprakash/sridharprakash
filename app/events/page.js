export const metadata = {
  title: "Events | Sridhar Prakash",
  description:
    "Public meetings, community interactions, and development-focused events in Bengaluru.",
};

const events = [
  {
    title: "Community Interaction Meet",
    description: "Open discussion with citizens on local development priorities.",
    location: "Bengaluru South",
    date: "2025-06-15",
    start: "20250615T043000Z",
    end: "20250615T063000Z",
  },
  {
    title: "Volunteer Orientation Program",
    description: "Orientation session for new volunteers and community leaders.",
    location: "Central Bengaluru",
    date: "2025-06-30",
    start: "20250630T050000Z",
    end: "20250630T070000Z",
  },
  {
    title: "Ward-level Listening Session",
    description: "Listening to citizen concerns at the ward level.",
    location: "Bengaluru East",
    date: "2025-05-20",
    start: "20250520T043000Z",
    end: "20250520T060000Z",
  },
];

export default function EventsPage() {
  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter((e) => e.date >= today);
  const pastEvents = events.filter((e) => e.date < today);

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900">
          Events
        </h1>

        <div className="w-16 h-1 bg-orange-600 mx-auto my-6"></div>

        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Public meetings, community interactions, and initiatives focused on
          development and citizen engagement across Bengaluru.
        </p>

        {/* Upcoming Events */}
        <h2 className="mt-12 mb-4 text-lg font-semibold text-gray-900">
          Upcoming Events
        </h2>

        {upcomingEvents.length === 0 && (
          <p className="text-sm text-gray-500">No upcoming events announced yet.</p>
        )}

        <div className="space-y-6">
          {upcomingEvents.map((event, index) => {
            const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              event.title
            )}&dates=${event.start}/${event.end}&location=${encodeURIComponent(
              event.location
            )}&details=${encodeURIComponent(event.description)}`;

            return (
              <div
                key={index}
                className="border rounded-lg p-6 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  {event.description}
                </p>

                <div className="mt-2 text-sm text-gray-700">
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                </div>

                <div className="mt-4 flex gap-6 text-sm">
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Add to Google Calendar
                  </a>

                  <a
                    href="/volunteer"
                    className="text-orange-600 hover:underline"
                  >
                    Attend / Volunteer →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Past Events */}
        <h2 className="mt-16 mb-4 text-lg font-semibold text-gray-900">
          Past Events
        </h2>

        <div className="space-y-6 opacity-90">
          {pastEvents.map((event, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 bg-gray-50"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {event.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {event.description}
              </p>

              <div className="mt-2 text-sm text-gray-700">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
