import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  metadataBase: new URL("https://sridharprakash.vercel.app"),

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
    url: "https://sridharprakash.vercel.app",
    siteName: "Sridhar Prakash",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sridhar Prakash",
      },
    ],
    locale: "en_IN",
    type: "website",
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
        <ClientLayout>
          {children}
        </ClientLayout>

        <Footer />
      </body>
    </html>
  );
}
