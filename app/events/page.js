import events from "@/data/events.json";
import Hero from "@/components/Hero";
import EventsClient from "./EventsClient";

export const metadata = {
  title: "Events | Sridhar Prakash",
  description:
    "Public meetings, community interactions, and development-focused events in Bengaluru.",
};

export default function EventsPage() {
  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter((e) => e.date >= today);
  const pastEvents = events.filter((e) => e.date < today);

  return (
    <>
      <Hero
        title="Events & Community Engagements"
        subtitle="Public meetings, grassroots interactions, and citizen-first initiatives."
      />

      <EventsClient
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
      />
    </>
  );
}
