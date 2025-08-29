import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Remove turbopack as it's causing issues
  },
};

export default nextConfig;
