import type { NextConfig } from "next";

const API_TARGET =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API_TARGET}/api/:path*` },
      { source: "/uploads/:path*", destination: `${API_TARGET}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
