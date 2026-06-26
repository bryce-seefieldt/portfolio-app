// @vitest-environment jsdom

import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NavigationEnhanced } from "../NavigationEnhanced";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("../ThemeToggle", () => ({
  ThemeToggle: () => (
    <button type="button" aria-label="Toggle light/dark theme">
      Theme Toggle
    </button>
  ),
}));

const configValues: {
  DOCS_BASE_URL: string;
  GITHUB_BASE_URL: string | null;
  GITHUB_URL: string | null;
} = {
  DOCS_BASE_URL: "https://docs.example.com",
  GITHUB_BASE_URL: "https://github.com/example-base",
  GITHUB_URL: "https://github.com/example",
};

vi.mock("@/lib/config", () => ({
  get DOCS_BASE_URL() {
    return configValues.DOCS_BASE_URL;
  },
  get GITHUB_BASE_URL() {
    return configValues.GITHUB_BASE_URL;
  },
  get GITHUB_URL() {
    return configValues.GITHUB_URL;
  },
}));

// RATIONALE: Navigation provides primary reviewer routes and must be accessible.
describe("NavigationEnhanced", () => {
  it("should render primary links", () => {
    configValues.GITHUB_URL = "https://github.com/example";
    configValues.GITHUB_BASE_URL = "https://github.com/example-base";

    render(<NavigationEnhanced />);

    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("CV")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("should add shadow on scroll", () => {
    render(<NavigationEnhanced />);

    const header = document.querySelector("header");
    expect(header).not.toBeNull();
    expect(header).not.toHaveClass("shadow-[0_10px_22px_rgba(0,0,0,0.28)]");

    Object.defineProperty(window, "scrollY", { value: 20, writable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    return waitFor(() => {
      expect(header).toHaveClass("shadow-[0_10px_22px_rgba(0,0,0,0.28)]");
    });
  });

  it("should render the theme toggle inline without a menu button", () => {
    render(<NavigationEnhanced />);

    expect(screen.getByRole("button", { name: "Toggle light/dark theme" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open menu" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Close menu" })).toBeNull();
  });

  it("should fall back to the base GitHub URL when profile URL is missing", () => {
    configValues.GITHUB_URL = null;
    configValues.GITHUB_BASE_URL = "https://github.com/example-base";

    render(<NavigationEnhanced />);

    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/example-base",
    );
  });
});
