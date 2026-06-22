import { describe, expect, it, vi } from "vitest";

async function loadSitemap(siteUrl: string | null) {
  vi.resetModules();
  vi.doMock("@/lib/config", () => ({
    SITE_URL: siteUrl,
  }));
  vi.doMock("@/data/projects", () => ({
    PROJECTS: [{ slug: "portfolio-app" }, { slug: "portfolio-docs" }],
  }));
  const pageModule = await import("../sitemap");
  return pageModule.default;
}

// RATIONALE: Sitemap must include core routes and all project slugs.
describe("sitemap", () => {
  it("should include static and project routes", async () => {
    const sitemap = await loadSitemap("https://example.com");
    const routes = sitemap();
    const urls = routes.map((entry) => entry.url);

    expect(urls).toContain("https://example.com");
    expect(urls).toContain("https://example.com/cv");
    expect(urls).toContain("https://example.com/projects");
    expect(urls).toContain("https://example.com/contact");
    expect(urls).toContain("https://example.com/projects/portfolio-app");
    expect(urls).toContain("https://example.com/projects/portfolio-docs");
  });

  it("should fall back to localhost when SITE_URL is missing", async () => {
    const sitemap = await loadSitemap(null);
    const routes = sitemap();
    const urls = routes.map((entry) => entry.url);

    expect(urls).toContain("http://localhost:3000");
    expect(urls).toContain("http://localhost:3000/projects/portfolio-app");
  });
});
