import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Participation | Volunteer with Sridhar Prakash",
  description:
    "Volunteer with Sridhar Prakash through seva activities, public outreach, event support, digital support, youth participation, and blood donation initiatives.",
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "Community Participation | Volunteer with Sridhar Prakash",
    description:
      "Volunteer with Sridhar Prakash through seva activities, public outreach, event support, digital support, youth participation, and blood donation initiatives.",
    url: "/community",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Participation | Volunteer with Sridhar Prakash",
    description:
      "Volunteer with Sridhar Prakash through seva activities, public outreach, event support, digital support, youth participation, and blood donation initiatives.",
    images: ["/images/og-image.jpg"],
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
