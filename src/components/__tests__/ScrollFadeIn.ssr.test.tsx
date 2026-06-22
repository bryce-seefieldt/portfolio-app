import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { ScrollFadeIn } from "../ScrollFadeIn";

// RATIONALE: Server rendering must tolerate missing window and default to hidden.
describe("ScrollFadeIn SSR", () => {
  it("should render without window and remain hidden", () => {
    const html = renderToString(
      <ScrollFadeIn>
        <div>Content</div>
      </ScrollFadeIn>,
    );

    expect(html).toContain("fade-in-on-scroll");
    expect(html).not.toContain("is-visible");
  });
});
