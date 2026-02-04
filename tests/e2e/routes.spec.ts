import { test, expect } from "@playwright/test";

test.describe("Route coverage", () => {
  test("should render core routes", async ({ page }) => {
    const routes = ["/", "/cv", "/projects", "/contact"];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("should render all project detail routes linked from /projects", async ({ page }) => {
    await page.goto("/projects");

    const projectLinks = page.locator('a[href^="/projects/"]');
    const linkCount = await projectLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    const hrefs = new Set<string>();
    for (let i = 0; i < linkCount; i += 1) {
      const href = await projectLinks.nth(i).getAttribute("href");
      if (href) hrefs.add(href);
    }

    for (const href of hrefs) {
      const response = await page.goto(href);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("should return a friendly 404 page for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.locator("text=Page not found")).toBeVisible();
  });

  test("should return a 404 page for invalid project slug", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.locator("text=Page not found")).toBeVisible();
  });
});

test.describe("Health and metadata routes", () => {
  test("should return health check JSON", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);

    const body = await response.json();
    expect(body.status).toBeDefined();
    expect(body.environment).toBeDefined();
  });

  test("should expose robots.txt", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toMatch(/user-agent/i);
  });

  test("should expose sitemap.xml", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("<urlset");
  });
});
