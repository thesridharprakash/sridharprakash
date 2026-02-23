import HomePageClient from "@/components/HomePageClient";
import { getYouTubeEventsPayload } from "@/lib/youtubeEvents";

export const revalidate = 60;

export default async function HomePage() {
  const initialEventsData = await getYouTubeEventsPayload();
  return <HomePageClient initialEventsData={initialEventsData} />;
}
