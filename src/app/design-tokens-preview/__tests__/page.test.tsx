// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import DesignTokensPreviewPage from "../page";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? false : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("DesignTokensPreviewPage", () => {
  it("renders canonical inventory sections", () => {
    render(<DesignTokensPreviewPage />);

    expect(screen.getByText("MODULE 00 / PALETTE")).toBeInTheDocument();
    expect(screen.getByText("MODULE 01 / TYPE")).toBeInTheDocument();
    expect(screen.getByText("MODULE 02 / PANELS")).toBeInTheDocument();
    expect(screen.getByText("MODULE 03 / CONTROLS")).toBeInTheDocument();
    expect(screen.getByText("MODULE 04 / INSTRUMENTS")).toBeInTheDocument();
    expect(screen.getByText("MODULE 05 / KEYCAP + KEYPAD VISUAL TREATMENT")).toBeInTheDocument();
    expect(screen.getByText("MODULE 06 / COMPOSITES")).toBeInTheDocument();
  });

  it("renders real mini-keyboard module", () => {
    render(<DesignTokensPreviewPage />);

    expect(screen.getByText("Real mini-keyboard example")).toBeInTheDocument();
    expect(screen.getByText("MINI KEYBOARD / DEPTH REBUILD")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SPACE" })).toBeInTheDocument();
  });
});
