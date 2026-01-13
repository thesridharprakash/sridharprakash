import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  metadataBase: new URL("https://www.sridharprakash.in"),

  title: {
    default: "Sridhar Prakash | Public Service & Development",
    template: "%s | Sridhar Prakash",
  },

  description:
    "Sridhar Prakash is a public servant from Bengaluru, Karnataka, committed to nation-first development, clean governance, and grassroots leadership.",

  openGraph: {
    title: "Sridhar Prakash | Public Service & Development",
    description:
      "Public service, development-led leadership, and citizen engagement from Bengaluru, Karnataka.",
    url: "https://www.sridharprakash.in",
    siteName: "Sridhar Prakash",
    images: [
      {
        url: "https://www.sridharprakash.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sridhar Prakash – Public Service & Development",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sridhar Prakash | Public Service & Development",
    description:
      "Public service, development-led leadership, and citizen engagement from Bengaluru, Karnataka.",
    images: ["https://www.sridharprakash.in/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <Header />

        {/* Page transitions */}
        <ClientLayout>{children}</ClientLayout>

        <Footer />
      </body>
    </html>
  );
}
