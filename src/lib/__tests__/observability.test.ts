import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { log, logError } from "../observability";

describe("observability", () => {
  const originalEnv = process.env.VERCEL_ENV;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-04T12:00:00.000Z"));
    process.env.VERCEL_ENV = "preview";
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env.VERCEL_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  it("should emit structured logs with timestamp and environment", () => {
    log({ level: "info", message: "Project loaded", context: { slug: "portfolio-app" } });

    expect(console.log).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(String(vi.mocked(console.log).mock.calls[0][0]));

    expect(payload).toMatchObject({
      level: "info",
      message: "Project loaded",
      environment: "preview",
      context: { slug: "portfolio-app" },
    });
    expect(payload.timestamp).toBe("2026-02-04T12:00:00.000Z");
  });

  it("should default environment to development when VERCEL_ENV is unset", () => {
    delete process.env.VERCEL_ENV;

    log({ level: "info", message: "Default env" });

    const payload = JSON.parse(String(vi.mocked(console.log).mock.calls[0][0]));
    expect(payload.environment).toBe("development");
  });

  it("should include error message and stack in logError", () => {
    const error = new Error("Boom");
    error.stack = "Error: Boom\nline1\nline2\nline3\nline4";

    logError("Failed to load", error, { operation: "load" });

    const payload = JSON.parse(String(vi.mocked(console.log).mock.calls[0][0]));
    expect(payload.level).toBe("error");
    expect(payload.message).toBe("Failed to load");
    expect(payload.context.error).toBe("Boom");
    expect(payload.context.stack).toBe("Error: Boom\nline1\nline2");
    expect(payload.context.operation).toBe("load");
  });

  it("should handle non-Error values in logError", () => {
    logError("Unexpected", "oops");

    const payload = JSON.parse(String(vi.mocked(console.log).mock.calls[0][0]));
    expect(payload.context.error).toBe("oops");
    expect(payload.context.stack).toBeUndefined();
  });

  it("should omit stack when Error has no stack", () => {
    const error = new Error("No stack");
    error.stack = undefined;

    logError("Failed", error);

    const payload = JSON.parse(String(vi.mocked(console.log).mock.calls[0][0]));
    expect(payload.context.error).toBe("No stack");
    expect(payload.context.stack).toBeUndefined();
  });
});
