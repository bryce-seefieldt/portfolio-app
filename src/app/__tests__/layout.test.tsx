// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-nonce": "test-nonce" }),
}));

vi.mock("@vercel/analytics/react", () => ({
  Analytics: () => <div>Analytics</div>,
}));

vi.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => <div>SpeedInsights</div>,
}));

vi.mock("@/components/NavigationEnhanced", () => ({
  NavigationEnhanced: () => <nav>Nav</nav>,
}));

vi.mock("@/components/BackToTop", () => ({
  BackToTop: () => <div>BackToTop</div>,
}));

const configValues = vi.hoisted(
  (): {
    DOCS_BASE_URL: string;
    GITHUB_BASE_URL: string | null;
    LINKEDIN_URL: string | null;
    SITE_URL: string;
  } => ({
    DOCS_BASE_URL: "https://docs.example.com",
    GITHUB_BASE_URL: "https://github.com/example-base",
    LINKEDIN_URL: "https://linkedin.example.com",
    SITE_URL: "https://example.com",
  }),
);

vi.mock("@/lib/config", () => ({
  get DOCS_BASE_URL() {
    return configValues.DOCS_BASE_URL;
  },
  get GITHUB_BASE_URL() {
    return configValues.GITHUB_BASE_URL;
  },
  get LINKEDIN_URL() {
    return configValues.LINKEDIN_URL;
  },
  get SITE_URL() {
    return configValues.SITE_URL;
  },
}));

vi.mock("@/lib/structured-data", () => ({
  generatePersonSchema: () => ({ "@type": "Person" }),
  generateWebsiteSchema: () => ({ "@type": "WebSite" }),
  formatSchemaAsScript: () => "{}",
}));

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter" }),
  Space_Grotesk: () => ({ variable: "--font-space-grotesk" }),
  JetBrains_Mono: () => ({ variable: "--font-jetbrains-mono" }),
}));

vi.mock("next/font/local", () => ({
  default: () => ({ variable: "--font-departure-mono" }),
}));

import RootLayout from "../layout";

// RATIONALE: Root layout must render navigation, footer, and main slot.
describe("RootLayout", () => {
  it("should render children and footer links", async () => {
    configValues.GITHUB_BASE_URL = "https://github.com/example-base";
    configValues.LINKEDIN_URL = "https://linkedin.example.com";

    const node = await RootLayout({ children: <div>Content</div> });

    render(node as React.ReactElement);

    expect(screen.getAllByText("Content")).toHaveLength(1);
    expect(screen.getByText("Engineering Docs")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
  });

  it("should omit LinkedIn when missing", async () => {
    configValues.GITHUB_BASE_URL = null;
    configValues.LINKEDIN_URL = null;

    const node = await RootLayout({ children: <div>Content</div> });

    render(node as React.ReactElement);

    expect(screen.queryByText("LinkedIn")).toBeNull();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });
});
