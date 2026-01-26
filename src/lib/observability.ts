/**
 * Observability Utilities
 *
 * Provides structured logging helpers for application monitoring and debugging.
 * All logs are output as JSON to console for integration with Vercel Logs
 * and external monitoring systems (Datadog, New Relic, etc.).
 *
 * @see docs/60-projects/portfolio-app/08-observability.md for usage guidelines
 */

/**
 * Log entry structure for structured logging.
 *
 * All fields except context are required and automatically populated.
 * Context should contain relevant metadata for the log entry (e.g., user ID, operation, timing).
 */
export interface LogEntry {
  /** ISO 8601 timestamp when log was created */
  timestamp: string;
  /** Log severity level */
  level: "info" | "warn" | "error" | "debug";
  /** Human-readable log message */
  message: string;
  /** Optional structured data (avoid PII and secrets) */
  context?: Record<string, unknown>;
  /** Deployment environment (production, preview, development) */
  environment?: string;
}

/**
 * Structured logging function.
 *
 * Outputs JSON-formatted logs to console for parsing by monitoring systems.
 * Automatically adds timestamp and environment information.
 *
 * @example
 * ```typescript
 * import { log } from '@/lib/observability';
 *
 * // Simple info log
 * log({ level: 'info', message: 'User loaded project page' });
 *
 * // Error log with context
 * log({
 *   level: 'error',
 *   message: 'Failed to load project',
 *   context: { slug: 'portfolio-app', error: 'Not found' }
 * });
 *
 * // Warning with performance data
 * log({
 *   level: 'warn',
 *   message: 'Slow page render',
 *   context: { route: '/projects', renderTime: 3500 }
 * });
 * ```
 *
 * @param entry - Log entry without timestamp (auto-populated)
 */
export function log(entry: Omit<LogEntry, "timestamp">): void {
  const fullEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || "development",
    ...entry,
  };

  // Output as JSON for structured parsing by monitoring systems
  // Use console.log (not console.error) to ensure proper stream handling in Vercel
  console.log(JSON.stringify(fullEntry));
}

/**
 * Helper function for error logging with automatic error extraction.
 *
 * Convenience wrapper around log() for common error logging patterns.
 * Automatically extracts error message and stack trace.
 *
 * @example
 * ```typescript
 * try {
 *   await loadProjects();
 * } catch (error) {
 *   logError('Failed to load projects', error, { operation: 'loadProjects' });
 * }
 * ```
 *
 * @param message - Human-readable error description
 * @param error - Error object or unknown error value
 * @param context - Additional context metadata
 */
export function logError(message: string, error: unknown, context?: Record<string, unknown>): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack =
    error instanceof Error ? error.stack?.split("\n").slice(0, 3).join("\n") : undefined;

  log({
    level: "error",
    message,
    context: {
      error: errorMessage,
      stack: errorStack,
      ...context,
    },
  });
}
