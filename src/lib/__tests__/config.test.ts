// src/lib/__tests__/config.test.ts
//
// Unit tests for link construction helpers (docsUrl, githubUrl, docsGithubUrl, mailtoUrl).

import { describe, it, expect } from "vitest";
import {
  DOCS_BASE_URL,
  GITHUB_URL,
  DOCS_GITHUB_URL,
  docsUrl,
  githubUrl,
  docsGithubUrl,
  mailtoUrl,
} from "../config";

describe("Link Construction Helpers", () => {
  describe("docsUrl", () => {
    it("should build URL with default base path", () => {
      const result = docsUrl("/portfolio/roadmap");
      expect(result).toBe(`${DOCS_BASE_URL}/portfolio/roadmap`);
    });

    it("should strip leading slashes from pathname", () => {
      const result = docsUrl("portfolio/roadmap");
      expect(result).toBe(`${DOCS_BASE_URL}/portfolio/roadmap`);
    });

    it("should handle empty pathname", () => {
      const result = docsUrl("");
      expect(result).toBe(DOCS_BASE_URL);
    });

    it("should handle nested paths", () => {
      const result = docsUrl("portfolio/roadmap/issues/stage-3-1");
      expect(result).toBe(`${DOCS_BASE_URL}/portfolio/roadmap/issues/stage-3-1`);
    });

    it("should work with single leading slash", () => {
      const result = docsUrl("/portfolio");
      expect(result).toBe(`${DOCS_BASE_URL}/portfolio`);
    });

    it("should handle multiple leading slashes", () => {
      const result = docsUrl("///portfolio///test");
      expect(result).toBe(`${DOCS_BASE_URL}/portfolio///test`);
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

  describe("docsGithubUrl", () => {
    it("should return placeholder when DOCS_GITHUB_URL not configured", () => {
      const result = docsGithubUrl("blob/main/docs/portfolio/readme.md");
      const base = DOCS_GITHUB_URL;
      expect(result).toBe(base ? `${base}/blob/main/docs/portfolio/readme.md` : "#");
    });

    it("should handle empty pathname", () => {
      const result = docsGithubUrl("");
      const base = DOCS_GITHUB_URL;
      expect(result).toBe(base || "#");
    });

    it("should strip leading slashes from pathname", () => {
      const result = docsGithubUrl("/blob/main/docs/portfolio/readme.md");
      const base = DOCS_GITHUB_URL;
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
