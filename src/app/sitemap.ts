import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { PROJECTS } from "@/data/projects";

/**
 * Sitemap Generation
 *
 * Generates XML sitemap for SEO crawlers.
 * Uses Next.js App Router sitemap.ts convention (Next.js 13+).
 *
 * Includes:
 * - Static routes (/, /cv, /projects, /contact)
 * - Dynamic project detail pages (/projects/[slug])
 *
 * Priority guidance:
 * - 1.0: Homepage (highest priority)
 * - 0.8: Main sections (CV, Projects)
 * - 0.7: Individual project pages
 * - 0.6: Contact page
 *
 * Change frequency:
 * - Homepage: weekly (content updates)
 * - CV: monthly (career updates)
 * - Projects: weekly (new projects, updates)
 * - Individual projects: monthly (refinements)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL || "http://localhost:3000";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic project routes
  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
