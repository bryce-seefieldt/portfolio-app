// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ByTheNumbersCluster } from "@/components/home/ByTheNumbersCluster";

describe("ByTheNumbersCluster", () => {
  it("shows readout values once for seven/nixie instruments", () => {
    render(<ByTheNumbersCluster />);

    expect(screen.getAllByText("2,500+")).toHaveLength(1);
    expect(screen.getAllByText("1,000,000+")).toHaveLength(1);
  });

  it("renders data-driven gauge and bar styles", () => {
    const { container } = render(<ByTheNumbersCluster />);

    const gaugeNeedles = container.querySelectorAll(".instrument-gauge__needle");
    expect(gaugeNeedles.length).toBeGreaterThan(0);
    expect(gaugeNeedles[0]).toHaveStyle({ "--needle-angle": "0.0deg" });

    const barFill = container.querySelector(".instrument-bar__fill");
    expect(barFill).toHaveStyle({ width: "80%" });
  });

  it("uses glyph instruments for non-quantifiable awards", () => {
    const { container } = render(<ByTheNumbersCluster />);

    const glyphs = container.querySelectorAll(".instrument-glyph");
    expect(glyphs.length).toBeGreaterThanOrEqual(3);
  });
});
