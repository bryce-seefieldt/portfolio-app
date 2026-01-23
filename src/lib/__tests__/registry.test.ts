// src/lib/__tests__/registry.test.ts
//
// Unit tests for registry validation, slug rules, and schema enforcement.

import { describe, it, expect } from "vitest";
import { ProjectSchema, TechStackItemSchema, EvidenceLinksSchema } from "../registry";

describe("Registry Validation", () => {
  describe("ProjectSchema", () => {
    it("should accept valid project entries", () => {
      const validProject = {
        slug: "portfolio-app",
        title: "Portfolio App",
        summary: "A comprehensive portfolio web application demonstrating full-stack capabilities.",
        category: "fullstack",
        tags: ["nextjs", "typescript", "tailwind"],
        startDate: "2025-10",
        endDate: "2026-01",
        isGoldStandard: true,
        techStack: [
          {
            name: "Next.js",
            category: "framework",
            rationale: "Modern React framework with App Router and server components.",
          },
        ],
        keyProofs: ["Live App", "GitHub Repository"],
        repoUrl: "https://github.com/example/portfolio-app",
        demoUrl: "https://example.com",
        status: "active",
      };

      const result = ProjectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    it("should reject projects with invalid slug format", () => {
      const invalidProject = {
        slug: "Invalid Slug!",
        title: "Test Project",
        summary: "A test project with invalid slug.",
        tags: ["test"],
      };

      const result = ProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("slug must be lowercase");
      }
    });

    it("should reject projects with uppercase in slug", () => {
      const invalidProject = {
        slug: "Portfolio-App",
        title: "Portfolio App",
        summary: "A comprehensive portfolio web application.",
        tags: ["nextjs"],
      };

      const result = ProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it("should reject projects with spaces in slug", () => {
      const invalidProject = {
        slug: "portfolio app",
        title: "Portfolio App",
        summary: "A comprehensive portfolio web application.",
        tags: ["nextjs"],
      };

      const result = ProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it("should reject projects with special characters in slug", () => {
      const invalidProject = {
        slug: "portfolio-app_v2",
        title: "Portfolio App",
        summary: "A comprehensive portfolio web application.",
        tags: ["nextjs"],
      };

      const result = ProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it("should reject projects missing required fields", () => {
      const incompleteProject = {
        slug: "test-project",
        // Missing title, summary, tags
      };

      const result = ProjectSchema.safeParse(incompleteProject);
      expect(result.success).toBe(false);
    });

    it("should reject projects with empty tags array", () => {
      const invalidProject = {
        slug: "test-project",
        title: "Test Project",
        summary: "A test project description.",
        tags: [],
      };

      const result = ProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it("should reject projects with empty tech stack", () => {
      const invalidProject = {
        slug: "test-project",
        title: "Test Project",
        summary: "A test project description.",
        tags: ["test"],
        techStack: [],
      };

      const result = ProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it("should reject projects with empty keyProofs array", () => {
      const invalidProject = {
        slug: "test-project",
        title: "Test Project",
        summary: "A test project description.",
        tags: ["test"],
        keyProofs: [],
      };

      const result = ProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it("should enforce startDate format YYYY-MM", () => {
      const invalidProject = {
        slug: "test-project",
        title: "Test Project",
        summary: "A test project description.",
        tags: ["test"],
        startDate: "2025/01",
      };

      const result = ProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it("should accept valid startDate format", () => {
      const validProject = {
        slug: "test-project",
        title: "Test Project",
        summary: "A test project description with sufficient length.",
        tags: ["test"],
        startDate: "2025-01",
      };

      const result = ProjectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });
  });

  describe("TechStackItemSchema", () => {
    it("should accept valid tech stack items", () => {
      const validItem = {
        name: "Next.js",
        category: "framework",
        rationale: "Modern React framework with App Router.",
      };

      const result = TechStackItemSchema.safeParse(validItem);
      expect(result.success).toBe(true);
    });

    it("should reject tech stack items with invalid category", () => {
      const invalidItem = {
        name: "Next.js",
        category: "invalid-category",
      };

      const result = TechStackItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it("should require tech stack item name", () => {
      const invalidItem = {
        category: "framework",
      };

      const result = TechStackItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });
  });

  describe("EvidenceLinksSchema", () => {
    it("should accept valid evidence links", () => {
      const validEvidence = {
        dossierPath: "/docs/projects/portfolio-app",
        threatModelPath: "/docs/security/threat-models/portfolio-app",
        adrIndexPath: "/docs/architecture/adr",
        runbooksPath: "/docs/operations/runbooks",
        adr: [
          {
            title: "ADR-0001",
            url: "https://example.com/adr-0001",
          },
        ],
        runbooks: [
          {
            title: "Deploy Runbook",
            url: "https://example.com/deploy",
          },
        ],
        github: "https://github.com/example/repo",
      };

      const result = EvidenceLinksSchema.safeParse(validEvidence);
      expect(result.success).toBe(true);
    });

    it("should accept partial evidence links", () => {
      const partialEvidence = {
        dossierPath: "/docs/projects/portfolio-app",
      };

      const result = EvidenceLinksSchema.safeParse(partialEvidence);
      expect(result.success).toBe(true);
    });

    it("should reject invalid github URL", () => {
      const invalidEvidence = {
        github: "not-a-valid-url",
      };

      const result = EvidenceLinksSchema.safeParse(invalidEvidence);
      expect(result.success).toBe(false);
    });
  });
});
