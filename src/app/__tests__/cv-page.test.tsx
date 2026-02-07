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

const configValues = {
  DOCS_BASE_URL: "https://docs.example.com",
  GITHUB_URL: "https://github.com/example",
  LINKEDIN_URL: "https://linkedin.example.com",
};

vi.mock("@/lib/config", () => ({
  get DOCS_BASE_URL() {
    return configValues.DOCS_BASE_URL;
  },
  get GITHUB_URL() {
    return configValues.GITHUB_URL;
  },
  get LINKEDIN_URL() {
    return configValues.LINKEDIN_URL;
  },
  docsUrl: (path: string) => `https://docs.example.com${path}`,
}));

vi.mock("@/data/cv", () => ({
  TIMELINE: [
    {
      title: "Role",
      organization: "Org",
      period: "2026",
      description: "Desc",
      keyCapabilities: ["Capability"],
      proofs: [{ text: "Proof", href: "https://docs.example.com/docs/projects/portfolio-app" }],
    },
  ],
}));

import CVPage from "../cv/page";

// RATIONALE: CV page must render evidence-first timeline entries.
describe("CVPage", () => {
  it("should render timeline entries and proofs", () => {
    configValues.GITHUB_URL = "https://github.com/example";
    configValues.LINKEDIN_URL = "https://linkedin.example.com";

    render(<CVPage />);

    expect(screen.getByText("Experience & Capabilities")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Proof")).toHaveAttribute(
      "href",
      "https://docs.example.com/docs/projects/portfolio-app",
    );
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
  });

  it("should omit optional profile links when missing", () => {
    configValues.GITHUB_URL = null;
    configValues.LINKEDIN_URL = null;

    render(<CVPage />);

    expect(screen.queryByText("GitHub")).toBeNull();
    expect(screen.queryByText("LinkedIn")).toBeNull();
  });
});
