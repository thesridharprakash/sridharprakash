import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join Sridhar Prakash's community network for seva, youth participation, public outreach, and local issue support in Bengaluru.",
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "Community | Sridhar Prakash",
    description:
      "Join Sridhar Prakash's community network for seva, youth participation, public outreach, and local issue support in Bengaluru.",
    url: "/community",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community | Sridhar Prakash",
    description:
      "Join Sridhar Prakash's community network for seva, youth participation, public outreach, and local issue support in Bengaluru.",
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
