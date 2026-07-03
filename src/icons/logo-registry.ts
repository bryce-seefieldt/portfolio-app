import {
  siAngular,
  siAnthropic,
  siDocker,
  siGit,
  siGithub,
  siJavascript,
  siLinux,
  siMongodb,
  siNodedotjs,
  siNextdotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";

export type LegendTier = "svg" | "mask" | "text";

export interface LogoEntry {
  id: string;
  label: string;
  tier: LegendTier;
  asset?: string;
  text?: string;
  opticalScale: number;
  note?: string;
}

const AZURE_TRIANGLE_PATH = "M12 2L22 22H2L12 2ZM12 7.8L16.2 16.2H7.8L12 7.8Z";
const SQL_SERVER_PATH =
  "M12 2C7.3 2 4 3.6 4 5.8v12.4C4 20.4 7.3 22 12 22s8-1.6 8-3.8V5.8C20 3.6 16.7 2 12 2Zm0 1.8c3.8 0 6.2 1.2 6.2 2s-2.4 2-6.2 2-6.2-1.2-6.2-2 2.4-2 6.2-2Zm6.2 7.1v2.3c0 .8-2.4 2-6.2 2s-6.2-1.2-6.2-2v-2.3c1.6 1 4.1 1.5 6.2 1.5s4.6-.5 6.2-1.5Zm-6.2 9.3c-3.8 0-6.2-1.2-6.2-2v-2.3c1.6 1 4.1 1.5 6.2 1.5s4.6-.5 6.2-1.5v2.3c0 .8-2.4 2-6.2 2Z";

export const LOGO_REGISTRY: Record<string, LogoEntry> = {
  typescript: {
    id: "typescript",
    label: "TypeScript",
    tier: "svg",
    asset: siTypescript.path,
    opticalScale: 1,
    note: "Simple Icons source",
  },
  javascript: {
    id: "javascript",
    label: "JavaScript",
    tier: "svg",
    asset: siJavascript.path,
    opticalScale: 1,
    note: "Simple Icons source",
  },
  python: {
    id: "python",
    label: "Python",
    tier: "svg",
    asset: siPython.path,
    opticalScale: 1.04,
    note: "Simple Icons source",
  },
  java: {
    id: "java",
    label: "Java",
    tier: "svg",
    asset: siOpenjdk.path,
    opticalScale: 1,
    note: "OpenJDK mark from Simple Icons",
  },
  react: {
    id: "react",
    label: "React",
    tier: "svg",
    asset: siReact.path,
    opticalScale: 1.05,
    note: "Simple Icons source",
  },
  nextjs: {
    id: "nextjs",
    label: "Next.js",
    tier: "svg",
    asset: siNextdotjs.path,
    opticalScale: 1,
    note: "Simple Icons source",
  },
  angular: {
    id: "angular",
    label: "Angular",
    tier: "svg",
    asset: siAngular.path,
    opticalScale: 1,
    note: "Simple Icons source",
  },
  tailwind: {
    id: "tailwind",
    label: "Tailwind CSS",
    tier: "svg",
    asset: siTailwindcss.path,
    opticalScale: 1.05,
    note: "Simple Icons source",
  },
  nodejs: {
    id: "nodejs",
    label: "Node.js",
    tier: "svg",
    asset: siNodedotjs.path,
    opticalScale: 1,
    note: "Simple Icons source",
  },
  rest: {
    id: "rest",
    label: "REST",
    tier: "text",
    text: "REST",
    opticalScale: 1,
    note: "Intentional text legend",
  },
  postgresql: {
    id: "postgresql",
    label: "PostgreSQL",
    tier: "svg",
    asset: siPostgresql.path,
    opticalScale: 0.95,
    note: "Simple Icons source",
  },
  sqlserver: {
    id: "sqlserver",
    label: "SQL Server",
    tier: "svg",
    asset: SQL_SERVER_PATH,
    opticalScale: 1,
    note: "Custom monochrome database mark",
  },
  mongodb: {
    id: "mongodb",
    label: "MongoDB",
    tier: "svg",
    asset: siMongodb.path,
    opticalScale: 1.05,
    note: "Simple Icons source",
  },
  aws: {
    id: "aws",
    label: "AWS",
    tier: "text",
    text: "aws",
    opticalScale: 1,
    note: "Intentional lowercase wordmark",
  },
  azure: {
    id: "azure",
    label: "Azure",
    tier: "svg",
    asset: AZURE_TRIANGLE_PATH,
    opticalScale: 1,
    note: "Custom monochrome Azure triangle mark",
  },
  vercel: {
    id: "vercel",
    label: "Vercel",
    tier: "svg",
    asset: siVercel.path,
    opticalScale: 1.05,
    note: "Simple Icons source",
  },
  docker: {
    id: "docker",
    label: "Docker",
    tier: "svg",
    asset: siDocker.path,
    opticalScale: 1,
    note: "Simple Icons source",
  },
  git: {
    id: "git",
    label: "Git",
    tier: "svg",
    asset: siGit.path,
    opticalScale: 1,
    note: "Simple Icons source",
  },
  github: {
    id: "github",
    label: "GitHub",
    tier: "svg",
    asset: siGithub.path,
    opticalScale: 1,
    note: "Simple Icons source",
  },
  linux: {
    id: "linux",
    label: "Linux",
    tier: "svg",
    asset: siLinux.path,
    opticalScale: 1,
    note: "Simple Icons source",
  },
  claude: {
    id: "claude",
    label: "Claude Code",
    tier: "svg",
    asset: siAnthropic.path,
    opticalScale: 1,
    note: "Anthropic mark from Simple Icons",
  },
};
