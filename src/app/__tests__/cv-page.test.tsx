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
  GITHUB_BASE_URL: string | null;
  LINKEDIN_URL: string | null;
} = {
  GITHUB_BASE_URL: "https://github.com/example-base",
  LINKEDIN_URL: "https://linkedin.example.com",
};

vi.mock("@/lib/config", () => ({
  get GITHUB_BASE_URL() {
    return configValues.GITHUB_BASE_URL;
  },
  get LINKEDIN_URL() {
    return configValues.LINKEDIN_URL;
  },
}));

import CVPage from "../cv/page";

// RATIONALE: CV page should remain a traditional, scannable resume.
describe("CVPage", () => {
  it("should render the traditional CV structure and key content", () => {
    configValues.GITHUB_BASE_URL = "https://github.com/example-base";
    configValues.LINKEDIN_URL = "https://linkedin.example.com";

    render(<CVPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Bryce Seefieldt" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Summary" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Education" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Technical Skills" })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 3, name: "IT Services Specialist" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /moving 50 multifunction printers across 10 buildings to serve 2,500\+ users/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/eliminated a \$10,000-per-year licensing cost/i)).toBeInTheDocument();
    expect(screen.getByText(/documented 150\+ services in the CMDB/i)).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 3, name: "Publishing Administrator" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Founder and Principal Consultant" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Honours Bachelor of Technology in Software Development",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Foundations of Project Management" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Music Production and Engineering" }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Languages:/i)).toBeInTheDocument();
    expect(screen.getByText(/Cloud & DevOps:/i)).toBeInTheDocument();
    expect(screen.getByText(/Design & UX:/i)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Download PDF resume" })).toHaveAttribute(
      "href",
      "/bryce-seefieldt-cv.pdf",
    );
    expect(screen.getByRole("link", { name: "projects" })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "engineering docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("link", { name: "get in touch" })).toHaveAttribute("href", "/contact");

    expect(screen.queryByText("CIO / IT Executive + Full-Stack Developer")).toBeNull();
    expect(screen.queryByText("Suggested reviewer path")).toBeNull();
    expect(screen.queryByText("Evidence Hubs")).toBeNull();
    expect(screen.queryByText("Proofs & Evidence")).toBeNull();

    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
  });

  it("should omit optional profile links when missing", () => {
    configValues.GITHUB_BASE_URL = null;
    configValues.LINKEDIN_URL = null;

    render(<CVPage />);

    expect(screen.queryByText("GitHub")).toBeNull();
    expect(screen.queryByText("LinkedIn")).toBeNull();
  });
});
