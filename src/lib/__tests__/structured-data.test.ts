import { describe, expect, it, vi } from "vitest";

describe("structured data", () => {
  it("should build person schema with sameAs links when configured", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.NEXT_PUBLIC_GITHUB_URL = "https://github.com/example";
    process.env.NEXT_PUBLIC_LINKEDIN_URL = "https://linkedin.com/in/example";
    vi.resetModules();

    const { generatePersonSchema } = await import("../structured-data");
    const schema = generatePersonSchema();

    expect(schema.url).toBe("https://example.com");
    expect(schema.sameAs).toEqual([
      "https://github.com/example",
      "https://linkedin.com/in/example",
    ]);
  });

  it("should omit sameAs when no public profiles configured", async () => {
    process.env.NEXT_PUBLIC_GITHUB_URL = "";
    process.env.NEXT_PUBLIC_LINKEDIN_URL = "";
    process.env.NEXT_PUBLIC_SITE_URL = "";
    vi.resetModules();

    const { generatePersonSchema } = await import("../structured-data");
    const schema = generatePersonSchema();

    expect(schema.sameAs).toBeUndefined();
    expect(schema.url).toBe("https://example.com");
  });

  it("should build website schema with search action", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://portfolio.test";
    vi.resetModules();

    const { generateWebsiteSchema } = await import("../structured-data");
    const schema = generateWebsiteSchema();

    expect(schema.url).toBe("https://portfolio.test");
    expect(schema.potentialAction.target.urlTemplate).toBe(
      "https://portfolio.test/search?q={search_term_string}",
    );
  });

  it("should fall back to example.com when SITE_URL is missing", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "";
    vi.resetModules();

    const { generateWebsiteSchema } = await import("../structured-data");
    const schema = generateWebsiteSchema();

    expect(schema.url).toBe("https://example.com");
    expect(schema.potentialAction.target.urlTemplate).toBe(
      "https://example.com/search?q={search_term_string}",
    );
  });

  it("should generate breadcrumb schema", async () => {
    const { generateBreadcrumbSchema } = await import("../structured-data");
    const schema = generateBreadcrumbSchema([
      { name: "Home", url: "https://example.com" },
      { name: "Projects", url: "https://example.com/projects" },
    ]);

    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[1]).toMatchObject({
      position: 2,
      name: "Projects",
      item: "https://example.com/projects",
    });
  });

  it("should combine and format schemas", async () => {
    const { combineSchemas, formatSchemaAsScript } = await import("../structured-data");
    const combined = combineSchemas([{ "@type": "Person" }, { "@type": "WebSite" }]);

    expect(combined["@graph"]).toHaveLength(2);

    const script = formatSchemaAsScript(combined);
    expect(script).toContain('"@graph"');
  });
});
