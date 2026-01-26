import { NextResponse } from "next/server";
import { PROJECTS } from "@/data/projects";

/**
 * Health Check Endpoint
 *
 * Returns application health status with environment metadata.
 * Used by monitoring systems to detect degradation and failures.
 *
 * Status codes:
 * - 200: Healthy (all systems operational)
 * - 503: Degraded (core functionality works, but some features unavailable)
 * - 500: Unhealthy (critical failures, service broken)
 *
 * @see docs/60-projects/portfolio-app/08-observability.md for full documentation
 */
export const revalidate = 0; // No caching - always fresh status

export async function GET() {
  try {
    // Verify critical resources are accessible
    const projectCount = PROJECTS.length;
    const buildTime = process.env.BUILD_TIME || "unknown";
    const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "unknown";
    const environment = process.env.VERCEL_ENV || "development";

    // Check for degraded state: no projects loaded indicates data loading issue
    if (projectCount === 0) {
      return NextResponse.json(
        {
          status: "degraded",
          message: "No projects loaded",
          timestamp: new Date().toISOString(),
          environment,
          commit,
        },
        { status: 503 },
      );
    }

    // Healthy state: all checks passed
    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment,
        commit,
        buildTime,
        projectCount,
      },
      { status: 200 },
    );
  } catch (error) {
    // Unhealthy state: exception during health check indicates critical failure
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL_ENV || "development",
      },
      { status: 500 },
    );
  }
}
