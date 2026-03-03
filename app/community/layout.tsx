import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join Sridhar Prakash's community circle for collabs, meetups, and creative support.",
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "Community | Sridhar Prakash",
    description:
      "Join Sridhar Prakash's community circle for collabs, meetups, and creative support.",
    url: "/community",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community | Sridhar Prakash",
    description:
      "Join Sridhar Prakash's community circle for collabs, meetups, and creative support.",
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
