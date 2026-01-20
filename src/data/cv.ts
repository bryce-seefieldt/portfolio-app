// src/data/cv.ts
import { docsUrl, githubUrl } from "@/lib/config";

export interface TimelineEntry {
  title: string;
  organization: string;
  period: string;
  description: string;
  keyCapabilities: string[];
  proofs: Array<{
    text: string;
    href: string;
  }>;
}

export const TIMELINE: TimelineEntry[] = [
  {
    title: "Senior Software Engineer (Portfolio Program)",
    organization: "Independent Project",
    period: "2026",
    description:
      "Building enterprise-grade portfolio application with comprehensive CI/CD, security controls, and documentation. Demonstrates professional engineering discipline through verifiable evidence: threat modeling, operational runbooks, automated testing, and architecture decision records.",
    keyCapabilities: [
      "Next.js & React Architecture",
      "TypeScript (Strict Mode)",
      "CI/CD & Quality Gates",
      "Secrets Scanning & Security",
      "Threat Modeling (STRIDE)",
      "Operational Runbooks",
      "Evidence-First Documentation",
      "Automated Testing (Playwright)",
      "Supply Chain Hygiene",
    ],
    proofs: [
      {
        text: "Portfolio App Project Dossier",
        href: docsUrl("/docs/projects/portfolio-app/"),
      },
      {
        text: "Threat Model (STRIDE Analysis)",
        href: docsUrl("/docs/security/threat-models/portfolio-app"),
      },
      {
        text: "CI/CD Workflow (4 Required Checks)",
        href: githubUrl("blob/main/.github/workflows/ci.yml"),
      },
      {
        text: "Smoke Test Suite (Playwright)",
        href: githubUrl("blob/main/tests/e2e/smoke.spec.ts"),
      },
      {
        text: "Operational Runbooks",
        href: docsUrl("/docs/operations/runbooks/"),
      },
      {
        text: "Architecture Decision Records",
        href: docsUrl("/docs/architecture/adr/"),
      },
    ],
  },
  {
    title: "CIO / IT Executive + Full-Stack Developer",
    organization: "Education-sector enterprise IT",
    period: "Current",
    description:
      "Enterprise IT leadership with hands-on delivery across platform, operations, and application development. Docs-as-code governance: ADRs, runbooks, threat models, and release discipline as first-class artifacts. Systems thinking: reliability, recoverability, and security posture integrated into delivery workflows.",
    keyCapabilities: [
      "Enterprise IT Leadership",
      "Platform Engineering",
      "Operations & Reliability",
      "Application Development",
      "Docs-as-Code Governance",
      "Security Posture Management",
      "Team Leadership & Mentoring",
      "Systems Thinking",
    ],
    proofs: [
      {
        text: "Portfolio Program Overview",
        href: docsUrl("/docs/portfolio/"),
      },
      {
        text: "Engineering Standards & ADRs",
        href: docsUrl("/docs/architecture/adr/"),
      },
      {
        text: "Operational Maturity Evidence",
        href: docsUrl("/docs/operations/runbooks/"),
      },
    ],
  },
];
