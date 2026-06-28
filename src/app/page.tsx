// src/app/page.tsx
import Link from "next/link";
import { ControlButton } from "@/components/ControlButton";
import { Dial } from "@/components/Dial";
import { DeployPipeline } from "@/components/DeployPipeline";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";
import { Readout } from "@/components/Readout";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { OperatingPrinciplesPanel } from "@/components/home/OperatingPrinciplesPanel";
import { ByTheNumbersCluster } from "@/components/home/ByTheNumbersCluster";
import { CareerEraCards } from "@/components/home/CareerEraCards";
import { DOCS_BASE_URL, docsUrl, GITHUB_BASE_URL } from "@/lib/config";

export default function HomePage() {
  const githubHref = GITHUB_BASE_URL ?? "https://github.com/bryce-seefieldt";

  return (
    <div className="flex flex-col gap-10 pb-6">
      {/* HERO */}
      <ScrollFadeIn>
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
          <header className="flex flex-col gap-4">
            <p className="type-label text-ink-muted">
              25 YEARS OF PROFESSIONAL EXPERIENCE · FOCUSED ON SOFTWARE SINCE 2020
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Confidence across the whole stack.{" "}
              <span className="text-accent glow-accent">Intention</span> at every layer.
            </h1>

            <p className="type-body text-ink max-w-3xl">
              Full-stack developer with a background leading enterprise technology projects.
              I&apos;ve focused my career on modernizing systems and improving processes. I build
              and deliver to an enterprise standard: tested, secured, documented, and shipped
              through a real pipeline. Take a look around. The proof is one click deep.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <ControlButton href="/projects">WORK</ControlButton>
              <ControlButton href="/cv">CV</ControlButton>
              <ControlButton href={DOCS_BASE_URL} external>
                DOCS
              </ControlButton>
            </div>
          </header>

          <Panel label="MODULE 00 / DEVELOPER" className="h-fit" variant="default">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <LabelTag tone="accent">BRYCE SEEFIELDT</LabelTag>
                <LabelTag>PANEL: CONTROL BUS</LabelTag>
                <LabelTag tone="warn">TORONTO, CANADA</LabelTag>
              </div>

              <div className="space-y-2">
                <p className="type-label text-ink-muted">DEPLOY PIPELINE</p>
                <DeployPipeline />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                <Readout value="OPERATIONAL" caption="DEPLOY STATUS" />
                <Readout value="~1" unit="min" caption="ROLLBACK MTTR" />
                <div className="justify-self-start sm:justify-self-end" aria-hidden="true">
                  <Dial value={74} caption="PIPELINE LOAD" />
                </div>
              </div>
            </div>
          </Panel>
        </section>
      </ScrollFadeIn>

      {/* MODULE 01 */}
      <ScrollFadeIn>
        <section className="space-y-4">
          <LabelTag>MODULE 01 / THE ARC</LabelTag>
          <h2 className="type-h2 text-ink">Twenty-five years, one throughline.</h2>
          <div className="signal-path-rail" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="text-ink max-w-4xl space-y-4 text-base">
            <p>
              I spent the first two decades of my career in music and entertainment, then in
              enterprise publishing, then in university IT. Different industries, same instinct: I
              kept finding the broken process, the manual workaround everyone had stopped
              questioning, the thing that should be automated but wasn&apos;t. For years I fixed
              those the way I could, with better systems, better coordination, better tools.
            </p>
            <p>
              Then at Warner Chappell Music Publishing I automated a reporting process that five
              international offices had been doing by hand for years, and watched 45-plus hours of
              weekly manual work simply disappear. That was the moment. Software wasn&apos;t just a
              tool for the job, it was the most powerful version of the thing I&apos;d always done.
              So I went and learned it properly: a four-year honours degree, eighteen months of
              enterprise IT delivery, and six years of building, every day, to a real standard.
            </p>
            <p>
              I&apos;m not a career-changer who left one thing for another. I&apos;m the same person
              I always was, finding what&apos;s broken and fixing it, with a much better set of
              tools now.
            </p>
          </div>
        </section>
      </ScrollFadeIn>

      {/* MODULE 02 */}
      <ScrollFadeIn delay={60}>
        <section className="space-y-4">
          <LabelTag>MODULE 02 / OPERATING PRINCIPLES</LabelTag>
          <h2 className="type-h2 text-ink">How I work.</h2>
          <OperatingPrinciplesPanel />
        </section>
      </ScrollFadeIn>

      {/* MODULE 03 */}
      <ScrollFadeIn delay={120}>
        <section className="space-y-4">
          <LabelTag>MODULE 03 / BY THE NUMBERS</LabelTag>
          <h2 className="type-h2 text-ink">By the numbers.</h2>
          <p className="text-ink-muted max-w-3xl text-sm">
            Enterprise delivery, a creative career, and a production engineering practice. Read
            across the panel.
          </p>
          <ByTheNumbersCluster />
        </section>
      </ScrollFadeIn>

      {/* MODULE 04 */}
      <ScrollFadeIn delay={180}>
        <section className="space-y-4">
          <LabelTag>MODULE 04 / CAREER HIGHLIGHTS</LabelTag>
          <h2 className="type-h2 text-ink">The long version, in four movements.</h2>
          <CareerEraCards />
        </section>
      </ScrollFadeIn>

      {/* MODULE 05 */}
      <ScrollFadeIn delay={220}>
        <section className="space-y-4">
          <LabelTag>MODULE 05 / SELECTED WORK</LabelTag>
          <h2 className="type-h2 text-ink">Two live systems you can inspect end to end.</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Panel className="h-full" label="CARD / PORTFOLIO APP" variant="default">
              <div className="text-ink space-y-3 text-sm">
                <p>
                  A Next.js and TypeScript application built and operated like production software:
                  PR workflow, automated testing, security hardening, and staged delivery.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    className="control-link"
                    href={docsUrl("projects/portfolio-docs-app/")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    How it&apos;s built
                  </a>
                  <a
                    className="control-link"
                    href={docsUrl("security/threat-models/portfolio-app-threat-model")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Threat model
                  </a>
                  <a
                    className="control-link"
                    href={docsUrl("operations/runbooks/")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Operational runbooks
                  </a>
                </div>
              </div>
            </Panel>

            <Panel className="h-full" label="CARD / ENGINEERING DOCS" variant="default">
              <div className="text-ink space-y-3 text-sm">
                <p>
                  A companion system with architecture decisions, threat models, and operations
                  evidence behind each implementation claim.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    className="control-link"
                    href={docsUrl("projects/portfolio-app/")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the docs
                  </a>
                  <a
                    className="control-link"
                    href={docsUrl("architecture/adr/")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Architecture decisions
                  </a>
                </div>
              </div>
            </Panel>

            <Panel className="h-full opacity-85" label="CARD / RESERVED" variant="default">
              <div className="text-ink-muted flex h-full flex-col items-start justify-between gap-4 text-sm">
                <p>Reserved for the planned AI demo system.</p>
                <LabelTag>SLOT OPEN</LabelTag>
              </div>
            </Panel>
          </div>
        </section>
      </ScrollFadeIn>

      {/* MODULE 06 */}
      <ScrollFadeIn delay={260}>
        <section className="space-y-4">
          <LabelTag>MODULE 06 / CONTACT</LabelTag>
          <h2 className="type-h2 text-ink">Let&apos;s talk.</h2>
          <div className="text-ink max-w-3xl space-y-3 text-base">
            <p>
              I&apos;m looking for a full-stack role where engineering judgment and a track record
              of modernizing how work gets done both matter. If that sounds like your team, I&apos;d
              like to hear from you.
            </p>
            <p>Everything on this site is open source, so look as closely as you like.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <ControlButton href="/contact">GET IN TOUCH</ControlButton>
            <ControlButton href="/cv">CV</ControlButton>
            <ControlButton href={githubHref} external>
              GITHUB
            </ControlButton>
            <ControlButton href={DOCS_BASE_URL} external>
              DOCS
            </ControlButton>
          </div>
          <p className="text-ink-muted text-sm">
            Direct links: <Link href="/cv">CV</Link> ·{" "}
            <Link href={githubHref} target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
          </p>
        </section>
      </ScrollFadeIn>
    </div>
  );
}
