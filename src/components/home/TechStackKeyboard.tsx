"use client";

import { useId, useMemo, useState } from "react";
import { KeycapLegend } from "@/components/KeycapLegend";
import { Keypad } from "@/components/Keypad";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";

export type StackKeyCategory = "languages" | "frontend" | "backend" | "data" | "cloud" | "tooling";

export type StackKey = {
  id: string;
  name: string;
  category: StackKeyCategory;
  capRole: string;
  blurb: string;
  size?: "1u" | "1.25u" | "1.5u" | "2u";
};

const STACK_KEYS: StackKey[] = [
  // LANGUAGES (role: primary)
  {
    id: "typescript",
    name: "TypeScript",
    category: "languages",
    capRole: "--key-primary",
    blurb:
      "My primary production language; everything I ship runs on it, in strict mode, because I want the compiler catching my mistakes before a user does.",
    size: "1u",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "languages",
    capRole: "--key-primary",
    blurb:
      "The foundation underneath the TypeScript, and still where I reach when I want something small and direct.",
    size: "1u",
  },
  {
    id: "python",
    name: "Python",
    category: "languages",
    capRole: "--key-primary",
    blurb:
      "My go-to for scripting, automation, and anything data-shaped that does not need a front end.",
    size: "1u",
  },
  {
    id: "java",
    name: "Java",
    category: "languages",
    capRole: "--key-primary",
    blurb:
      "Where I learned to think in objects and systems; two full terms of OOP plus Spring, a neural-net build, and an open-source contribution.",
    size: "1u",
  },
  // FRONTEND (role: secondary)
  {
    id: "react",
    name: "React",
    category: "frontend",
    capRole: "--key-secondary",
    blurb:
      "The library I build interfaces in, components, state, and hooks, and the one I am most fluent in.",
    size: "1u",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    capRole: "--key-secondary",
    blurb:
      "The framework my production site runs on; App Router, server components, and static generation doing the heavy lifting.",
    size: "1u",
  },
  {
    id: "angular",
    name: "Angular",
    category: "frontend",
    capRole: "--key-secondary",
    blurb:
      "A second framework in my toolkit, useful for understanding how the other half of the ecosystem thinks.",
    size: "1u",
  },
  {
    id: "tailwind",
    name: "Tailwind",
    category: "frontend",
    capRole: "--key-secondary",
    blurb:
      "How I style without leaving the markup; a design-token layer that keeps a whole site visually consistent.",
    size: "1u",
  },
  // BACKEND / RUNTIME (role: tertiary)
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    capRole: "--key-tertiary",
    blurb:
      "The runtime under my APIs and tooling, and the reason my front-end and back-end speak the same language.",
    size: "1u",
  },
  {
    id: "rest",
    name: "REST",
    category: "backend",
    capRole: "--key-tertiary",
    blurb:
      "How I design services to talk to each other: predictable endpoints, clear contracts, nothing clever for its own sake.",
    size: "1u",
  },
  // DATA (role: cyan / data)
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "data",
    capRole: "--key2-teal",
    blurb:
      "My default relational database; where I model data properly and let constraints do their job.",
    size: "1u",
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    category: "data",
    capRole: "--key2-teal",
    blurb:
      "The enterprise database I rebuilt a five-office manual report on top of, turning 45-plus weekly hours into an automated pipeline.",
    size: "1u",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "data",
    capRole: "--key2-teal",
    blurb:
      "My reach-for when the data is document-shaped and a rigid schema would only get in the way.",
    size: "1u",
  },
  // CLOUD / INFRA (role: key2-blue)
  {
    id: "aws",
    name: "AWS",
    category: "cloud",
    capRole: "--key2-blue",
    blurb:
      "Where I am building a containerized microservice right now: a REST API on ECS, secured with Cognito and JWT.",
    size: "1u",
  },
  {
    id: "azure",
    name: "Azure",
    category: "cloud",
    capRole: "--key2-blue",
    blurb:
      "The cloud I ran enterprise infrastructure on at OCAD, migrating 2,500 users with Entra ID and Intune.",
    size: "1u",
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "cloud",
    capRole: "--key2-blue",
    blurb:
      "Where my production site actually lives and ships, with preview, staging, and production deploys on every commit.",
    size: "1u",
  },
  {
    id: "docker",
    name: "Docker",
    category: "cloud",
    capRole: "--key2-blue",
    blurb: "How I package services so they run the same on my machine, in CI, and in the cloud.",
    size: "1u",
  },
  // TOOLING / PRACTICE (role: neutral)
  {
    id: "git",
    name: "Git",
    category: "tooling",
    capRole: "--key-neutral",
    blurb:
      "Every change I make is a small, reviewed commit on a short-lived branch; version control is a discipline, not an afterthought.",
    size: "1u",
  },
  {
    id: "github",
    name: "GitHub",
    category: "tooling",
    capRole: "--key-neutral",
    blurb:
      "Where my work is public and my pipeline lives: Actions running tests, scans, and quality gates on every pull request.",
    size: "1u",
  },
  {
    id: "linux",
    name: "Linux",
    category: "tooling",
    capRole: "--key-neutral",
    blurb:
      "My development environment; I learned the command line before the GUI and I have never really left it.",
    size: "1u",
  },
  {
    id: "claude",
    name: "Claude Code",
    category: "tooling",
    capRole: "--key-neutral",
    blurb:
      "My AI pair, used like a sharp colleague: fast, capable, and always reviewed, never shipped unexamined.",
    size: "2u",
  },
];

const CATEGORY_COLORS: Record<StackKeyCategory, { label: string }> = {
  languages: { label: "LANGUAGES" },
  frontend: { label: "FRONTEND" },
  backend: { label: "BACKEND" },
  data: { label: "DATA" },
  cloud: { label: "CLOUD" },
  tooling: { label: "TOOLING" },
};

const HERO_STACK_KEYS = STACK_KEYS.filter((key) => key.id !== "claude");

function getLegendInkVar(capRole: string) {
  return `var(${capRole}-ink)`;
}

export function TechStackKeyboard() {
  const [selectedId, setSelectedId] = useState(HERO_STACK_KEYS[0]?.id ?? "");
  const groupId = useId();

  const selectedKey = useMemo(() => {
    return HERO_STACK_KEYS.find((key) => key.id === selectedId) ?? HERO_STACK_KEYS[0];
  }, [selectedId]);

  const matrixKeys = useMemo(() => {
    return HERO_STACK_KEYS.map((key) => ({
      id: key.id,
      legend: <KeycapLegend id={key.id} />,
      capColor: `var(${key.capRole})`,
      legendColor: getLegendInkVar(key.capRole),
      size: key.size,
      state: key.id === selectedKey.id ? ("backlit" as const) : ("rest" as const),
      category: key.category,
      name: key.name,
    }));
  }, [selectedKey.id]);

  const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      // eslint-disable-next-line security/detect-object-injection -- currentIndex is computed from controlled key-navigation flow and bounded by HERO_STACK_KEYS length.
      setSelectedId(HERO_STACK_KEYS[currentIndex]?.id ?? "");
      return;
    }

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % HERO_STACK_KEYS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + HERO_STACK_KEYS.length) % HERO_STACK_KEYS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = HERO_STACK_KEYS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    // eslint-disable-next-line security/detect-object-injection -- nextIndex is derived from bounded modulo/home/end logic over HERO_STACK_KEYS.
    setSelectedId(HERO_STACK_KEYS[nextIndex]?.id ?? "");
  };

  return (
    <Panel variant="inset" className="tech-stack-keyboard-well">
      <div className="tech-stack-keyboard-layout grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
        <div role="radiogroup" aria-labelledby={groupId}>
          <span id={groupId} className="sr-only">
            Tech stack technologies
          </span>
          <div className="type-label text-ink-muted mb-4">TECH STACK / KEYBOARD</div>
          <Keypad
            label="TECH STACK / KEYBOARD"
            columns={4}
            keys={matrixKeys}
            embedded
            getKeyButtonProps={(key, index) => {
              // eslint-disable-next-line security/detect-object-injection -- index is row-major index over in-memory HERO_STACK_KEYS.
              const keyData = HERO_STACK_KEYS[index];
              const isActive = key.id === selectedKey.id;
              const categoryLabel = keyData ? CATEGORY_COLORS[keyData.category]?.label : undefined;
              return {
                role: "radio",
                "aria-checked": isActive,
                tabIndex: isActive ? 0 : -1,
                "aria-label": `${keyData?.name ?? "Technology"} (${categoryLabel ?? "Category"})`,
                onClick: () => setSelectedId(key.id),
                onKeyDown: (event: React.KeyboardEvent) => handleKeyDown(event, index),
              };
            }}
          />
        </div>

        <div>
          <div className="type-label text-ink-muted mb-4">CRT / TECH DETAIL</div>
          <div className="crt-screen" role="status" aria-live="polite" aria-atomic="true">
            <LabelTag tone="accent" className="mb-3">
              {selectedKey?.name ?? "SELECT A KEY"}
            </LabelTag>

            <div className="space-y-4">
              {HERO_STACK_KEYS.map((key) => (
                <p
                  key={key.id}
                  className={`type-body crt-screen__detail ${
                    key.id === selectedKey?.id ? "is-active" : ""
                  }`}
                  hidden={key.id !== selectedKey?.id}
                >
                  {key.blurb}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
