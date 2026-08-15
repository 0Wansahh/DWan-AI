import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Semua request ke /api/ akan dilempar ke backend Express (Port 3000)
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*", 
      },
    ];
  },
};

export default nextConfig;
