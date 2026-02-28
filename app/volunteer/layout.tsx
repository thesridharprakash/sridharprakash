import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Join Sridhar Prakash's volunteer network for campaign support, field coordination, and digital outreach.",
  alternates: {
    canonical: "/volunteer",
  },
  openGraph: {
    title: "Volunteer | Sridhar Prakash",
    description:
      "Join Sridhar Prakash's volunteer network for campaign support, field coordination, and digital outreach.",
    url: "/volunteer",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Volunteer | Sridhar Prakash",
    description:
      "Join Sridhar Prakash's volunteer network for campaign support, field coordination, and digital outreach.",
    images: ["/images/og-image.jpg"],
  },
};

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
