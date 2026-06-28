"use client";

import { useId, useMemo, useState } from "react";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";

type Principle = {
  id: string;
  label: string;
  detail: string;
};

const PRINCIPLES: Principle[] = [
  {
    id: "find-the-break",
    label: "FIND THE BREAK",
    detail:
      "I find the broken process before I write the code. Most of the value I've delivered, from automating royalty reporting across five offices to halving a university's print-support load, started with seeing the inefficiency, not the technology. The code is the fix, not the goal.",
  },
  {
    id: "translate",
    label: "TRANSLATE",
    detail:
      "I translate between the boardroom and the terminal. Twenty-five years of explaining technical realities to non-technical stakeholders, and business realities to engineers. I'm fluent in both rooms and comfortable being the bridge.",
  },
  {
    id: "built-to-maintain",
    label: "BUILT TO MAINTAIN",
    detail:
      "I build things meant to be maintained by someone else. Decisions written down, architectures documented, the next person in mind from the first commit. The difference between code that works and code a team can live with.",
  },
  {
    id: "user-first",
    label: "USER FIRST",
    detail:
      "I think about the person using it before the framework I'll build it in. User experience is a design decision made before the first line of code, not a polish step at the end.",
  },
  {
    id: "secure-by-default",
    label: "SECURE BY DEFAULT",
    detail:
      "Security is a starting posture, not a final checklist. I'd rather build the threat model first than bolt hardening on later.",
  },
  {
    id: "build-from-nothing",
    label: "BUILD FROM NOTHING",
    detail:
      "I've built things from nothing. A company, an enterprise continuity program, this site. I'm comfortable where there's no template yet.",
  },
  {
    id: "speed-and-quality",
    label: "SPEED AND QUALITY",
    detail:
      "I balance speed and quality because I've always had to. Release dates don't move; quality can't slip. I learned that in an industry where both were true at once, long before I learned it in software.",
  },
];

function getNextIndex(currentIndex: number, key: string) {
  if (key === "ArrowRight" || key === "ArrowDown") {
    return (currentIndex + 1) % PRINCIPLES.length;
  }
  if (key === "ArrowLeft" || key === "ArrowUp") {
    return (currentIndex - 1 + PRINCIPLES.length) % PRINCIPLES.length;
  }
  if (key === "Home") {
    return 0;
  }
  if (key === "End") {
    return PRINCIPLES.length - 1;
  }
  return currentIndex;
}

export function OperatingPrinciplesPanel() {
  const [selectedId, setSelectedId] = useState(PRINCIPLES.at(0)?.id ?? "");
  const groupId = useId();

  const selectedIndex = useMemo(() => {
    const idx = PRINCIPLES.findIndex((principle) => principle.id === selectedId);
    return idx >= 0 ? idx : 0;
  }, [selectedId]);

  const selectedPrinciple = PRINCIPLES.at(selectedIndex) ?? PRINCIPLES.at(0);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-stretch">
      <Panel label="ANNUNCIATOR / PRINCIPLE SELECT" variant="default" className="h-full">
        <div
          role="radiogroup"
          aria-labelledby={groupId}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          <span id={groupId} className="sr-only">
            Operating principles
          </span>
          {PRINCIPLES.map((principle, index) => {
            const isActive = principle.id === selectedPrinciple?.id;
            return (
              <button
                key={principle.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-controls={`principle-detail-${principle.id}`}
                tabIndex={isActive ? 0 : -1}
                className={`annunciator-tile ${isActive ? "is-active" : ""}`}
                onClick={() => setSelectedId(principle.id)}
                onKeyDown={(event) => {
                  if (event.key === " " || event.key === "Enter") {
                    event.preventDefault();
                    setSelectedId(principle.id);
                    return;
                  }

                  const nextIndex = getNextIndex(index, event.key);
                  if (nextIndex !== index) {
                    event.preventDefault();
                    const nextPrinciple = PRINCIPLES.at(nextIndex);
                    if (!nextPrinciple) return;
                    setSelectedId(nextPrinciple.id);
                  }
                }}
              >
                <span className="annunciator-tile__lamp" aria-hidden="true" />
                <span className="annunciator-tile__text">{principle.label}</span>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel label="CRT DETAIL / ACTIVE PRINCIPLE" variant="inset" className="h-full">
        <div className="crt-screen" role="status" aria-live="polite" aria-atomic="true">
          <LabelTag tone="accent" className="mb-3">
            {selectedPrinciple?.label}
          </LabelTag>

          <div className="space-y-4">
            {PRINCIPLES.map((principle) => (
              <p
                id={`principle-detail-${principle.id}`}
                key={principle.id}
                className={`type-body crt-screen__detail ${
                  principle.id === selectedPrinciple?.id ? "is-active" : ""
                }`}
                hidden={principle.id !== selectedPrinciple?.id}
              >
                {principle.detail}
              </p>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
