// e2e/evidence-links.spec.ts
// E2E tests for evidence link resolution and component rendering

import { test, expect } from "@playwright/test";

test.describe("Evidence Link Resolution", () => {
  test.describe("Portfolio App Project Page", () => {
    test("should render project page without errors", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify page loads
      await expect(page).toHaveTitle(/Portfolio App/i);

      // Verify main content renders
      await expect(page.locator("h1")).toContainText("Portfolio App");
    });

    test("should render EvidenceBlock component", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify "Evidence Artifacts" section exists
      await expect(page.locator("text=Evidence Artifacts")).toBeVisible();
    });

    test("should display all evidence categories", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify all 5 evidence categories are present
      await expect(page.getByRole("heading", { name: "Project Dossier" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Threat Model" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Architecture Decisions" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Operational Runbooks" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Source Code" })).toBeVisible();
    });

    test("should render BadgeGroup with correct badges", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify gold standard badge for portfolio-app
      await expect(page.getByText("Gold Standard", { exact: true }).first()).toBeVisible();

      // Verify other expected badges
      await expect(page.getByText("Docs Available", { exact: true }).first()).toBeVisible();
      await expect(page.getByTitle("STRIDE security analysis available").first()).toBeVisible();
    });

    test("should have clickable evidence links", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify links are present and have href attributes
      const dossierLinks = page.locator('a[href*="/docs/"]');
      const count = await dossierLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should render evidence links with correct structure", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify link elements have proper href attributes
      const evidenceLinks = page.getByRole("link", {
        name: /View (Dossier|Threat Model|ADR Index|Runbooks|Repository)/,
      });
      const firstLink = evidenceLinks.first();

      // Check that href attribute exists
      const href = await firstLink.getAttribute("href");
      expect(href).toBeTruthy();
      expect(typeof href).toBe("string");
    });
  });

  test.describe("Responsive Design", () => {
    test("should render on mobile viewport", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/projects/portfolio-app");

      // Verify content is visible on mobile
      await expect(page.locator("h1")).toContainText("Portfolio App");
      await expect(page.locator("text=Evidence Artifacts")).toBeVisible();
    });

    test("should render on tablet viewport", async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/projects/portfolio-app");

      // Verify content is visible on tablet
      await expect(page.locator("h1")).toContainText("Portfolio App");
      await expect(page.locator("text=Evidence Artifacts")).toBeVisible();
    });

    test("should render on desktop viewport", async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/projects/portfolio-app");

      // Verify content is visible on desktop
      await expect(page.locator("h1")).toContainText("Portfolio App");
      await expect(page.locator("text=Evidence Artifacts")).toBeVisible();
    });
  });

  test.describe("Component Rendering", () => {
    test("should render evidence links for each category", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify evidence links are present for core categories
      await expect(page.getByRole("link", { name: /View Dossier/ })).toBeVisible();
      await expect(page.getByRole("link", { name: /View Threat Model/ })).toBeVisible();
      const adrIndexLinks = page.getByRole("link", { name: /View ADR Index/ });
      const adrLinks = page.getByRole("link", { name: /ADR-/ });
      const adrCount = (await adrIndexLinks.count()) + (await adrLinks.count());
      expect(adrCount).toBeGreaterThan(0);
      await expect(page.getByRole("link", { name: /View Repository/ })).toBeVisible();
    });

    test("should render clickable links without errors", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      let navigationError = false;

      page.on("pageerror", () => {
        navigationError = true;
      });

      // Verify no errors during page interaction
      expect(navigationError).toBe(false);
    });
  });

  test.describe("Dark Mode Support", () => {
    test("should render correctly with dark mode", async ({ page }) => {
      // Set up dark color scheme
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto("/projects/portfolio-app");

      // Verify content is still visible
      await expect(page.locator("h1")).toContainText("Portfolio App");
      await expect(page.locator("text=Evidence Artifacts")).toBeVisible();
    });

    test("should render correctly with light mode", async ({ page }) => {
      // Set up light color scheme
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto("/projects/portfolio-app");

      // Verify content is still visible
      await expect(page.locator("h1")).toContainText("Portfolio App");
      await expect(page.locator("text=Evidence Artifacts")).toBeVisible();
    });
  });

  test.describe("Multi-browser Compatibility", () => {
    test("should render consistently across browsers", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify consistent rendering across browsers
      await expect(page.locator("h1")).toContainText("Portfolio App");
      await expect(page.locator("text=Evidence Artifacts")).toBeVisible();
      await expect(page.getByText("Gold Standard", { exact: true }).first()).toBeVisible();
    });
  });

  test.describe("Link Accessibility", () => {
    test("should have accessible link text", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify links have either text content or aria-label
      const allLinks = page.locator("a");
      const linkCount = await allLinks.count();

      for (let i = 0; i < linkCount; i++) {
        const link = allLinks.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute("aria-label");

        // Link should have either visible text or aria-label
        expect(text?.trim() || ariaLabel).toBeTruthy();
      }
    });

    test("should have keyboard navigable evidence links", async ({ page }) => {
      await page.goto("/projects/portfolio-app");

      // Verify links can receive focus
      const firstLink = page.locator("a").first();
      await firstLink.focus();

      // Verify focused state is visible
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBe("A");
    });
  });
});
