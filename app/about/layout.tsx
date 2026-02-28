import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Sridhar Prakash",
  description:
    "About Sridhar Prakash, a Bengaluru, Karnataka creator focused on political campaign coverage, field reports, and IRL storytelling.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Sridhar Prakash",
    description:
      "About Sridhar Prakash, a Bengaluru, Karnataka creator focused on political campaign coverage, field reports, and IRL storytelling.",
    url: "/about",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sridhar Prakash",
    description:
      "About Sridhar Prakash, a Bengaluru, Karnataka creator focused on political campaign coverage, field reports, and IRL storytelling.",
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
