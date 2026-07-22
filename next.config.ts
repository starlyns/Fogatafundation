import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the site can be served from Cloudflare Workers static assets.
  output: "export",
  // next/image optimization is not available with static export; serve images as-is.
  images: {
    unoptimized: true,
  },
  // Emit trailing-slash directories so Workers/static hosts resolve routes predictably.
  trailingSlash: true,
  reactStrictMode: true,
  // Transpile the Three ecosystem for reliable static builds.
  transpilePackages: ["three"],
};

export default nextConfig;
