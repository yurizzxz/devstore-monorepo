import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@repo/core",
    "@repo/auth",
    "@repo/lib",
    "@repo/prisma",
    "@repo/ui",
    "@repo/utils",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/c4jdhuwf/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
