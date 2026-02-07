// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "../ThemeToggle";

// RATIONALE: Theme toggling must persist preference and update document class.
describe("ThemeToggle", () => {
  it("should toggle theme and persist to localStorage", async () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Switch to/ })).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("should initialize from saved light theme", async () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    localStorage.setItem("theme", "light");

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Switch to/ })).toBeInTheDocument();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should toggle from dark to light", async () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
    localStorage.setItem("theme", "dark");

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Switch to/ })).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
