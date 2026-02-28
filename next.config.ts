import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add the IP address from your terminal warning here
  allowedDevOrigins: ["192.168.29.207", "localhost:3000"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/media",
        destination: "/events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
