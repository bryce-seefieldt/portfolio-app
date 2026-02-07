import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/security/ratelimit", () => ({
  rateLimit: vi.fn(() => ({ ok: true })),
}));

vi.mock("@/lib/security/csrf", () => ({
  validateCsrf: vi.fn(() => true),
}));

import { POST } from "../echo/route";
import { rateLimit } from "@/lib/security/ratelimit";
import { validateCsrf } from "@/lib/security/csrf";

// SECURITY: Echo endpoint must enforce rate limits and CSRF before reflecting input.
describe("/api/echo", () => {
  it("should reject when rate limit is exceeded", async () => {
    vi.mocked(rateLimit).mockReturnValueOnce({ ok: false });

    const response = await POST(
      new Request("https://example.test/api/echo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "hi" }),
      }),
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({ error: "Too many requests" });
  });

  it("should reject when CSRF validation fails", async () => {
    vi.mocked(validateCsrf).mockReturnValueOnce(false);

    const response = await POST(
      new Request("https://example.test/api/echo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "hi" }),
      }),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "CSRF blocked" });
  });

  it("should reject invalid payloads", async () => {
    const response = await POST(
      new Request("https://example.test/api/echo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "" }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid input" });
  });

  it("should echo message when valid", async () => {
    const response = await POST(
      new Request("https://example.test/api/echo", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.10",
        },
        body: JSON.stringify({ message: "hello" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, echo: "hello" });
  });
});
