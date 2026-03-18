import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 'standalone' produces a self-contained Node.js server — required for Docker.
  // Do NOT use 'export' (static HTML) when deploying with Docker/EC2/ECS.
  output: "standalone",
  images: {
    unoptimized: true,
    // Allow images served from the backend or S3
    remotePatterns: [
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "cortex-meetings-prod.s3.amazonaws.com" },
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
  // Ensure cookies work cross-origin with backend
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
