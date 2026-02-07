import { describe, expect, it, vi } from "vitest";

async function loadRobots(siteUrl: string | null) {
  vi.resetModules();
  vi.doMock("@/lib/config", () => ({
    SITE_URL: siteUrl,
  }));
  const module = await import("../robots");
  return module.default;
}

// RATIONALE: robots.txt must point crawlers to the correct sitemap.
describe("robots", () => {
  it("should allow all and include sitemap", async () => {
    const robots = await loadRobots("https://example.com");
    const result = robots();

    expect(result.rules).toEqual({ userAgent: "*", allow: "/", disallow: [] });
    expect(result.sitemap).toBe("https://example.com/sitemap.xml");
  });

  it("should fall back to localhost when SITE_URL is missing", async () => {
    const robots = await loadRobots(null);
    const result = robots();

    expect(result.sitemap).toBe("http://localhost:3000/sitemap.xml");
  });
});
