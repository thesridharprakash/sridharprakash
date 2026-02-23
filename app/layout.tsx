import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Manrope, Playfair_Display } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import MotionProvider from "../components/MotionProvider";
import ScrollToTopClient from "../components/ScrollToTopClient";
import AccentBackground from "../components/AccentBackground";

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
    default: "Sridhar Prakash | Political Campaign Coverage & IRL Vlogs",
    template: "%s | Sridhar Prakash",
  },
  description:
    "Political campaign coverage, social media promotion, travel stories, and IRL vlogs by Sridhar Prakash.",
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
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <MotionProvider>
          <AccentBackground />
          <Header />
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <ScrollToTopClient />
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
