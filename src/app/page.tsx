// src/app/page.tsx
import Link from "next/link";
import { Callout } from "@/components/Callout";
import { Section } from "@/components/Section";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { DOCS_BASE_URL, docsUrl } from "@/lib/config";

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
            Confidence across the whole stack. Intention at every layer.
          </h1>

          <p className="max-w-3xl text-base text-zinc-700 dark:text-zinc-300">
            Full-stack developer with a background leading enterprise technology projects. I&apos;ve
            focused my career on modernizing systems and improving processes. I build and deliver to
            an enterprise standard: tested, secured, documented, and shipped through a real
            pipeline. Take a look around. The proof is one click deep.
          </p>

          {/* PRIMARY CTA ROW */}
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton href="/projects">See the work</PrimaryButton>
            <SecondaryLink href="/cv">Read the CV</SecondaryLink>
            <a
              className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              href={DOCS_BASE_URL}
            >
              Review the Portfolio Engineering Docs
            </a>
          </div>
          <br />
          {/* EXTERNAL LINKS */}
          {/* <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            {GITHUB_URL ? (
              <a className="hover:text-zinc-950 dark:hover:text-white" href={GITHUB_URL}>
                GitHub
              </a>
            ) : null}
            {LINKEDIN_URL ? (
              <a className="hover:text-zinc-950 dark:hover:text-white" href={LINKEDIN_URL}>
                LinkedIn
              </a>
            ) : null}
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span>Enterprise delivery, with proof one click deep</span>
          </div> */}
        </header>

        {/* CALLOUT: HOW TO EVALUATE */}
        <Callout>
          <div className="flex flex-col gap-2">
            <Section
              title="Evaluation Path"
              subtitle="Short on time? Here's the three-minute version:"
            >
              <ol className="list-decimal pl-5">
                <li>
                  <strong>
                    Skim the{" "}
                    <Link className="underline" href="/cv">
                      CV
                    </Link>{" "}
                  </strong>
                  : Scope, impact, and enterprise delivery by the numbers.
                </li>
                <li>
                  <strong>
                    Open a project in{" "}
                    <Link className="underline" href="/projects">
                      Work
                    </Link>{" "}
                  </strong>
                  : Each one links to how it was actually built, not just what it does.
                </li>
                <li>
                  <strong>
                    Dig a little deeper in the{" "}
                    <a className="underline" href={docsUrl("projects/portfolio-app/")}>
                      Engineering Docs
                    </a>{" "}
                  </strong>
                  : The docs hold the architecture decisions, threat models, and runbooks behind
                  every feature on this site.
                </li>
              </ol>
            </Section>
          </div>
        </Callout>
      </ScrollFadeIn>

      {/* SECTIONS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ScrollFadeIn>
          <Section
            title="Definining Quality"
            subtitle="This site is a personal project, built and run like a production service. Here's what that means in practice:"
          >
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                <strong>Range Across the Stack</strong>
                <br />
                Next.js App Router, React, and TypeScript on the front; APIs, data, and cloud
                deployment behind them. Confidence and intentionality at every layer.
              </li>
              <li>
                <strong>Decisions That Hold Up</strong>
                <br />
                Every meaningful choice gets reasoned through and written down, so the system stays
                understandable as it grows. That&apos;s the difference between code that works and
                code a team can live with.
              </li>
              <li>
                <strong>Security as a Starting Point</strong>
                <br />
                Hardened HTTP headers, content security policy, supply-chain monitoring, and a
                threat model. Built in from the first commit, not bolted on later.
              </li>
              <li>
                <strong>Built to be Operated</strong>
                <br />
                Deploy and rollback runbooks, performance budgets, and a plan for when something
                breaks. Because in production, something always does.
              </li>
            </ul>
          </Section>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <Section
            title="By the numbers"
            subtitle="Enterprise delivery, stakeholder by stakeholder, system by system. The full story is in the CV."
          >
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                2,500+ users served by the cloud print platform I led, across the Toronto-wide
                campus.
              </li>
              <li>50% reduction in print-related support tickets within three months of launch.</li>
              <li>
                150+ enterprise services I documented and brought under a robust Disaster Recovery
                and Business Continuity Plan.
              </li>
              <li>
                $10K / year in licensing cost and admin overhead eliminated by the migration I
                delivered.
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
                  <a className="underline" href={docsUrl("projects/portfolio-docs-app/")}>
                    → How it&apos;s built
                  </a>
                  <a className="underline" href={docsUrl("architecture/adr/")}>
                    → Threat model
                  </a>
                  <a className="underline" href={docsUrl("operations/runbooks/")}>
                    → Operational runbooks
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="font-medium">The engineering docs</div>
                <div className="mt-1 text-zinc-600 dark:text-zinc-400">
                  A companion documentation system holding the architecture decisions, threat
                  models, and operational runbooks behind every claim on this site.
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a className="underline" href={docsUrl("projects/portfolio-app/")}>
                    → Read the docs
                  </a>
                  <a
                    className="underline"
                    href={docsUrl("security/threat-models/portfolio-app-threat-model")}
                  >
                    → Architecture decisions
                  </a>
                </div>
              </div>
            </div>
          </Section>
        </ScrollFadeIn>

        <ScrollFadeIn delay={300}>
          <Section title="Let's talk." subtitle="">
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              I&apos;m looking for a full-stack role where engineering judgment and a track record
              of modernizing how work gets done both matter.
              <br />
              <br />
              If that sounds like your team, I&apos;d like to hear from you. And yes, everything on
              this site is open source, so look as closely as you like.
              <br />
              <br />
              View the{" "}
              <Link className="underline" href="/cv">
                CV
              </Link>{" "}
              and{" "}
              <Link className="underline" href={DOCS_BASE_URL}>
                GitHub
              </Link>{" "}
              for additional context.
              <br />
            </ul>
            <div className="mt-4">
              <Link className="underline" href="/contact">
                Get in touch
              </Link>{" "}
            </div>
          </Section>
        </ScrollFadeIn>
      </div>
    </div>
  );
}
