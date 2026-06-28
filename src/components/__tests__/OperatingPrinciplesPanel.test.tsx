// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { OperatingPrinciplesPanel } from "@/components/home/OperatingPrinciplesPanel";

describe("OperatingPrinciplesPanel", () => {
  it("renders with the first principle selected by default", () => {
    render(<OperatingPrinciplesPanel />);

    const firstTile = screen.getByRole("radio", { name: "FIND THE BREAK" });
    expect(firstTile).toHaveAttribute("aria-checked", "true");

    expect(
      screen.getByText(/I find the broken process before I write the code\./i),
    ).toBeInTheDocument();
  });

  it("supports arrow-key navigation with radio semantics", async () => {
    const user = userEvent.setup();
    render(<OperatingPrinciplesPanel />);

    const firstTile = screen.getByRole("radio", { name: "FIND THE BREAK" });
    await user.click(firstTile);
    await user.keyboard("{ArrowRight}");

    const secondTile = screen.getByRole("radio", { name: "TRANSLATE" });
    expect(secondTile).toHaveAttribute("aria-checked", "true");

    expect(screen.getByText(/I translate between the boardroom and the terminal\./i)).toBeVisible();
  });
});
