// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const observabilityMocks = vi.hoisted(() => ({
  log: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/observability", () => observabilityMocks);

vi.mock("@/lib/config", () => ({
  DOCS_BASE_URL: "https://docs.example.com",
  docsUrl: (path: string) => `https://docs.example.com/${path}`,
}));

import NotFound from "../not-found";

// RATIONALE: 404 page should guide navigation and log missing routes.
describe("NotFound", () => {
  it("should render navigation links and log", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Home" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Projects" }).length).toBeGreaterThan(0);
    expect(observabilityMocks.log).toHaveBeenCalled();
  });
});
