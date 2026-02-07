// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/registry";
import { BadgeGroup } from "../BadgeGroup";

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

// RATIONALE: BadgeGroup encodes evidence completeness at a glance.
describe("BadgeGroup", () => {
  it("should render nothing when no evidence", () => {
    const { container } = render(<BadgeGroup project={baseProject} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render badges for evidence", () => {
    render(
      <BadgeGroup
        project={{
          ...baseProject,
          isGoldStandard: true,
          evidence: {
            dossierPath: "projects/portfolio-app",
            threatModelPath: "security/threat-models/portfolio-app",
            adr: [{ title: "ADR-0001", url: "architecture/adr/adr-0001" }],
          },
        }}
      />,
    );

    expect(screen.getByText("Gold Standard")).toBeInTheDocument();
    expect(screen.getByText("Docs Available")).toBeInTheDocument();
    expect(screen.getByText("Threat Model")).toBeInTheDocument();
    expect(screen.getByText("ADR Complete")).toBeInTheDocument();
  });
});
