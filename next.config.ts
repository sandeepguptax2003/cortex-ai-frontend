import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: Do NOT use output:'standalone' with AWS Amplify — Amplify manages the build itself.
  // standalone is only needed for self-hosted Docker deployments.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "*.amazonaws.com" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
};

export default nextConfig;
