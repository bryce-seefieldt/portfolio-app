// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerificationBadge } from "../VerificationBadge";

// RATIONALE: Badge labels are user-facing evidence indicators.
describe("VerificationBadge", () => {
  it("should render docs available badge", () => {
    render(<VerificationBadge type="docs-available" />);
    expect(screen.getByText("Docs Available")).toBeInTheDocument();
  });

  it("should render threat model badge", () => {
    render(<VerificationBadge type="threat-model" />);
    expect(screen.getByText("Threat Model")).toBeInTheDocument();
  });

  it("should render gold standard badge", () => {
    render(<VerificationBadge type="gold-standard" />);
    expect(screen.getByText("Gold Standard")).toBeInTheDocument();
  });

  it("should render adr complete badge", () => {
    render(<VerificationBadge type="adr-complete" />);
    expect(screen.getByText("ADR Complete")).toBeInTheDocument();
  });
});
