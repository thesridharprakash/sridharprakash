import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Sridhar Prakash",
  description:
    "About Sridhar Prakash, his public service focus, community leadership, youth engagement, and local work in Bengaluru.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Sridhar Prakash",
    description:
      "About Sridhar Prakash, his public service focus, community leadership, youth engagement, and local work in Bengaluru.",
    url: "/about",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sridhar Prakash",
    description:
      "About Sridhar Prakash, his public service focus, community leadership, youth engagement, and local work in Bengaluru.",
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
