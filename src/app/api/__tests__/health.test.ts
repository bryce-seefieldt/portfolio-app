import { describe, expect, it, vi } from "vitest";

// Mock project registry for deterministic health responses.
vi.mock("@/data/projects", () => ({
  PROJECTS: [{ slug: "portfolio-app" }],
}));

import { GET } from "../health/route";

// RATIONALE: Health endpoint is consumed by monitoring and must be deterministic.
describe("/api/health", () => {
  it("should return healthy when projects are present", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.status).toBe("healthy");
    expect(payload.projectCount).toBeGreaterThan(0);
  });

  it("should include commit metadata when available", async () => {
    process.env.VERCEL_GIT_COMMIT_SHA = "abcdef123456";
    const response = await GET();
    const payload = await response.json();

    expect(payload.commit).toBe("abcdef1");
  });

  it("should return degraded when no projects loaded", async () => {
    vi.resetModules();
    vi.doMock("@/data/projects", () => ({ PROJECTS: [] }));
    const { GET: degraded } = await import("../health/route");

    const response = await degraded();
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.status).toBe("degraded");
  });

  it("should return unhealthy when an exception occurs", async () => {
    vi.resetModules();
    vi.doMock("@/data/projects", () => ({
      get PROJECTS() {
        throw new Error("boom");
      },
    }));
    const { GET: unhealthy } = await import("../health/route");

    const response = await unhealthy();
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.status).toBe("unhealthy");
  });

  it("should return unknown error for non-Error exceptions", async () => {
    vi.resetModules();
    vi.doMock("@/data/projects", () => ({
      get PROJECTS() {
        throw "boom";
      },
    }));
    const { GET: unhealthy } = await import("../health/route");

    const response = await unhealthy();
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBe("Unknown error");
  });
});
