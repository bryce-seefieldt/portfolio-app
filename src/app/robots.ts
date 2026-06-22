import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/**
 * Robots.txt Generation
 *
 * Generates robots.txt for search engine crawlers.
 * Uses Next.js App Router robots.ts convention (Next.js 13+).
 *
 * Configuration:
 * - Allow all user agents (public portfolio site)
 * - No disallowed paths (all content is public)
 * - Sitemap reference for crawler guidance
 *
 * Security note:
 * This portfolio is intentionally public. No authentication, no private content.
 * If private routes are added in the future, add them to disallow array.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [],
    },
    sitemap: `${SITE_URL || "http://localhost:3000"}/sitemap.xml`,
  };
}
