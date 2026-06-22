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

const configValues: {
  DOCS_BASE_URL: string;
  GITHUB_URL: string | null;
  LINKEDIN_URL: string | null;
} = {
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
  docsUrl: (path: string) => `https://docs.example.com/${path}`,
}));

import HomePage from "../page";

// RATIONALE: Home page must expose primary reviewer CTAs.
describe("HomePage", () => {
  it("should render primary CTAs", () => {
    configValues.GITHUB_URL = "https://github.com/example";
    configValues.LINKEDIN_URL = "https://linkedin.example.com";

    render(<HomePage />);

    expect(screen.getByRole("link", { name: "See the work" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read the CV" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Review the Portfolio Engineering Docs" }),
    ).toBeInTheDocument();
  });

  it("should keep the LinkedIn link out of the page body", () => {
    configValues.GITHUB_URL = null;
    configValues.LINKEDIN_URL = null;

    render(<HomePage />);

    expect(screen.queryByText("LinkedIn")).toBeNull();
  });
});
