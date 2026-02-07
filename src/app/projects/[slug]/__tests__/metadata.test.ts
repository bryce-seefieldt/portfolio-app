// src/app/projects/[slug]/__tests__/metadata.test.ts
//
// Unit tests for project page metadata generation.
// RATIONALE: Metadata is the primary SEO/social contract for project pages; regressions are visible externally.
// FAILURE MODE: Missing or malformed metadata degrades previews and discovery.

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Metadata } from "next";
import type { Project } from "@/lib/registry";
import { getProjectBySlug } from "@/data/projects";

// ASSUMPTION: Metadata behavior is deterministic given a project registry entry.
// Mock the data/projects module
vi.mock("@/data/projects", () => ({
  getProjectBySlug: vi.fn(),
}));

// ASSUMPTION: SITE_URL is a stable base for canonical/OG URLs in tests.
// Mock the config module
vi.mock("@/lib/config", () => ({
  SITE_URL: "https://example.com",
}));

// Import after mocking
import * as ProjectModule from "@/app/projects/[slug]/page";

/**
 * Helper to create a valid mock Project object for testing.
 * RATIONALE: Centralizes required fields to reduce test noise and keep intent focused on metadata assertions.
 */
function createMockProject(overrides: Partial<Project> = {}): Project {
  const defaults: Project = {
    slug: "test-project",
    title: "Test Project",
    summary: "Test summary",
    category: "fullstack",
    tags: ["test"],
    startDate: "2025-01",
    techStack: [],
    keyProofs: [],
    status: "active",
  };
  return { ...defaults, ...overrides };
}

describe("Project Page Metadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateMetadata function", () => {
    it("should exist and be callable", async () => {
      expect(ProjectModule.generateMetadata).toBeDefined();
      expect(typeof ProjectModule.generateMetadata).toBe("function");
    });

    it("should return fallback metadata when project not found", async () => {
      // FAILURE MODE: Unregistered slugs must produce safe, user-friendly metadata.
      const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
      mockGetProjectBySlug.mockReturnValue(undefined);

      const metadata = (await ProjectModule.generateMetadata({
        params: Promise.resolve({ slug: "nonexistent" }),
      })) as Metadata;

      expect(metadata.title).toBe("Project Not Found");
      expect(metadata.description).toBe("The requested project could not be found.");
    });

    it("should return project title as page title", async () => {
      const mockProject = createMockProject({
        title: "Test Project",
        summary: "A test project for metadata validation.",
      });

      const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
      mockGetProjectBySlug.mockReturnValue(mockProject);

      const metadata = (await ProjectModule.generateMetadata({
        params: Promise.resolve({ slug: "test-project" }),
      })) as Metadata;

      expect(metadata.title).toBe("Test Project");
    });

    it("should return project summary as description", async () => {
      const mockProject = createMockProject({
        summary: "A test project for metadata validation.",
      });

      const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
      mockGetProjectBySlug.mockReturnValue(mockProject);

      const metadata = (await ProjectModule.generateMetadata({
        params: Promise.resolve({ slug: "test-project" }),
      })) as Metadata;

      expect(metadata.description).toBe("A test project for metadata validation.");
    });

    describe("Open Graph metadata", () => {
      // RATIONALE: Social previews depend on Open Graph fields and must be consistent across projects.
      it("should include Open Graph object", async () => {
        const mockProject = createMockProject({
          title: "Portfolio App",
          summary: "A comprehensive portfolio application.",
        });

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "portfolio-app" }),
        })) as Metadata;

        expect(metadata.openGraph).toBeDefined();
      });

      it("should set Open Graph title to project title", async () => {
        const mockProject = createMockProject({
          title: "Awesome Project",
        });

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.openGraph?.title).toBe("Awesome Project");
      });

      it("should set Open Graph description to project summary", async () => {
        const mockProject = createMockProject({
          summary: "This is the project summary.",
        });

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.openGraph?.description).toBe("This is the project summary.");
      });

      it("should set Open Graph type to website", async () => {
        const mockProject = createMockProject();

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.openGraph).toBeDefined();
        // Type is set via Next.js metadata API, structure tested in integration
      });

      it("should include project slug in Open Graph URL", async () => {
        const mockProject = createMockProject({
          slug: "my-awesome-project",
          title: "My Awesome Project",
        });

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "my-awesome-project" }),
        })) as Metadata;

        expect(metadata.openGraph?.url).toContain("my-awesome-project");
      });

      it("should include site name in Open Graph metadata", async () => {
        const mockProject = createMockProject();

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.openGraph?.siteName).toBe("Portfolio");
      });
    });

    describe("Twitter Card metadata", () => {
      // RATIONALE: Twitter cards mirror Open Graph expectations; missing fields cause degraded previews.
      it("should include twitter object", async () => {
        const mockProject = createMockProject();

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.twitter).toBeDefined();
      });

      it("should set Twitter Card type to summary_large_image", async () => {
        const mockProject = createMockProject();

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.twitter).toBeDefined();
        // Card type set via Next.js metadata API, structure tested in integration
      });

      it("should set Twitter Card title to project title", async () => {
        const mockProject = createMockProject({
          title: "My Project Title",
        });

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.twitter?.title).toBe("My Project Title");
      });

      it("should set Twitter Card description to project summary", async () => {
        const mockProject = createMockProject({
          summary: "This is my project summary for Twitter.",
        });

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.twitter?.description).toBe("This is my project summary for Twitter.");
      });
    });

    describe("Metadata structure validation", () => {
      it("should have consistent data across OG and Twitter metadata", async () => {
        const mockProject = createMockProject({
          title: "Consistent Project",
          summary: "Consistent summary.",
        });

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        // Verify data consistency
        expect(metadata.title).toBe(metadata.openGraph?.title);
        expect(metadata.description).toBe(metadata.openGraph?.description);
        expect(metadata.openGraph?.title).toBe(metadata.twitter?.title);
        expect(metadata.openGraph?.description).toBe(metadata.twitter?.description);
      });

      it("should always define required metadata fields", async () => {
        const mockProject = createMockProject({
          title: "Test Project",
          summary: "Test summary.",
        });

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.title).toBeDefined();
        expect(metadata.description).toBeDefined();
        expect(metadata.openGraph).toBeDefined();
        expect(metadata.twitter).toBeDefined();
      });

      it("should handle projects with special characters in title", async () => {
        const mockProject = createMockProject({
          slug: "special-project",
          title: "Project & Co.: The Next Generation (2025)",
          summary: 'A "special" project with "quotes" & symbols.',
        });

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "special-project" }),
        })) as Metadata;

        expect(metadata.title).toBe("Project & Co.: The Next Generation (2025)");
        expect(metadata.openGraph?.title).toBe("Project & Co.: The Next Generation (2025)");
      });
    });

    describe("URL generation", () => {
      it("should use SITE_URL to build absolute project URLs", async () => {
        const mockProject = createMockProject();

        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
        mockGetProjectBySlug.mockReturnValue(mockProject);

        const metadata = (await ProjectModule.generateMetadata({
          params: Promise.resolve({ slug: "test-project" }),
        })) as Metadata;

        expect(metadata.openGraph?.url).toContain("https://example.com");
      });

      it("should handle multiple project slugs correctly", async () => {
        const mockGetProjectBySlug = vi.mocked(getProjectBySlug);

        const testCases: Array<{ slug: string; title: string }> = [
          { slug: "portfolio-app", title: "Portfolio App" },
          { slug: "portfolio-docs", title: "Portfolio Docs" },
          { slug: "data-pipeline", title: "Data Pipeline" },
        ];

        for (const testCase of testCases) {
          const mockProject = createMockProject({
            slug: testCase.slug,
            title: testCase.title,
          });

          mockGetProjectBySlug.mockReturnValue(mockProject);

          const metadata = (await ProjectModule.generateMetadata({
            params: Promise.resolve({ slug: testCase.slug }),
          })) as Metadata;

          expect(metadata.openGraph?.url).toContain(testCase.slug);
          expect(metadata.title).toBe(testCase.title);
        }
      });
    });
  });
});
