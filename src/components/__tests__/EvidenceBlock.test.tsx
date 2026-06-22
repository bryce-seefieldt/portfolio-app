// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/registry";
import { EvidenceBlock } from "../EvidenceBlock";

vi.mock("@/lib/config", () => ({
  docsUrl: (path: string) => `https://docs.example.com${path}`,
}));

const baseProject: Project = {
  slug: "portfolio-app",
  title: "Portfolio App",
  summary: "Summary",
  category: "fullstack",
  tags: ["test"],
  startDate: "2026-01",
  techStack: [],
  keyProofs: [],
  status: "active",
};

// RATIONALE: EvidenceBlock must expose all evidence entry points for reviewers.
describe("EvidenceBlock", () => {
  it("should render evidence links when available", () => {
    render(
      <EvidenceBlock
        project={{
          ...baseProject,
          repoUrl: "https://github.com/example/portfolio-app",
          evidence: {
            dossierPath: "projects/portfolio-app",
            threatModelPath: "security/threat-models/portfolio-app",
            adrIndexPath: "architecture/adr",
            runbooksPath: "operations/runbooks",
          },
        }}
      />,
    );

    expect(screen.getByText("Project Dossier")).toBeInTheDocument();
    expect(screen.getByText("Threat Model")).toBeInTheDocument();
    expect(screen.getByText("Architecture Decisions")).toBeInTheDocument();
    expect(screen.getByText("Operational Runbooks")).toBeInTheDocument();
    expect(screen.getByText("Source Code")).toBeInTheDocument();
    expect(screen.getByText("View Dossier →")).toHaveAttribute(
      "href",
      "https://docs.example.com/docs/projects/portfolio-app",
    );
  });

  it("should render adr and runbook lists when provided", () => {
    render(
      <EvidenceBlock
        project={{
          ...baseProject,
          repoUrl: null,
          evidence: {
            dossierPath: "projects/portfolio-app",
            adr: [{ title: "ADR-0001", url: "docs/architecture/adr/adr-0001" }],
            runbooks: [{ title: "Deploy", url: "docs/operations/runbooks/deploy" }],
            github: "https://github.com/example/portfolio-app",
          },
        }}
      />,
    );

    expect(screen.getByText("ADR-0001 →")).toBeInTheDocument();
    expect(screen.getByText("Deploy →")).toBeInTheDocument();
    expect(screen.getByText("View Repository →")).toHaveAttribute(
      "href",
      "https://github.com/example/portfolio-app",
    );
  });

  it("should show placeholders when evidence is missing", () => {
    render(<EvidenceBlock project={baseProject} />);
    expect(screen.getAllByText("Not available yet").length).toBeGreaterThan(0);
  });
});
