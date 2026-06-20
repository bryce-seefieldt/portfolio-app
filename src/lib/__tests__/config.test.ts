// src/lib/__tests__/config.test.ts

/*
Unit tests for link construction helpers (docsUrl, githubUrl, docsGithubUrl, mailtoUrl).
RATIONALE: Link helpers enforce evidence-first navigation without hardcoding environment-specific URLs.
FAILURE MODE: Misconstructed links break reviewer paths and evidence discovery.
*/

/* TO DO:
- Review test coverage for all link helper functions, including edge cases (e.g., empty paths, malformed inputs).
- Review and expand test coverage for environment variable parsing and normalization logic in config.ts.
- Review and expand test coverage for SITE_URL, GITHUB_REPO_URL,  siteUrl,   githubRepoUrl,
*/
import { describe, it, expect } from "vitest";
import {
  DOCS_URL,
  GITHUB_URL,
  GITHUB_DOCS_REPO_URL,
  docsUrl,
  githubUrl,
  githubDocsRepoUrl,
  mailtoUrl,
} from "../config";

describe("Link Construction Helpers", () => {
  describe("docsUrl", () => {
    it("should build URL with default base path", () => {
      const result = docsUrl("/portfolio/roadmap");
      expect(result).toBe(`${DOCS_URL}/portfolio/roadmap`);
    });

    it("should strip leading slashes from pathname", () => {
      const result = docsUrl("portfolio/roadmap");
      expect(result).toBe(`${DOCS_URL}/portfolio/roadmap`);
    });

    it("should handle empty pathname", () => {
      const result = docsUrl("");
      expect(result).toBe(DOCS_URL);
    });

    it("should handle nested paths", () => {
      const result = docsUrl("portfolio/features");
      expect(result).toBe(`${DOCS_URL}/portfolio/features`);
    });

    it("should work with single leading slash", () => {
      const result = docsUrl("/portfolio");
      expect(result).toBe(`${DOCS_URL}/portfolio`);
    });

    it("should handle multiple leading slashes", () => {
      const result = docsUrl("///portfolio///test");
      expect(result).toBe(`${DOCS_URL}/portfolio///test`);
    });
  });

  describe("githubUrl", () => {
    it("should return placeholder when GITHUB_URL not configured", () => {
      const result = githubUrl("portfolio-app");
      const base = GITHUB_URL;
      expect(result).toBe(base ? `${base}/portfolio-app` : "#");
    });

    it("should handle empty pathname", () => {
      const result = githubUrl("");
      const base = GITHUB_URL;
      expect(result).toBe(base || "#");
    });

    it("should strip leading slashes from pathname", () => {
      const result = githubUrl("/portfolio-app");
      const base = GITHUB_URL;
      expect(result).toBe(base ? `${base}/portfolio-app` : "#");
    });
  });

  describe("githubDocsRepoUrl", () => {
    it("should return placeholder when DOCS_GITHUB_URL not configured", () => {
      const result = githubDocsRepoUrl("blob/main/docs/portfolio/readme.md");
      const base = GITHUB_DOCS_REPO_URL;
      expect(result).toBe(base ? `${base}/blob/main/docs/portfolio/readme.md` : "#");
    });

    it("should handle empty pathname", () => {
      const result = githubDocsRepoUrl("");
      const base = GITHUB_DOCS_REPO_URL;
      expect(result).toBe(base || "#");
    });

    it("should strip leading slashes from pathname", () => {
      const result = githubDocsRepoUrl("/blob/main/docs/portfolio/readme.md");
      const base = GITHUB_DOCS_REPO_URL;
      expect(result).toBe(base ? `${base}/blob/main/docs/portfolio/readme.md` : "#");
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

    it("should handle subjects with special characters", () => {
      const result = mailtoUrl("test@example.com", "Re: Portfolio + Question?");
      expect(result).toContain("mailto:test@example.com?subject=");
    });
  });
});
