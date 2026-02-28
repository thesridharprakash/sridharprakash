import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book",
  description:
    "Book Sridhar Prakash for political campaign coverage, social media promotion, and on-ground creator collaborations.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book | Sridhar Prakash",
    description:
      "Book Sridhar Prakash for political campaign coverage, social media promotion, and on-ground creator collaborations.",
    url: "/book",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book | Sridhar Prakash",
    description:
      "Book Sridhar Prakash for political campaign coverage, social media promotion, and on-ground creator collaborations.",
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
