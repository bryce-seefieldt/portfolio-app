"use client";

import { useEffect } from "react";
import { logError } from "@/lib/observability";

/**
 * Global Error Boundary
 *
 * Catches unhandled errors in the application and displays a user-friendly message.
 * Logs all errors to structured logging for monitoring and debugging.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error with structured logging for monitoring
    logError("Unhandled application error", error, {
      digest: error.digest,
      route: window.location.pathname,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold">Something went wrong</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
