import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence the dev-mode cross-origin HMR warning when opening the app
  // from a LAN IP (e.g. 192.168.x.x) instead of localhost.
  allowedDevOrigins: ["192.168.56.1", "192.168.0.0/16", "localhost"],
};

export default nextConfig;
