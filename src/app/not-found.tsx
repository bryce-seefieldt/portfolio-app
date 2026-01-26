import Link from "next/link";
import { log } from "@/lib/observability";

/**
 * 404 Not Found Page
 *
 * Displayed when a route doesn't exist.
 * Logs 404 occurrences for monitoring broken links and user navigation patterns.
 */
export default function NotFound() {
  // Log 404 for monitoring (helps identify broken links)
  if (typeof window !== "undefined") {
    log({
      level: "warn",
      message: "404 Not Found",
      context: {
        route: window.location.pathname,
        referrer: document.referrer || "direct",
      },
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
