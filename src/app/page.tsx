// src/app/page.tsx
import Link from "next/link";
import { Callout } from "@/components/Callout";
import { Section } from "@/components/Section";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { DOCS_URL, GITHUB_URL, LINKEDIN_URL, docsUrl } from "@/lib/config";

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-900 dark:border-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* HERO */}
      <ScrollFadeIn>
        <header className="flex flex-col gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Full-stack developer · Toronto</p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            I build production software, with proof and rationale at every stage.
          </h1>

          <p className="max-w-3xl text-base text-zinc-700 dark:text-zinc-300">
            Full-stack developer with a background leading enterprise technology projects. I spent
            the last eighteen months modernizing systems at OCAD University, and continue to build
            everything to an enterprise standard: tested, secured, documented, and shipped through a
            real pipeline. Take a look around. The proof is one click deep.
          </p>

          {/* PRIMARY CTA ROW */}
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton href="/cv">Read the CV</PrimaryButton>
            <SecondaryLink href="/projects">See the work</SecondaryLink>
            <a
              className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Or jump straight to the engineering docs →
            </a>
          </div>

          {/* EXTERNAL LINKS */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            {GITHUB_URL ? (
              <a
                className="hover:text-zinc-950 dark:hover:text-white"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            ) : null}
            {LINKEDIN_URL ? (
              <a
                className="hover:text-zinc-950 dark:hover:text-white"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            ) : null}
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span>Enterprise delivery, with proof one click deep</span>
          </div>
        </header>

        {/* CALLOUT: HOW TO EVALUATE */}
        <Callout>
          <div className="flex flex-col gap-2">
            <div className="font-medium">Short on time? Here&apos;s the three-minute version.</div>
            <ol className="list-decimal pl-5">
              <li>
                Skim the{" "}
                <Link className="underline" href="/cv">
                  CV
                </Link>{" "}
                for scope, impact, and the numbers from eighteen months of enterprise delivery.
              </li>
              <li>
                Open a project in{" "}
                <Link className="underline" href="/projects">
                  Work
                </Link>{" "}
                and inspect how it was actually built, not just what it does.
              </li>
              <li>
                Verify any of it in the{" "}
                <a
                  className="underline"
                  href={docsUrl("projects/portfolio-app/")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  engineering docs
                </a>{" "}
                where architecture decisions, threat models, and runbooks back every claim on this
                site.
              </li>
            </ol>
          </div>
        </Callout>
      </ScrollFadeIn>

      {/* SECTIONS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ScrollFadeIn>
          <Section
            title="What you're looking at"
            subtitle="A personal site, built and run like a production service. In practice, that means:"
          >
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                Modern web engineering: Next.js App Router, React, and TypeScript in strict mode.
                The current stack, used the way it&apos;s meant to be used.
              </li>
              <li>
                Real delivery discipline: every change moves through pull-request review and
                automated quality gates before it ships. Nothing reaches production unchecked.
              </li>
              <li>
                Security treated as a requirement: hardened HTTP headers, a content security policy,
                supply-chain monitoring, and a written threat model. Not an afterthought.
              </li>
              <li>
                Built to be operated: deploy and rollback runbooks, performance budgets, and a plan
                for when something breaks. Because in production, something always does.
              </li>
            </ul>
          </Section>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <Section
            title="Eighteen months at OCAD University, by the numbers"
            subtitle="Enterprise delivery, stakeholder by stakeholder, system by system. The full story is in the CV."
          >
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                2,500+ users served by the cloud print platform I led, across all sites on the
                Toronto campus.{" "}
                <a
                  className="underline"
                  href={docsUrl("10-architecture/adr/")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See architecture decisions
                </a>
              </li>
              <li>
                50% drop in print-related support tickets within three months of launch.{" "}
                <a
                  className="underline"
                  href={docsUrl("40-security/threat-models/")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Review threat models
                </a>
              </li>
              <li>
                150+ enterprise services documented and brought under a continuity plan.{" "}
                <a
                  className="underline"
                  href={docsUrl("50-operations/runbooks/")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View runbooks
                </a>
              </li>
              <li>
                $10K / yr in licensing cost eliminated by the migration I delivered.{" "}
                <a
                  className="underline"
                  href={docsUrl("00-portfolio/roadmap")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore the roadmap
                </a>
              </li>
            </ul>
          </Section>
        </ScrollFadeIn>

        <ScrollFadeIn delay={200}>
          <Section
            title="Selected work"
            subtitle="Two live systems you can inspect end to end. More in the full work index."
          >
            <div className="flex flex-col gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="font-medium">This site</div>
                <div className="mt-1 text-zinc-600 dark:text-zinc-400">
                  A Next.js and TypeScript application, built and operated like production software.
                  Pull-request workflow, automated testing across two browsers, security hardening,
                  and a three-stage deployment pipeline.
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    className="underline"
                    href={docsUrl("projects/portfolio-docs-app/")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    How it&apos;s built
                  </a>
                  <a
                    className="underline"
                    href={docsUrl("architecture/adr/")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Threat model
                  </a>
                  <a
                    className="underline"
                    href={docsUrl("operations/runbooks/")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Operational runbooks
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="font-medium">The engineering docs</div>
                <div className="mt-1 text-zinc-600 dark:text-zinc-400">
                  A companion documentation system holding the architecture decisions, threat
                  models, and operational runbooks behind every claim on this site. Sixteen-plus
                  ADRs and counting.
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    className="underline"
                    href={docsUrl("projects/portfolio-app/")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the docs
                  </a>
                  <a
                    className="underline"
                    href={docsUrl("security/threat-models/portfolio-app-threat-model")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Architecture decisions
                  </a>
                </div>
              </div>
            </div>
          </Section>
        </ScrollFadeIn>

        <ScrollFadeIn delay={300}>
          <Section
            title="Let's talk."
            subtitle="I'm looking for a full-stack role where both engineering discipline and a track record of modernizing how work gets done matter."
          >
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>If that sounds like your team, I&apos;d like to hear from you.</li>
              <li>Get in touch.</li>
              <li>View the CV and GitHub for additional context.</li>
            </ul>
            <div className="mt-4">
              <a
                className="underline"
                href={docsUrl("00-portfolio/roadmap")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get in touch
              </a>
            </div>
          </Section>
        </ScrollFadeIn>
      </div>
    </div>
  );
}
