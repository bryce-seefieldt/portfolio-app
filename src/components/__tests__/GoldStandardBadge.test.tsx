// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GoldStandardBadge } from "../GoldStandardBadge";

// RATIONALE: Gold standard badge communicates portfolio quality at a glance.
describe("GoldStandardBadge", () => {
  it("should render label", () => {
    render(<GoldStandardBadge />);
    expect(screen.getByText("Gold Standard Exemplar")).toBeInTheDocument();
  });
});
