// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const observabilityMocks = vi.hoisted(() => ({
  logError: vi.fn(),
}));

vi.mock("@/lib/observability", () => observabilityMocks);

import ErrorPage from "../error";

// RATIONALE: Error boundary must surface user-friendly UI and log errors.
describe("Error page", () => {
  it("should log error and call reset", () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("boom")} reset={reset} />);

    expect(observabilityMocks.logError).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalled();
  });
});
