import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "../registry";

describe("registry CLI", () => {
  const mockProject: Project = {
    slug: "portfolio-app",
    title: "Portfolio App",
    summary: "A portfolio app with evidence-driven docs.",
    tags: ["nextjs"],
    status: "featured",
    evidence: {
      dossierPath: "portfolio/portfolio-app",
      threatModelPath: "security/portfolio-app",
    },
  };

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should list projects", async () => {
    const registry = await import("../registry");

    const status = registry.runRegistryCli("--list", {
      loadProjectRegistry: () => [mockProject],
    });

    expect(status).toBe(0);
    expect(console.log).toHaveBeenCalledWith("portfolio-app\tPortfolio App");
  });

  it("should validate registry and emit warnings", async () => {
    const registry = await import("../registry");

    const status = registry.runRegistryCli("", {
      loadProjectRegistry: () => [mockProject],
      evidenceLinks: () => ({}),
      validateEvidenceLinks: () => ["warning"],
    });

    expect(status).toBe(0);
    expect(console.warn).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Registry OK (projects: 1)");
  });

  it("should return non-zero status on failure", async () => {
    const registry = await import("../registry");

    const status = registry.runRegistryCli("", {
      loadProjectRegistry: () => {
        throw "boom";
      },
    });

    expect(status).toBe(1);
    expect(console.error).toHaveBeenCalled();
  });
});
