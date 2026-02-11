import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add the IP address from your terminal warning here
  allowedDevOrigins: ["192.168.29.207", "localhost:3000"],
};

export default nextConfig;
