// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

async function loadPage(options: {
  featured: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
}) {
  vi.resetModules();
  vi.doMock("@/lib/config", () => ({
    DOCS_BASE_URL: "https://docs.example.com",
  }));
  vi.doMock("@/data/projects", () => ({
    getFeaturedProjects: () => options.featured,
    PROJECTS: options.projects,
  }));
  const pageModule = await import("../projects/page");
  return pageModule.default;
}

// RATIONALE: Projects page must show featured and full registry lists.
describe("ProjectsPage", () => {
  it("should render featured and all projects", async () => {
    const ProjectsPage = await loadPage({
      featured: [
        {
          slug: "portfolio-app",
          title: "Portfolio App",
          summary: "Summary",
          status: "featured",
          tags: ["nextjs"],
          repoUrl: "https://github.com/example/portfolio-app",
          demoUrl: "https://example.com/demo",
        },
      ],
      projects: [
        {
          slug: "portfolio-app",
          title: "Portfolio App",
          summary: "Summary",
          status: "featured",
          tags: ["nextjs"],
          repoUrl: "https://github.com/example/portfolio-app",
        },
      ],
    });

    render(<ProjectsPage />);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getAllByText("Portfolio App").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Featured").length).toBeGreaterThan(0);
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  it("should omit tags and repo link when missing", async () => {
    const ProjectsPage = await loadPage({
      featured: [
        {
          slug: "minimal",
          title: "Minimal",
          summary: "Summary",
          status: "planned",
          tags: [],
        },
      ],
      projects: [
        {
          slug: "minimal",
          title: "Minimal",
          summary: "Summary",
          status: "planned",
          tags: [],
        },
      ],
    });

    render(<ProjectsPage />);

    expect(screen.queryByText("Repo")).toBeNull();
  });
});
