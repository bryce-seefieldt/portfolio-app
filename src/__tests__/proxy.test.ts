import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";

// SECURITY: Proxy must attach CSP with a unique nonce per request.
describe("proxy middleware", () => {
  it("should attach CSP header", () => {
    const request = new NextRequest("https://example.test");
    const response = proxy(request);

    const csp = response.headers.get("Content-Security-Policy");
    expect(csp).toBeTruthy();
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("nonce-");
  });
});
