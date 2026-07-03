import { ControlButton } from "@/components/ControlButton";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";
import { Readout } from "@/components/Readout";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { CONTACT_EMAIL, GITHUB_BASE_URL, LINKEDIN_URL, mailtoUrl } from "@/lib/config";

export default function ContactPage() {
  const hasAny = Boolean(CONTACT_EMAIL || GITHUB_BASE_URL || LINKEDIN_URL);

  return (
    <div className="flex flex-col gap-10 pb-6">
      <ScrollFadeIn>
        <header className="flex flex-col gap-3">
          <LabelTag>CONTACT</LabelTag>
          <h1 className="type-h1 text-ink">Get in touch.</h1>
          <p className="text-ink-muted max-w-3xl text-sm">
            This portfolio intentionally avoids a backend contact form (no auth, no form processing)
            to keep the surface area minimal and public-safe. Use one of the methods below.
          </p>
        </header>
      </ScrollFadeIn>

      <ScrollFadeIn delay={60}>
        <section className="space-y-4">
          <LabelTag>MODULE 00 / CONTACT CHANNELS</LabelTag>
          <h2 className="type-h2 text-ink">Preferred contact methods.</h2>
          <Panel label="CARD / CHANNEL MATRIX" variant="default">
            {hasAny ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="bg-surface-2 border-line rounded-md border p-3">
                    <p className="text-ink mb-2 text-sm font-medium">Curriculum Vitae</p>
                    <p className="text-ink-muted mb-3 text-sm">
                      Downloadable and web-view versions.
                    </p>
                    <ControlButton href="/cv">OPEN CV</ControlButton>
                  </div>

                  {LINKEDIN_URL ? (
                    <div className="bg-surface-2 border-line rounded-md border p-3">
                      <p className="text-ink mb-2 text-sm font-medium">LinkedIn</p>
                      <p className="text-ink-muted mb-3 text-sm">
                        Best for professional introductions and context.
                      </p>
                      <ControlButton href={LINKEDIN_URL} external>
                        OPEN LINKEDIN
                      </ControlButton>
                    </div>
                  ) : null}

                  {GITHUB_BASE_URL ? (
                    <div className="bg-surface-2 border-line rounded-md border p-3">
                      <p className="text-ink mb-2 text-sm font-medium">GitHub</p>
                      <p className="text-ink-muted mb-3 text-sm">
                        Best for technical discussions and code review context.
                      </p>
                      <ControlButton href={GITHUB_BASE_URL} external>
                        OPEN GITHUB
                      </ControlButton>
                    </div>
                  ) : null}

                  {CONTACT_EMAIL ? (
                    <div className="bg-surface-2 border-line rounded-md border p-3 sm:col-span-2">
                      <p className="text-ink mb-2 text-sm font-medium">Email</p>
                      <p className="text-ink-muted mb-3 text-sm">Direct mailto link.</p>
                      <ControlButton href={mailtoUrl(CONTACT_EMAIL, "Portfolio inquiry")}>
                        OPEN EMAIL
                      </ControlButton>
                    </div>
                  ) : null}
                </div>

                <p className="text-ink-muted text-sm">
                  Static links only. No accounts or tokens are required.
                </p>
              </div>
            ) : (
              <div className="text-ink-muted space-y-2 text-sm">
                <p>
                  UPDATED REQUIRED: No contact links are configured yet. Set one or more of the
                  following environment variables:
                </p>
                <ul className="list-disc pl-5">
                  <li>
                    <code>NEXT_PUBLIC_LINKEDIN_URL</code>
                  </li>
                  <li>
                    <code>NEXT_PUBLIC_GITHUB_BASE_URL</code>
                  </li>
                  <li>
                    <code>NEXT_PUBLIC_CONTACT_EMAIL</code>
                  </li>
                </ul>
              </div>
            )}
          </Panel>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={120}>
        <section className="space-y-4">
          <LabelTag>MODULE 01 / RESPONSE WINDOW</LabelTag>
          <h2 className="type-h2 text-ink">Response expectations.</h2>
          <Panel label="CARD / RESPONSE EXPECTATIONS" variant="default">
            <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
              <Readout value="~48" unit="h" caption="TYPICAL RESPONSE" />
              <ul className="text-ink-muted list-disc space-y-2 pl-5 text-sm">
                <li>I typically respond within a reasonable timeframe.</li>
                <li>
                  For technical discussions, include links to the relevant project page and (if
                  applicable) the evidence dossier.
                </li>
                <li>
                  If you&apos;re reviewing for a role, include the role title and the key
                  requirements you&apos;d like mapped to evidence.
                </li>
              </ul>
            </div>
          </Panel>
        </section>
      </ScrollFadeIn>
    </div>
  );
}
