// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Callout } from "../Callout";

// RATIONALE: Callout styling conveys emphasis in reviewer guidance.
describe("Callout", () => {
  it("should render default variant", () => {
    render(<Callout>Default</Callout>);
    expect(screen.getByText("Default")).toBeInTheDocument();
  });

  it("should render info variant", () => {
    render(<Callout type="info">Info</Callout>);
    expect(screen.getByText("Info")).toBeInTheDocument();
  });
});
