import { describe, it, expect } from "vitest";
import * as config from "../config";
import * as environment from "../environment";

// RATIONALE: The environment module is a stable facade; re-exports must remain consistent.
describe("environment re-exports", () => {
  it("should re-export config constants and helpers", () => {
    expect(environment.ENVIRONMENT).toBe(config.ENVIRONMENT);
    expect(environment.DEPLOY_ENV).toBe(config.DEPLOY_ENV);
    expect(environment.isProduction).toBe(config.isProduction);
    expect(environment.isPreview).toBe(config.isPreview);
    expect(environment.isStaging).toBe(config.isStaging);
    expect(environment.isDevelopment).toBe(config.isDevelopment);
  });

  it("should return the same helper results as config", () => {
    expect(environment.isDevelopment()).toBe(config.isDevelopment());
    expect(environment.isProduction()).toBe(config.isProduction());
  });
});
