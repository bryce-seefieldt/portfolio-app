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

const navigationMocks = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error("notFound");
  }),
}));

vi.mock("next/navigation", () => navigationMocks);

vi.mock("@/lib/config", () => ({
  docsUrl: (path: string) => `https://docs.example.com${path}`,
  githubUrl: (path: string) => `https://github.com/example/${path}`,
  SITE_URL: "https://example.com",
}));

vi.mock("@/data/projects", () => ({
  PROJECTS: [
    {
      slug: "portfolio-app",
      title: "Portfolio App",
      summary: "Summary",
    },
    {
      slug: "other-project",
      title: "Other Project",
      summary: "Other summary",
    },
    {
      slug: "demo-project",
      title: "Demo Project",
      summary: "Demo summary",
    },
  ],
  getProjectBySlug: (slug: string) =>
    slug === "portfolio-app"
      ? {
          slug: "portfolio-app",
          title: "Portfolio App",
          summary: "Summary",
          category: "fullstack",
          tags: ["test"],
          startDate: "2026-01",
          techStack: [],
          keyProofs: [],
          status: "active",
          repoUrl: "https://github.com/example/portfolio-app",
          evidence: {
            dossierPath: "projects/portfolio-app",
          },
        }
      : slug === "other-project"
        ? {
            slug: "other-project",
            title: "Other Project",
            summary: "Other summary",
            category: "backend",
            tags: ["test"],
            startDate: "2026-01",
            techStack: [],
            keyProofs: [],
            status: "active",
            evidence: {
              dossierPath: "projects/other-project",
            },
          }
        : slug === "demo-project"
          ? {
              slug: "demo-project",
              title: "Demo Project",
              summary: "Demo summary",
              category: "frontend",
              tags: ["test"],
              startDate: "2026-01",
              techStack: [],
              keyProofs: [],
              status: "active",
              demoUrl: "https://example.com/demo",
              evidence: {
                dossierPath: "projects/demo-project",
              },
            }
          : undefined,
}));

import ProjectDetailPage from "../projects/[slug]/page";
import { generateStaticParams } from "../projects/[slug]/page";

// RATIONALE: Project detail pages must render evidence blocks for valid slugs.
describe("ProjectDetailPage", () => {
  it("should render project details when slug exists", async () => {
    const node = await ProjectDetailPage({
      params: Promise.resolve({ slug: "portfolio-app" }),
    });

    render(node as React.ReactElement);

    expect(screen.getByRole("heading", { name: "Portfolio App" })).toBeInTheDocument();
    expect(screen.getByText("Evidence Artifacts")).toBeInTheDocument();
  });

  it("should call notFound when slug is missing", async () => {
    await expect(
      ProjectDetailPage({ params: Promise.resolve({ slug: "missing" }) }),
    ).rejects.toThrow("notFound");

    expect(navigationMocks.notFound).toHaveBeenCalled();
  });

  it("should render non-gold-standard layout for other projects", async () => {
    const node = await ProjectDetailPage({
      params: Promise.resolve({ slug: "other-project" }),
    });

    render(node as React.ReactElement);

    expect(screen.getByText("What this project proves")).toBeInTheDocument();
    expect(screen.getByText("Technical summary (first-pass)")).toBeInTheDocument();
  });

  it("should render demo link when available", async () => {
    const node = await ProjectDetailPage({
      params: Promise.resolve({ slug: "demo-project" }),
    });

    render(node as React.ReactElement);

    expect(screen.getByText("Demo")).toBeInTheDocument();
    expect(screen.getByText("Repo: (add when ready)")).toBeInTheDocument();
  });

  it("should generate static params for project slugs", async () => {
    const params = await generateStaticParams();
    const slugs = params.map((entry) => entry.slug);

    expect(slugs).toContain("portfolio-app");
    expect(slugs).toContain("other-project");
  });
});
