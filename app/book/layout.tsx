import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book",
  description:
    "Book Sridhar Prakash for lifestyle shoots, travel storytelling, and creator collaborations.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book | Sridhar Prakash",
    description:
      "Book Sridhar Prakash for lifestyle shoots, travel storytelling, and creator collaborations.",
    url: "/book",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book | Sridhar Prakash",
    description:
      "Book Sridhar Prakash for lifestyle shoots, travel storytelling, and creator collaborations.",
    images: ["/images/og-image.jpg"],
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
