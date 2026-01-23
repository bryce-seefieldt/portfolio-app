// src/lib/__tests__/linkConstruction.test.ts
//
// Unit tests for link construction helpers (docsUrl, githubUrl, docsGithubUrl, mailtoUrl).

import { describe, it, expect } from "vitest";
import { docsUrl, githubUrl, docsGithubUrl, mailtoUrl } from "../config";

describe("Link Construction Helpers", () => {
  describe("docsUrl", () => {
    it("should build URL with default base path", () => {
      // Default: NEXT_PUBLIC_DOCS_BASE_URL not set = "/docs"
      const result = docsUrl("/portfolio/roadmap");
      expect(result).toBe("/docs/portfolio/roadmap");
    });

    it("should strip leading slashes from pathname", () => {
      const result = docsUrl("portfolio/roadmap");
      expect(result).toBe("/docs/portfolio/roadmap");
    });

    it("should handle empty pathname", () => {
      const result = docsUrl("");
      expect(result).toBe("/docs");
    });

    it("should handle nested paths", () => {
      const result = docsUrl("portfolio/roadmap/issues/stage-3-1");
      expect(result).toBe("/docs/portfolio/roadmap/issues/stage-3-1");
    });

    it("should work with leading slash", () => {
      const result = docsUrl("/docs/portfolio/roadmap");
      expect(result).toBe("/docs/docs/portfolio/roadmap");
    });
  });

  describe("githubUrl", () => {
    it("should return placeholder when GITHUB_URL not configured", () => {
      const result = githubUrl("portfolio-app");
      // When NEXT_PUBLIC_GITHUB_URL not configured, returns "#"
      expect(result).toBe("#");
    });

    it("should handle empty pathname", () => {
      const result = githubUrl("");
      expect(result).toBe("#");
    });

    it("should strip leading slashes from pathname", () => {
      const result = githubUrl("/portfolio-app");
      expect(result).toBe("#");
    });
  });

  describe("docsGithubUrl", () => {
    it("should return placeholder when DOCS_GITHUB_URL not configured", () => {
      const result = docsGithubUrl("blob/main/docs/portfolio/readme.md");
      // When NEXT_PUBLIC_DOCS_GITHUB_URL not configured, returns "#"
      expect(result).toBe("#");
    });

    it("should handle empty pathname", () => {
      const result = docsGithubUrl("");
      expect(result).toBe("#");
    });

    it("should strip leading slashes from pathname", () => {
      const result = docsGithubUrl("/blob/main/docs/portfolio/readme.md");
      expect(result).toBe("#");
    });
  });

  describe("mailtoUrl", () => {
    it("should build mailto URL", () => {
      const result = mailtoUrl("test@example.com");
      expect(result).toBe("mailto:test@example.com");
    });

    it("should add subject parameter when provided", () => {
      const result = mailtoUrl("test@example.com", "Hello World");
      expect(result).toBe("mailto:test@example.com?subject=Hello%20World");
    });

    it("should encode special characters in subject", () => {
      const result = mailtoUrl("test@example.com", "Question & Answer");
      expect(result).toContain("mailto:test@example.com");
      expect(result).toContain("subject=");
      expect(result).toContain("%26"); // & encoded
    });

    it("should handle email addresses with plus addressing", () => {
      const result = mailtoUrl("test+tag@example.com");
      expect(result).toBe("mailto:test+tag@example.com");
    });

    it("should handle email addresses with dots", () => {
      const result = mailtoUrl("first.last@example.com");
      expect(result).toBe("mailto:first.last@example.com");
    });
  });
});
