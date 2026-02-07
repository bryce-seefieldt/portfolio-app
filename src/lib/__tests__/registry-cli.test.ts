import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "../registry";

const mockExistsSync = vi.fn();
const mockReadFileSync = vi.fn();
const mockYamlLoad = vi.fn();

vi.mock("node:fs", () => ({
  default: {
    existsSync: (...args: unknown[]) => mockExistsSync(...args),
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  },
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
  readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
}));

vi.mock("js-yaml", () => ({
  load: (...args: unknown[]) => mockYamlLoad(...args),
}));

describe("registry CLI", () => {
  // RATIONALE: CLI output drives CI verification and human triage for registry integrity.
  // FAILURE MODE: Non-zero exit codes must surface on validation errors.
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
    mockExistsSync.mockReset().mockReturnValue(true);
    mockReadFileSync.mockReset().mockReturnValue("fake");
    mockYamlLoad.mockReset().mockReturnValue([mockProject]);
    process.env.NEXT_RUNTIME = "test";
    process.env.NEXT_PUBLIC_DOCS_BASE_URL = "/docs";
    process.env.NEXT_PUBLIC_GITHUB_URL = "https://github.com/acme";
    process.env.NEXT_PUBLIC_DOCS_GITHUB_URL = "https://github.com/acme/docs";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
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
    // FAILURE MODE: Load failures must fail CI and print diagnostics.
    const registry = await import("../registry");

    const status = registry.runRegistryCli("", {
      loadProjectRegistry: () => {
        throw "boom";
      },
    });

    expect(status).toBe(1);
    expect(console.error).toHaveBeenCalled();
  });

  it("should use default helpers when no overrides provided", async () => {
    const registry = await import("../registry");

    const status = registry.runRegistryCli("");

    expect(status).toBe(0);
    expect(console.log).toHaveBeenCalledWith("Registry OK (projects: 1)");
  });

  it("should report error messages for Error instances", async () => {
    // ASSUMPTION: Errors are surfaced as human-readable messages for CI logs.
    const registry = await import("../registry");

    const status = registry.runRegistryCli("", {
      loadProjectRegistry: () => {
        throw new Error("registry failed");
      },
    });

    expect(status).toBe(1);
    expect(console.error).toHaveBeenCalled();
  });
});
