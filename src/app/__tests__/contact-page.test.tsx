// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

async function loadPage(config: Record<string, string | null>) {
  vi.resetModules();
  vi.doMock("@/lib/config", () => ({
    CONTACT_EMAIL: config.CONTACT_EMAIL,
    GITHUB_URL: config.GITHUB_URL,
    LINKEDIN_URL: config.LINKEDIN_URL,
    mailtoUrl: (email: string, subject: string) => `mailto:${email}?subject=${subject}`,
  }));
  const pageModule = await import("../contact/page");
  return pageModule.default;
}

// RATIONALE: Contact page must render static contact methods or clear setup guidance.
describe("ContactPage", () => {
  it("should render setup guidance when no contact links configured", async () => {
    const ContactPage = await loadPage({
      CONTACT_EMAIL: null,
      GITHUB_URL: null,
      LINKEDIN_URL: null,
    });

    render(<ContactPage />);
    expect(screen.getByText(/No contact links are configured/i)).toBeInTheDocument();
  });

  it("should render contact links when configured", async () => {
    const ContactPage = await loadPage({
      CONTACT_EMAIL: "hello@example.com",
      GITHUB_URL: "https://github.com/example",
      LINKEDIN_URL: "https://linkedin.example.com",
    });

    render(<ContactPage />);
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});
