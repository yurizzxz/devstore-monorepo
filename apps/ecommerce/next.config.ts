import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@repo/core",
    "@repo/lib",
    "@repo/prisma",
    "@repo/ui",
    "@repo/utils",
  ],
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE || "",
      "graph.facebook.com",
      "example.com",
    ],
  },
};

export default nextConfig;
