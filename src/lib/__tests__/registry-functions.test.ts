import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("registry helpers", () => {
  beforeEach(() => {
    mockExistsSync.mockReset().mockReturnValue(true);
    mockReadFileSync.mockReset().mockReturnValue("fake");
    mockYamlLoad.mockReset();
    process.env.NEXT_RUNTIME = "test";
    process.env.NEXT_PUBLIC_DOCS_BASE_URL = "/docs";
    process.env.NEXT_PUBLIC_GITHUB_URL = "https://github.com/acme";
    process.env.NEXT_PUBLIC_DOCS_GITHUB_URL = "https://github.com/acme/docs";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
  });

  async function loadRegistryModule() {
    vi.resetModules();
    return import("../registry");
  }

  it("should load and cache project registry with interpolation", async () => {
    mockYamlLoad.mockReturnValue([
      {
        slug: "portfolio-app",
        title: "Portfolio App",
        summary: "A portfolio app with evidence-driven docs.",
        tags: ["nextjs"],
        status: "featured",
        repoUrl: "{GITHUB_URL}/portfolio-app",
        demoUrl: "{SITE_URL}/demo",
        evidence: {
          dossierPath: "projects/portfolio-app",
          threatModelPath: "security/threat-models/portfolio-app-threat-model",
          adrIndexPath: "architecture/adr",
          runbooksPath: "operations/runbooks",
          github: "{DOCS_GITHUB_URL}/blob/main",
        },
      },
    ]);

    const registry = await loadRegistryModule();
    const projects = registry.loadProjectRegistry();

    expect(projects[0].repoUrl).toBe("https://github.com/acme/portfolio-app");
    expect(projects[0].demoUrl).toBe("https://example.com/demo");
    expect(projects[0].evidence?.github).toBe("https://github.com/acme/docs/blob/main");

    const cached = registry.getAllProjects();
    expect(cached).toBe(projects);
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);
  });

  it("should accept registry object with metadata", async () => {
    mockYamlLoad.mockReturnValue({
      metadata: { version: 1, lastUpdated: "2026-01-01" },
      projects: [
        {
          slug: "portfolio-app",
          title: "Portfolio App",
          summary: "A portfolio app with evidence-driven docs.",
          tags: ["nextjs"],
        },
      ],
    });

    const registry = await loadRegistryModule();
    const projects = registry.loadProjectRegistry();

    expect(projects).toHaveLength(1);
  });

  it("should throw for invalid registry format", async () => {
    mockYamlLoad.mockReturnValue({ metadata: { version: 1 } });
    const registry = await loadRegistryModule();

    expect(() => registry.loadProjectRegistry()).toThrow("Invalid registry format");
  });

  it("should throw for duplicate slugs", async () => {
    mockYamlLoad.mockReturnValue([
      {
        slug: "portfolio-app",
        title: "Portfolio App",
        summary: "A portfolio app with evidence-driven docs.",
        tags: ["nextjs"],
      },
      {
        slug: "portfolio-app",
        title: "Duplicate",
        summary: "Duplicate slug entry.",
        tags: ["nextjs"],
      },
    ]);

    const registry = await loadRegistryModule();
    expect(() => registry.loadProjectRegistry()).toThrow("Duplicate slug detected");
  });

  it("should throw for invalid project entry types", async () => {
    mockYamlLoad.mockReturnValue(["invalid"]);
    const registry = await loadRegistryModule();

    expect(() => registry.loadProjectRegistry()).toThrow("Invalid project entry");
  });

  it("should throw when registry file is missing", async () => {
    mockExistsSync.mockReturnValue(false);
    const registry = await loadRegistryModule();

    expect(() => registry.loadProjectRegistry()).toThrow("Project registry not found");
  });

  it("should return featured projects and project by slug", async () => {
    mockYamlLoad.mockReturnValue([
      {
        slug: "portfolio-app",
        title: "Portfolio App",
        summary: "A portfolio app with evidence-driven docs.",
        tags: ["nextjs"],
        status: "featured",
      },
      {
        slug: "other-app",
        title: "Other App",
        summary: "Another app with evidence-driven docs.",
        tags: ["node"],
        status: "active",
      },
    ]);

    const registry = await loadRegistryModule();
    expect(registry.getFeaturedProjects()).toHaveLength(1);
    expect(registry.getProjectBySlug("other-app")?.slug).toBe("other-app");
  });

  it("should generate evidence links and validation warnings", async () => {
    mockYamlLoad.mockReturnValue([
      {
        slug: "portfolio-app",
        title: "Portfolio App",
        summary: "A portfolio app with evidence-driven docs.",
        tags: ["nextjs"],
        evidence: {
          dossierPath: "portfolio/portfolio-app",
          threatModelPath: "security/portfolio-app", // invalid pattern
          adrIndexPath: "architecture/adr",
          runbooksPath: "operations/runbooks",
          adr: [{ title: "ADR", url: "architecture/adr/adr-0001.md" }],
          runbooks: [{ title: "Runbook", url: "operations/runbooks/rbk.md" }],
        },
      },
    ]);

    const registry = await loadRegistryModule();
    const project = registry.loadProjectRegistry()[0];

    const links = registry.evidenceLinks(project);
    expect(links.dossier).toBe("/docs/portfolio/portfolio-app");

    const warnings = registry.validateEvidenceLinks(project);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((warning) => warning.includes("dossierPath"))).toBe(true);
  });

  it("should null out unresolved placeholders", async () => {
    process.env.NEXT_PUBLIC_GITHUB_URL = "";
    process.env.NEXT_PUBLIC_DOCS_GITHUB_URL = "";
    process.env.NEXT_PUBLIC_SITE_URL = "";

    mockYamlLoad.mockReturnValue([
      {
        slug: "portfolio-app",
        title: "Portfolio App",
        summary: "A portfolio app with evidence-driven docs.",
        tags: ["nextjs"],
        repoUrl: "{GITHUB_URL}",
        demoUrl: "{SITE_URL}",
        evidence: { github: "{DOCS_GITHUB_URL}" },
      },
    ]);

    const registry = await loadRegistryModule();
    const projects = registry.loadProjectRegistry();

    expect(projects[0].repoUrl).toBeNull();
    expect(projects[0].demoUrl).toBeNull();
    expect(projects[0].evidence?.github).toBeNull();
  });
});
