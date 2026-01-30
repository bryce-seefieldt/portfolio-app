/**
 * Structured Data Utilities
 *
 * Generates JSON-LD structured data for SEO and search engine optimization.
 * Used by layout.tsx and individual pages to provide semantic metadata.
 *
 * References:
 * - JSON-LD: https://json-ld.org/
 * - Schema.org: https://schema.org/
 * - Google Rich Results Test: https://search.google.com/test/rich-results
 */

import { SITE_URL, GITHUB_URL, LINKEDIN_URL } from "./config";

/**
 * Person Schema
 *
 * Describes the portfolio owner as a Person.
 * Helps search engines understand "who" this portfolio belongs to.
 */
export function generatePersonSchema() {
  const sameAs = [];
  if (GITHUB_URL) sameAs.push(GITHUB_URL);
  if (LINKEDIN_URL) sameAs.push(LINKEDIN_URL);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Portfolio Owner",
    url: SITE_URL || "https://example.com",
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    description:
      "Enterprise-grade full-stack engineer portfolio with evidence-based project documentation.",
  };
}

/**
 * WebSite Schema
 *
 * Describes the website and its search capabilities.
 * Enables rich search features like "sitelinks search box" in Google.
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL || "https://example.com",
    name: "Portfolio",
    description:
      "Enterprise-grade full-stack portfolio: interactive CV, verified projects, and engineering evidence.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL || "https://example.com"}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * BreadcrumbList Schema
 *
 * Describes the breadcrumb navigation path.
 * Useful for nested pages (e.g., /projects/[slug]).
 * Currently not used for main pages, but available for future use.
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Combine multiple schemas into a single JSON-LD script.
 * Pass an array of schema objects to combine.
 */
export function combineSchemas(schemas: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

/**
 * Format a schema as a JSON-LD script tag string.
 * Use this to render in the page head.
 */
export function formatSchemaAsScript(schema: unknown): string {
  return JSON.stringify(schema, null, 2);
}
