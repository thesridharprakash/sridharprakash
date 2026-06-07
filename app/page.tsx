import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { socialProfiles } from "@/constants/socials";
import { getYouTubeEventsPayload } from "@/lib/youtubeEvents";

export const revalidate = 60;
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.sridharprakash.in";

export const metadata: Metadata = {
  title: "Sridhar Prakash | Public Service & Community Leadership in Bengaluru",
  description:
    "Official platform of Sridhar Prakash for public service updates, community initiatives, volunteer opportunities, events, and local leadership in Bengaluru.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Sridhar Prakash",
    "Byatarayanapura Assembly Constituency",
    "Bengaluru North",
    "public service",
    "community leadership",
    "community outreach",
  ],
  openGraph: {
    title: "Sridhar Prakash | Public Service & Community Leadership in Bengaluru",
    description:
      "Official platform of Sridhar Prakash for public service updates, community initiatives, volunteer opportunities, events, and local leadership in Bengaluru.",
    url: "/",
    siteName: "Sridhar Prakash",
    type: "website",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sridhar Prakash | Public Service & Community Leadership in Bengaluru",
    description:
      "Official platform of Sridhar Prakash for public service updates, community initiatives, volunteer opportunities, events, and local leadership in Bengaluru.",
    images: ["/images/og-image.jpg"],
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
    image: `${siteUrl}/images/og-image.jpg`,
    sameAs,
    homeLocation: "Bengaluru, Karnataka, India",
    description:
      "Public service, community initiatives, and local leadership updates from Sridhar Prakash in Bengaluru.",
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
