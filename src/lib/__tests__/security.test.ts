import { describe, expect, it, vi } from "vitest";
import { BASE_SECURITY_HEADERS, buildCsp } from "@/lib/security/headers";
import { generateCsrfToken, validateCsrf } from "@/lib/security/csrf";
import { rateLimit } from "@/lib/security/ratelimit";

describe("security headers", () => {
  it("should include core security headers", () => {
    const headerMap = new Map(BASE_SECURITY_HEADERS);

    expect(headerMap.get("X-Frame-Options")).toBe("DENY");
    expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headerMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headerMap.get("Permissions-Policy")).toBe("geolocation=(), microphone=(), camera=()");
    expect(headerMap.get("Strict-Transport-Security")).toContain("max-age=31536000");
  });

  it("should include nonce and directives in CSP", () => {
    const nonce = "test-nonce";
    const csp = buildCsp(nonce);

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self' 'nonce-test-nonce'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });
});

describe("csrf utilities", () => {
  it("should generate a unique token", () => {
    const first = generateCsrfToken();
    const second = generateCsrfToken();

    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first).not.toEqual(second);
  });

  it("should validate matching cookie and header", () => {
    const token = "csrf-token";
    const request = new Request("https://example.test", {
      headers: {
        cookie: `csrf=${token};`,
        "x-csrf": token,
      },
    });

    expect(validateCsrf(request)).toBe(true);
  });

  it("should reject missing or mismatched tokens", () => {
    const missing = new Request("https://example.test");
    const mismatch = new Request("https://example.test", {
      headers: {
        cookie: "csrf=token-a;",
        "x-csrf": "token-b",
      },
    });

    expect(validateCsrf(missing)).toBe(false);
    expect(validateCsrf(mismatch)).toBe(false);
  });
});

describe("rate limiter", () => {
  it("should enforce limits and reset after window", () => {
    vi.useFakeTimers();
    const now = new Date("2026-02-05T00:00:00.000Z");
    vi.setSystemTime(now);

    const key = "test-rate-limit";

    const first = rateLimit(key, 2, 1000);
    const second = rateLimit(key, 2, 1000);
    const third = rateLimit(key, 2, 1000);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(third.ok).toBe(false);

    vi.setSystemTime(new Date(now.getTime() + 1001));
    const reset = rateLimit(key, 2, 1000);
    expect(reset.ok).toBe(true);

    vi.useRealTimers();
  });
});
