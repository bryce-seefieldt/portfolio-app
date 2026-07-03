import { ControlButton } from "@/components/ControlButton";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { getFeaturedProjects, PROJECTS } from "@/data/projects";
import { DOCS_BASE_URL } from "@/lib/config";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-line text-ink-muted rounded-full border px-2 py-0.5 text-xs">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label =
    status === "featured"
      ? "Featured"
      : status === "active"
        ? "Active"
        : status === "planned"
          ? "Planned"
          : "Archived";

  return (
    <span className="bg-surface-2 text-ink-muted rounded-full px-2 py-0.5 text-xs font-medium">
      {label}
    </span>
  );
}

export default function ProjectsPage() {
  const featured = getFeaturedProjects();

  return (
    <div className="flex flex-col gap-10 pb-6">
      <ScrollFadeIn>
        <header className="flex flex-col gap-3">
          <LabelTag>SELECTED WORK</LabelTag>
          <h1 className="type-h1 text-ink">The work.</h1>
          <p className="text-ink-muted max-w-3xl text-sm">
            Projects are documented with an evidence-first model. Each project page links to deeper
            artifacts (dossier, ADRs, threat model, runbooks) in the Documentation App where
            applicable.
          </p>
          <div className="text-ink-muted text-sm">
            Evidence engine:{" "}
            <ControlButton href={DOCS_BASE_URL} external className="control-button--compact">
              OPEN DOCUMENTATION APP
            </ControlButton>
          </div>
        </header>
      </ScrollFadeIn>

      <ScrollFadeIn delay={60}>
        <section className="space-y-4">
          <LabelTag>MODULE 00 / FEATURED</LabelTag>
          <h2 className="type-h2 text-ink">Best entry points for reviewers.</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((project) => (
              <Panel
                key={project.slug}
                className="h-full"
                label={`CARD / ${project.title.toUpperCase()}`}
                variant="default"
              >
                <div className="text-ink space-y-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <StatusBadge status={project.status} />
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.slice(0, 4).map((tag) => (
                        <Tag key={`${project.slug}-${tag}`}>{tag}</Tag>
                      ))}
                    </div>
                  </div>

                  <p>{project.summary}</p>

                  <div className="flex flex-wrap gap-2">
                    <ControlButton href={`/projects/${project.slug}`}>VIEW DETAILS</ControlButton>
                    {project.repoUrl ? (
                      <ControlButton href={project.repoUrl} external>
                        REPO
                      </ControlButton>
                    ) : null}
                    {project.demoUrl ? (
                      <ControlButton href={project.demoUrl} external>
                        DEMO
                      </ControlButton>
                    ) : null}
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={120}>
        <section className="space-y-4">
          <LabelTag>MODULE 01 / REGISTRY</LabelTag>
          <h2 className="type-h2 text-ink">All projects.</h2>
          <Panel label="CARD / PROJECT REGISTRY" variant="default">
            <p className="text-ink-muted mb-4 text-sm">
              This list will become filterable once the registry expands.
            </p>
            <div className="space-y-3">
              {PROJECTS.map((project) => (
                <Panel
                  key={project.slug}
                  label={`ENTRY / ${project.slug.toUpperCase()}`}
                  variant="inset"
                  showRivets={false}
                >
                  <div className="text-ink space-y-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{project.title}</p>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-ink-muted">{project.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      <ControlButton href={`/projects/${project.slug}`}>DETAILS</ControlButton>
                      {project.repoUrl ? (
                        <ControlButton href={project.repoUrl} external>
                          REPO
                        </ControlButton>
                      ) : null}
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </Panel>
        </section>
      </ScrollFadeIn>
    </div>
  );
}
