import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Bundle analyzer: Visualize bundle composition and identify optimization opportunities
// Run with: ANALYZE=true pnpm build
const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Dev: Configure allowed origins for WSL2/Docker environments
  // IP 172.19.254.176 is from Docker/WSL2 internal network
  // This typically happens when accessing the dev server from Windows host through WSL2
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  /*
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.local",
    "host.docker.internal",
    "*.docker.internal",
    // WSL2/Docker subnet - typically 172.16.0.0/12, but you can be more specific
    // if you know your exact range (e.g., "172.19.*" if supported)
  ],*/
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

  // Observability: Health check and structured logging
  // - Health endpoint: /api/health (GET) returns status, environment, commit, build time
  // - Structured logging: src/lib/observability.ts provides JSON logging for monitoring
  // - Environment variables used: VERCEL_ENV, VERCEL_GIT_COMMIT_SHA, BUILD_TIME
  // See: `docs/60-projects/portfolio-app/08-observability.md`

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
