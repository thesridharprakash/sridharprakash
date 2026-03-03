import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { socialProfiles } from "@/constants/socials";
import { getYouTubeEventsPayload } from "@/lib/youtubeEvents";

export const revalidate = 60;
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.sridharprakash.in";

export const metadata: Metadata = {
  title: "Sridhar Prakash | Official Website",
  description:
    "Official website of Sridhar Prakash featuring Bengaluru life updates, travel moments, and creator stories.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Sridhar Prakash",
    "Sridhar Prakash official website",
    "Bengaluru",
    "city life",
    "daily stories",
    "travel vlogs",
  ],
  openGraph: {
    title: "Sridhar Prakash | Official Website",
    description:
      "Bengaluru life updates, travel moments, and creator stories by Sridhar Prakash.",
    url: "/",
    siteName: "Sridhar Prakash",
    type: "website",
    images: ["/images/og-image.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sridhar Prakash | Official Website",
    description:
      "Bengaluru life updates, travel moments, and creator stories by Sridhar Prakash.",
    images: ["/images/og-image.jpeg"],
  },
};

export default async function HomePage() {
  const initialEventsData = await getYouTubeEventsPayload();
  const sameAs = socialProfiles.map((profile) => profile.href).filter(Boolean) as string[];
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sridhar Prakash",
    url: siteUrl,
    image: `${siteUrl}/images/og-image.jpeg`,
    sameAs,
    jobTitle: "Creator",
    description:
      "Bengaluru creator sharing city life, travel moments, and everyday stories.",
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sridhar Prakash",
    url: siteUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomePageClient initialEventsData={initialEventsData} />
    </>
  );
}
