import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Sridhar Prakash",
  description:
    "About Sridhar Prakash, a Bengaluru creator documenting everyday life, city moods, and travel stories.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Sridhar Prakash",
    description:
      "About Sridhar Prakash, a Bengaluru creator documenting everyday life, city moods, and travel stories.",
    url: "/about",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sridhar Prakash",
    description:
      "About Sridhar Prakash, a Bengaluru creator documenting everyday life, city moods, and travel stories.",
    images: ["/images/og-image.jpg"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
