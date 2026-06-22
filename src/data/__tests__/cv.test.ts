import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/config", () => ({
  docsUrl: (path: string) => `https://docs.example.com${path}`,
  githubUrl: (path: string) => `https://github.example.com/${path}`,
}));

import { TIMELINE } from "../cv";

// RATIONALE: CV entries must include evidence links for verification.
describe("cv timeline", () => {
  it("should provide proof links for each entry", () => {
    expect(TIMELINE.length).toBeGreaterThan(0);
    for (const entry of TIMELINE) {
      expect(entry.proofs.length).toBeGreaterThan(0);
      entry.proofs.forEach((proof) => {
        expect(proof.href).toMatch(/^https?:\/\//);
      });
    }
  });
});
