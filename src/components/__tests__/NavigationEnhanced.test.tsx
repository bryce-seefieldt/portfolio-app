// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  ThemeToggle: () => <div>Theme Toggle</div>,
}));

const configValues = {
  DOCS_BASE_URL: "https://docs.example.com",
  GITHUB_URL: "https://github.com/example",
};

vi.mock("@/lib/config", () => ({
  get DOCS_BASE_URL() {
    return configValues.DOCS_BASE_URL;
  },
  get GITHUB_URL() {
    return configValues.GITHUB_URL;
  },
}));

// RATIONALE: Navigation provides primary reviewer routes and must be accessible.
describe("NavigationEnhanced", () => {
  it("should render primary links", () => {
    configValues.GITHUB_URL = "https://github.com/example";

    render(<NavigationEnhanced />);

    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getByText("CV")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Evidence (Docs)")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("should toggle mobile menu", () => {
    render(<NavigationEnhanced />);

    const button = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  });

  it("should add shadow on scroll", () => {
    render(<NavigationEnhanced />);

    const header = document.querySelector("header");
    expect(header).not.toBeNull();
    expect(header).not.toHaveClass("shadow-md");

    Object.defineProperty(window, "scrollY", { value: 20, writable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    return waitFor(() => {
      expect(header).toHaveClass("shadow-md");
    });
  });

  it("should close mobile menu on escape", () => {
    render(<NavigationEnhanced />);

    const button = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(button);

    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("should omit GitHub link when not configured", () => {
    configValues.GITHUB_URL = null;

    render(<NavigationEnhanced />);

    expect(screen.queryByText("GitHub")).toBeNull();
  });
});
