import { describe, expect, it, vi } from "vitest";

describe("config variants", () => {
  it("should fall back to null for invalid site URL", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not-a-url";
    process.env.NEXT_PUBLIC_DOCS_BASE_URL = "/docs";
    vi.resetModules();

    const config = await import("../config");
    expect(config.SITE_URL).toBeNull();
  });

  it("should normalize trailing slashes in configured URLs", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
    process.env.NEXT_PUBLIC_DOCS_BASE_URL = "https://docs.example.com/";
    vi.resetModules();

    const config = await import("../config");
    expect(config.SITE_URL).toBe("https://example.com");
    expect(config.DOCS_BASE_URL).toBe("https://docs.example.com");
  });

  it("should return base docs URL for empty path", async () => {
    process.env.NEXT_PUBLIC_DOCS_BASE_URL = "/docs";
    vi.resetModules();

    const config = await import("../config");
    expect(config.docsUrl("")).toBe("/docs");
  });

  it("should build mailto URL with subject", async () => {
    const config = await import("../config");
    expect(config.mailtoUrl("hello@example.com", "Hello World")).toBe(
      "mailto:hello@example.com?subject=Hello%20World",
    );
  });

  it("should return base URLs when path is empty", async () => {
    process.env.NEXT_PUBLIC_GITHUB_URL = "https://github.com/example";
    process.env.NEXT_PUBLIC_DOCS_GITHUB_URL = "https://github.com/example/docs";
    vi.resetModules();

    const config = await import("../config");
    expect(config.githubUrl("")).toBe("https://github.com/example");
    expect(config.docsGithubUrl("")).toBe("https://github.com/example/docs");
  });

  it("should resolve environment helpers from VERCEL_ENV", async () => {
    process.env.VERCEL_ENV = "production";
    vi.resetModules();

    const config = await import("../config");
    expect(config.isProduction()).toBe(true);
    expect(config.isPreview()).toBe(false);
    expect(config.isStaging()).toBe(false);
    expect(config.isDevelopment()).toBe(false);
  });
});
