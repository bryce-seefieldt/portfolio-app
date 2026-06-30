"use client";

import { useId, useMemo, useState } from "react";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";
import type { ReactNode } from "react";
import * as Icons from "@/icons/TechStackIcons";

export type StackKeyCategory = "languages" | "frontend" | "backend" | "data" | "cloud" | "tooling";

export type StackKey = {
  id: string;
  name: string;
  category: StackKeyCategory;
  capRole: string;
  legend: ReactNode;
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
    legend: <Icons.TypeScriptIcon className="h-5 w-5" />,
    blurb:
      "My primary production language; everything I ship runs on it, in strict mode, because I want the compiler catching my mistakes before a user does.",
    size: "1u",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "languages",
    capRole: "--key-primary",
    legend: <Icons.JavaScriptIcon className="h-5 w-5" />,
    blurb:
      "The foundation underneath the TypeScript, and still where I reach when I want something small and direct.",
    size: "1u",
  },
  {
    id: "python",
    name: "Python",
    category: "languages",
    capRole: "--key-primary",
    legend: <Icons.PythonIcon className="h-5 w-5" />,
    blurb:
      "My go-to for scripting, automation, and anything data-shaped that does not need a front end.",
    size: "1u",
  },
  {
    id: "java",
    name: "Java",
    category: "languages",
    capRole: "--key-primary",
    legend: <Icons.JavaLegend className="h-5 w-5" />,
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
    legend: <Icons.ReactIcon className="h-5 w-5" />,
    blurb:
      "The library I build interfaces in, components, state, and hooks, and the one I am most fluent in.",
    size: "1u",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    capRole: "--key-secondary",
    legend: <Icons.NextJsIcon className="h-5 w-5" />,
    blurb:
      "The framework my production site runs on; App Router, server components, and static generation doing the heavy lifting.",
    size: "1u",
  },
  {
    id: "angular",
    name: "Angular",
    category: "frontend",
    capRole: "--key-secondary",
    legend: <Icons.AngularIcon className="h-5 w-5" />,
    blurb:
      "A second framework in my toolkit, useful for understanding how the other half of the ecosystem thinks.",
    size: "1u",
  },
  {
    id: "tailwind",
    name: "Tailwind",
    category: "frontend",
    capRole: "--key-secondary",
    legend: <Icons.TailwindIcon className="h-5 w-5" />,
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
    legend: <Icons.NodeJsIcon className="h-5 w-5" />,
    blurb:
      "The runtime under my APIs and tooling, and the reason my front-end and back-end speak the same language.",
    size: "1u",
  },
  {
    id: "rest",
    name: "REST",
    category: "backend",
    capRole: "--key-tertiary",
    legend: <Icons.RestLegend className="h-5 w-5" />,
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
    legend: <Icons.PostgreSQLIcon className="h-5 w-5" />,
    blurb:
      "My default relational database; where I model data properly and let constraints do their job.",
    size: "1u",
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    category: "data",
    capRole: "--key2-teal",
    legend: <Icons.SQLServerLegend className="h-5 w-5" />,
    blurb:
      "The enterprise database I rebuilt a five-office manual report on top of, turning 45-plus weekly hours into an automated pipeline.",
    size: "1u",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "data",
    capRole: "--key2-teal",
    legend: <Icons.MongoDBIcon className="h-5 w-5" />,
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
    legend: <Icons.AWSLegend className="h-5 w-5" />,
    blurb:
      "Where I am building a containerized microservice right now: a REST API on ECS, secured with Cognito and JWT.",
    size: "1u",
  },
  {
    id: "azure",
    name: "Azure",
    category: "cloud",
    capRole: "--key2-blue",
    legend: <Icons.AzureLegend className="h-5 w-5" />,
    blurb:
      "The cloud I ran enterprise infrastructure on at OCAD, migrating 2,500 users with Entra ID and Intune.",
    size: "1u",
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "cloud",
    capRole: "--key2-blue",
    legend: <Icons.VercelIcon className="h-5 w-5" />,
    blurb:
      "Where my production site actually lives and ships, with preview, staging, and production deploys on every commit.",
    size: "1u",
  },
  {
    id: "docker",
    name: "Docker",
    category: "cloud",
    capRole: "--key2-blue",
    legend: <Icons.DockerIcon className="h-5 w-5" />,
    blurb: "How I package services so they run the same on my machine, in CI, and in the cloud.",
    size: "1u",
  },
  // TOOLING / PRACTICE (role: neutral)
  {
    id: "git",
    name: "Git",
    category: "tooling",
    capRole: "--key-neutral",
    legend: <Icons.GitIcon className="h-5 w-5" />,
    blurb:
      "Every change I make is a small, reviewed commit on a short-lived branch; version control is a discipline, not an afterthought.",
    size: "1u",
  },
  {
    id: "github",
    name: "GitHub",
    category: "tooling",
    capRole: "--key-neutral",
    legend: <Icons.GitHubIcon className="h-5 w-5" />,
    blurb:
      "Where my work is public and my pipeline lives: Actions running tests, scans, and quality gates on every pull request.",
    size: "1u",
  },
  {
    id: "linux",
    name: "Linux",
    category: "tooling",
    capRole: "--key-neutral",
    legend: <Icons.LinuxIcon className="h-5 w-5" />,
    blurb:
      "My development environment; I learned the command line before the GUI and I have never really left it.",
    size: "1u",
  },
  {
    id: "claude",
    name: "Claude Code",
    category: "tooling",
    capRole: "--key-neutral",
    legend: <Icons.ClaudeCodeLegend className="h-5 w-5" />,
    blurb:
      "My AI pair, used like a sharp colleague: fast, capable, and always reviewed, never shipped unexamined.",
    size: "2u",
  },
];

const CATEGORY_COLORS: Record<StackKeyCategory, { label: string }> = {
  languages: { label: "LANGUAGES" },
  frontend: { label: "FRONTEND" },
  backend: { label: "BACKEND / RUNTIME" },
  data: { label: "DATA" },
  cloud: { label: "CLOUD / INFRA" },
  tooling: { label: "TOOLING / PRACTICE" },
};

export function TechStackKeyboard() {
  const [selectedId, setSelectedId] = useState(STACK_KEYS[0]?.id ?? "");
  const groupId = useId();

  const selectedKey = useMemo(() => {
    return STACK_KEYS.find((key) => key.id === selectedId) ?? STACK_KEYS[0];
  }, [selectedId]);

  const keysByCategory = useMemo(() => {
    const result: Record<StackKeyCategory, StackKey[]> = {
      languages: [],
      frontend: [],
      backend: [],
      data: [],
      cloud: [],
      tooling: [],
    };

    STACK_KEYS.forEach((key) => {
      result[key.category].push(key);
    });
    return result;
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setSelectedId(STACK_KEYS[currentIndex]?.id ?? "");
      return;
    }

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % STACK_KEYS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + STACK_KEYS.length) % STACK_KEYS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = STACK_KEYS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setSelectedId(STACK_KEYS[nextIndex]?.id ?? "");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
      <Panel label="TECH STACK / KEYBOARD" variant="default">
        <div role="radiogroup" aria-labelledby={groupId} className="space-y-4">
          <span id={groupId} className="sr-only">
            Tech stack technologies
          </span>

          {(Object.entries(keysByCategory) as Array<[StackKeyCategory, StackKey[]]>).map(
            ([category, keys]) => {
              if (keys.length === 0) return null;
              const categoryData = CATEGORY_COLORS[category];
              return (
                <div key={category} className="space-y-2">
                  <div className="type-label text-ink-muted">{categoryData?.label}</div>
                  <div
                    className="keypad-grid"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(3.5rem, 1fr))" }}
                  >
                    {keys.map((key) => {
                      const globalIndex = STACK_KEYS.findIndex((k) => k.id === key.id);
                      const isActive = key.id === selectedKey.id;
                      const sizeClass = `keycap--${key.size ?? "1u"}`;
                      return (
                        <button
                          key={key.id}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          tabIndex={isActive ? 0 : -1}
                          className={`keycap ${sizeClass} ${isActive ? "keycap--backlit" : ""}`}
                          style={{ "--keycap-bg": `var(${key.capRole})` } as React.CSSProperties}
                          onClick={() => setSelectedId(key.id)}
                          onKeyDown={(e) => handleKeyDown(e, globalIndex)}
                        >
                          <span className="keycap__legend">{key.legend}</span>
                          <span className="keycap__sublegend text-xs">{key.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </Panel>

      <Panel label="CRT / TECH DETAIL" variant="inset">
        <div className="crt-screen" role="status" aria-live="polite" aria-atomic="true">
          <LabelTag tone="accent" className="mb-3">
            {selectedKey?.name ?? "SELECT A KEY"}
          </LabelTag>

          <div className="space-y-4">
            {STACK_KEYS.map((key) => (
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
      </Panel>
    </div>
  );
}
