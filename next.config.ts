import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Bundle analyzer: Visualize bundle composition and identify optimization opportunities
// Run with: ANALYZE=true pnpm build
const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Performance: Enable React Compiler for optimized rendering
  reactCompiler: true,

  // Build: Use Turbopack (Next.js 16+ default) - empty config to use defaults
  // Bundle analyzer plugin uses webpack-compatible API that works with Turbopack
  turbopack: {},

  // Caching & Performance: Image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
  },

  // Performance: Enable compression
  compress: true,

  // Security: Remove X-Powered-By header
  poweredByHeader: false,

  // Caching: Configure HTTP Cache-Control headers
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600, stale-while-revalidate=86400",
        },
      ],
    },
  ],
};

export default withBundleAnalyzerConfig(nextConfig);
