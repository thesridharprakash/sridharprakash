import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BJP Yuva Morcha",
  description:
    "Join the BJP Yuva Morcha team for seva, youth participation, public outreach, civic awareness, and community work in Bengaluru.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "BJP Yuva Morcha | Sridhar Prakash",
    description:
      "Join the BJP Yuva Morcha team for seva, youth participation, public outreach, civic awareness, and community work in Bengaluru.",
    url: "/book",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BJP Yuva Morcha | Sridhar Prakash",
    description:
      "Join the BJP Yuva Morcha team for seva, youth participation, public outreach, civic awareness, and community work in Bengaluru.",
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
