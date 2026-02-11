import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sridharprakash.vercel.app"),
  title: {
    default: "Sridhar Prakash | Travel, IRL & Moto Vlogs",
    template: "%s | Sridhar Prakash",
  },
  description:
    "Travel stories, IRL streaming moments, food discoveries, and moto vlogs by Sridhar Prakash.",
  openGraph: {
    images: ["/images/og-image.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-image.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${manrope.variable} ${playfair.variable} bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--accent)] selection:text-black`}
      >
        <Header />
        {children}
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
