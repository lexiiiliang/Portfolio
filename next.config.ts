import type { NextConfig } from "next";

const isVercelBuild = process.env.VERCEL === "1" || process.env.BUILD_TARGET === "vercel";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      // Only content-hashed derivatives are immutable. Original media URLs can
      // still be replaced by content:sync and retain their existing cache rules.
      source: "/media/livis-optimized/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }];
  },
  typescript: isVercelBuild
    ? { tsconfigPath: "tsconfig.vercel.json" }
    : undefined,
};

export default nextConfig;
