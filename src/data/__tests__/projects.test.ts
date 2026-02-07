import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/registry", () => ({
  getAllProjects: () => [{ slug: "portfolio-app" }],
  getProjectBySlug: (slug: string) => (slug === "portfolio-app" ? { slug } : undefined),
  getFeaturedProjects: () => [{ slug: "featured" }],
}));

import { PROJECTS, getProjectBySlug, getFeaturedProjects } from "../projects";

// RATIONALE: Data wrappers must surface registry helpers unchanged.
describe("projects data wrapper", () => {
  it("should expose PROJECTS from registry", () => {
    expect(PROJECTS).toEqual([{ slug: "portfolio-app" }]);
  });

  it("should proxy getProjectBySlug", () => {
    expect(getProjectBySlug("portfolio-app")).toEqual({ slug: "portfolio-app" });
    expect(getProjectBySlug("missing")).toBeUndefined();
  });

  it("should proxy getFeaturedProjects", () => {
    expect(getFeaturedProjects()).toEqual([{ slug: "featured" }]);
  });
});
