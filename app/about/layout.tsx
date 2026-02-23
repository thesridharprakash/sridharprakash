import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story",
  description:
    "Learn about Sridhar Prakash's creator journey, on-ground political storytelling, and current mission.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Story | Sridhar Prakash",
    description:
      "Learn about Sridhar Prakash's creator journey, on-ground political storytelling, and current mission.",
    url: "/about",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Story | Sridhar Prakash",
    description:
      "Learn about Sridhar Prakash's creator journey, on-ground political storytelling, and current mission.",
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
