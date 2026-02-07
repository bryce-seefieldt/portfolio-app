// @vitest-environment jsdom

import { act, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ScrollFadeIn } from "../ScrollFadeIn";

const observeMock = vi.fn();
const unobserveMock = vi.fn();

class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe = observeMock;
  unobserve = unobserveMock;
  disconnect = vi.fn();
  takeRecords = vi.fn();

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
  }
}

// RATIONALE: ScrollFadeIn should apply visible class when intersecting.
describe("ScrollFadeIn", () => {
  it("should mark as visible when intersection occurs", async () => {
    let instance: MockIntersectionObserver | null = null;
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback: IntersectionObserverCallback) => {
        instance = new MockIntersectionObserver(callback);
        return instance;
      }),
    );
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));

    const { container } = render(
      <ScrollFadeIn>
        <div>Content</div>
      </ScrollFadeIn>,
    );

    await act(async () => {
      instance?.trigger(true);
    });

    await waitFor(() => {
      expect(container.firstChild).toHaveClass("is-visible");
    });
  });

  it("should render visible immediately for reduced motion", () => {
    const observerSpy = vi.fn();
    vi.stubGlobal("IntersectionObserver", observerSpy);
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));

    const { container } = render(
      <ScrollFadeIn>
        <div>Content</div>
      </ScrollFadeIn>,
    );

    expect(container.firstChild).toHaveClass("is-visible");
    expect(observerSpy).not.toHaveBeenCalled();
  });
});
