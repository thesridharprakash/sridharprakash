import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Sridhar Prakash for creator partnerships, travel shoots, and casual collaborations.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Sridhar Prakash",
    description:
      "Contact Sridhar Prakash for creator partnerships, travel shoots, and casual collaborations.",
    url: "/contact",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Sridhar Prakash",
    description:
      "Contact Sridhar Prakash for creator partnerships, travel shoots, and casual collaborations.",
    images: ["/images/og-image.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
