// Importing the necessary testing functions and assertions from Playwright's test library
import { test, expect } from "@playwright/test";

// Defining an array of route objects, each containing a path and a corresponding title.
// These routes represent the different pages of the Portfolio App that will be tested.
const ROUTES = [
  { path: "/", title: "Portfolio App" }, // Home page
  { path: "/cv", title: "CV" }, // Curriculum Vitae page
  { path: "/projects", title: "Projects" }, // Projects overview page
  { path: "/contact", title: "Contact" }, // Contact page
  { path: "/projects/portfolio-app", title: "Portfolio App" }, // Specific project page
];

// Describing a test suite for smoke tests, which are basic tests to ensure that the application is functioning correctly.
test.describe("Smoke tests", () => {
  // Iterating over each route defined in the ROUTES array to create individual tests for each route.
  ROUTES.forEach(({ path }) => {
    // Defining a test for each route to check if it renders correctly.
    test(`Route ${path} should render`, async ({ page }) => {
      // Navigating to the specified path and storing the response.
      const response = await page.goto(path);
      // Asserting that the response status is less than 400, indicating a successful page load.
      expect(response?.status()).toBeLessThan(400);
      // Performing a basic content check to ensure that an <h1> element is present on the page.
      expect(page.locator("h1")).toBeTruthy();
    });
  });

  // Defining a test to check if the evidence links on the project page resolve to documentation.
  test("Evidence links resolve to docs", async ({ page }) => {
    // Navigating to the specific project page.
    await page.goto("/projects/portfolio-app");
    // Locating the first link that contains '/docs/' in its href attribute.
    const docsLink = page.locator('a[href*="/docs/"]').first();
    // Asserting that the documentation link is present on the page.
    expect(docsLink).toBeTruthy();
  });
});
