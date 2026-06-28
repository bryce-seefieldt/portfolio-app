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
  it("renders canonical catalog governance note", () => {
    render(<DesignTokensPreviewPage />);

    expect(
      screen.getByText(/canonical component gallery: every reusable design-system component/i),
    ).toBeInTheDocument();
  });

  it("renders required component inventory sections", () => {
    render(<DesignTokensPreviewPage />);

    expect(screen.getByText("MODULE 02 / PANELS")).toBeInTheDocument();
    expect(screen.getByText("MODULE 03 / CONTROLS")).toBeInTheDocument();
    expect(screen.getByText("MODULE 04 / INSTRUMENTS")).toBeInTheDocument();
    expect(screen.getByText("MODULE 05 / KEYS")).toBeInTheDocument();
    expect(screen.getByText("MODULE 06 / COMPOSITES")).toBeInTheDocument();

    expect(screen.getByText("Dial values")).toBeInTheDocument();
    expect(screen.getByText("ControlButton variants + states")).toBeInTheDocument();
    expect(screen.getByText("Deploy pipeline")).toBeInTheDocument();
    expect(screen.getByText("Representative mixed-color keypad")).toBeInTheDocument();
  });
});
