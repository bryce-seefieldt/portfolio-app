// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BackToTop } from "../BackToTop";

const observeMock = vi.fn();

class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe = observeMock;
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
  }
}

// RATIONALE: BackToTop must surface when scrolling and respect reduced motion.
describe("BackToTop", () => {
  it("should reveal button when sentinel leaves view", async () => {
    let instance: MockIntersectionObserver | null = null;
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback: IntersectionObserverCallback) => {
        instance = new MockIntersectionObserver(callback);
        return instance;
      }),
    );
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
    window.scrollTo = vi.fn();

    render(<BackToTop />);

    await act(async () => {
      instance?.trigger(false);
    });

    const button = screen.getByRole("button", { name: "Scroll back to top" });
    await waitFor(() => {
      expect(button.className).toContain("opacity-100");
    });

    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("should use instant scroll when reduced motion is preferred", async () => {
    let instance: MockIntersectionObserver | null = null;
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback: IntersectionObserverCallback) => {
        instance = new MockIntersectionObserver(callback);
        return instance;
      }),
    );
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );
    window.scrollTo = vi.fn();

    render(<BackToTop />);

    await act(async () => {
      instance?.trigger(false);
    });

    const button = screen.getByRole("button", { name: "Scroll back to top" });
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
