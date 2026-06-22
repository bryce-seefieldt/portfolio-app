// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "../Section";

// RATIONALE: Section titles/subtitles anchor page scanning and must render consistently.
describe("Section", () => {
  it("should render title, subtitle, and children", () => {
    render(
      <Section title="Title" subtitle="Subtitle">
        <div>Body</div>
      </Section>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });
});
