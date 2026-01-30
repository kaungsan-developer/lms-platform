import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "xixltnxitgourytqfoqd.supabase.co",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
