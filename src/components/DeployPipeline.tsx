"use client";

import { useEffect, useState } from "react";
import { LabelTag } from "@/components/LabelTag";

const DEPLOY_STAGES = ["COMMIT", "CHECKS", "STAGING", "PRODUCTION"] as const;
const STAGE_DURATION_MS = 1000;

export function DeployPipeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      setActiveIndex(mediaQuery.matches ? DEPLOY_STAGES.length - 1 : 0);
    };

    applyPreference();

    const handleChange = () => applyPreference();
    mediaQuery.addEventListener("change", handleChange);

    if (mediaQuery.matches) {
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    const timers = DEPLOY_STAGES.slice(1).map((_, idx) => {
      const nextStageIndex = idx + 1;
      return window.setTimeout(() => {
        setActiveIndex(nextStageIndex);
      }, nextStageIndex * STAGE_DURATION_MS);
    });

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {DEPLOY_STAGES.map((stage, index) => {
        const isFinal = index === DEPLOY_STAGES.length - 1;
        const isActive = activeIndex === index;

        return (
          <div key={stage} className="flex items-center gap-2">
            <span
              className={`pipeline-led pipeline-led--stage-${index + 1} ${isActive ? "pipeline-led--active" : ""} ${
                isFinal && isActive ? "pipeline-led--final" : ""
              }`}
              aria-hidden="true"
            />
            <LabelTag tone={isFinal ? "accent" : "default"}>{stage}</LabelTag>
            {index < DEPLOY_STAGES.length - 1 ? (
              <span className="text-ink-muted" aria-hidden="true">
                →
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
