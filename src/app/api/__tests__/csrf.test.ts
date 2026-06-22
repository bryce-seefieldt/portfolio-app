import { describe, expect, it } from "vitest";
import { GET } from "../csrf/route";

// SECURITY: CSRF tokens must be returned with strict cookie attributes for safe defaults.
describe("/api/csrf", () => {
  it("should return csrf token JSON and set cookie", async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload.csrf).toBeTruthy();

    const cookie = response.headers.get("set-cookie");
    expect(cookie).toContain("csrf=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Strict");
  });
});
