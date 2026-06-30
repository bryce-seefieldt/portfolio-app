"use client";

import { useEffect } from "react";

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalMeasure = performance.measure.bind(performance);

    const wrappedMeasure: typeof performance.measure = function (
      measureName: string,
      startOrMeasureOptions?: string | PerformanceMeasureOptions,
      endMark?: string,
    ) {
      try {
        return originalMeasure(measureName, startOrMeasureOptions, endMark);
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message?.includes("negative")) {
          console.debug("Performance: timing issue (negative value), suppressed");
          // Return a synthetic measure object to prevent breaking Speed Insights
          return {
            name: measureName,
            entryType: "measure",
            startTime: 0,
            duration: 0,
            toJSON: () => ({}),
          } as PerformanceMeasure;
        }
        throw error;
      }
    };

    performance.measure = wrappedMeasure;
  }, []);

  return null;
}
