// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeToggle } from "../ThemeToggle";

// RATIONALE: Theme toggling must persist preference and update document class.
describe("ThemeToggle", () => {
  it("should toggle theme and persist to localStorage", async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Toggle light and dark theme/ }),
      ).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("should initialize from saved light theme", async () => {
    localStorage.setItem("theme", "light");

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Toggle light and dark theme/ }),
      ).toBeInTheDocument();
    });

    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("should toggle from dark to light", async () => {
    localStorage.setItem("theme", "dark");

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Toggle light and dark theme/ }),
      ).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
