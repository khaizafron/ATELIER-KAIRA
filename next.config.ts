import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // ✅ kekalkan – kau memang guna ni
  typescript: {
    ignoreBuildErrors: true,
  },

  // ❌ eslint config DIBUANG
  // Next.js 16 TAK support eslint dalam next.config.ts
}

export default nextConfig
