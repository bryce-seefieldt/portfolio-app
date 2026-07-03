import { ControlButton } from "@/components/ControlButton";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";
import { Readout } from "@/components/Readout";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { DOCS_BASE_URL, GITHUB_BASE_URL, LINKEDIN_URL } from "@/lib/config";

export default function CVPage() {
  return (
    <main className="flex flex-col gap-10 pb-6">
      <ScrollFadeIn>
        <header className="flex flex-col gap-4">
          <LabelTag>CURRICULUM VITAE</LabelTag>
          <h1 className="type-h1 text-ink">Bryce Seefieldt</h1>
          <p className="text-ink-muted text-sm">Full-Stack Developer</p>

          <div className="max-w-xs">
            <Readout value="25" unit="yrs" caption="IN TECHNOLOGY" />
          </div>

          <div className="flex flex-wrap gap-2">
            {GITHUB_BASE_URL ? (
              <ControlButton href={GITHUB_BASE_URL} external>
                GITHUB
              </ControlButton>
            ) : null}
            {LINKEDIN_URL ? (
              <ControlButton href={LINKEDIN_URL} external>
                LINKEDIN
              </ControlButton>
            ) : null}
            <ControlButton
              href="/Bryce_Seefieldt_Full_Stack_Developer.pdf"
              className="control-button--compact"
            >
              DOWNLOAD PDF
            </ControlButton>
          </div>
        </header>
      </ScrollFadeIn>

      <ScrollFadeIn delay={60}>
        <section className="space-y-4">
          <LabelTag>MODULE 00 / SUMMARY</LabelTag>
          <h2 className="type-h2 text-ink">Professional summary.</h2>
          <Panel label="CARD / SUMMARY" variant="default">
            <p className="text-ink-muted max-w-4xl text-sm">
              Full-stack developer who works comfortably across the whole stack, from the interface
              a user clicks to the pipeline that ships it. Eighteen months leading enterprise
              technology projects at OCAD University, reporting directly to the CIO, followed by a
              self-directed production engineering practice. Two decades of prior professional
              experience taught me that good software is mostly good decisions. I build with that in
              mind: tested, secured, documented, and shipped through a real pipeline.
            </p>
          </Panel>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={120}>
        <section className="space-y-4">
          <LabelTag>MODULE 01 / EXPERIENCE</LabelTag>
          <h2 className="type-h2 text-ink">Experience.</h2>
          <Panel label="CARD / EXPERIENCE" variant="default">
            <div className="space-y-3">
              <Panel label="ROLE / IT SERVICES SPECIALIST" variant="inset" showRivets={false}>
                <h3 className="text-ink text-xl font-semibold">IT Services Specialist</h3>
                <p className="text-ink-muted text-sm">
                  OCAD University - Toronto, ON - 2024 to 2025
                </p>
                <p className="text-ink-muted text-sm">
                  Co-op placement extended to eighteen months based on performance. Reported
                  directly to the CIO, leading three concurrent enterprise transformation
                  initiatives across ten IT units.
                </p>
                <ul className="text-ink-muted list-disc space-y-2 pl-5 text-sm">
                  <li>
                    Led a campus-wide cloud print infrastructure migration (Microsoft Universal
                    Print), moving 50 multifunction printers across 10 buildings to serve 2,500+
                    users. Cut print-related support tickets by 50% within three months and
                    eliminated a $10,000-per-year licensing cost.
                  </li>
                  <li>
                    Built the institution&apos;s first formal enterprise-wide Disaster Recovery and
                    Business Continuity Planning program from scratch: authored a 25-page overview,
                    documented 150+ services in the CMDB with 30+ administrators, and cross-trained
                    25+ secondary support admins.
                  </li>
                  <li>
                    Served as internal IT lead for a SaaS e-commerce procurement and deployment
                    (OnPrintShop), co-authoring the RFP, business requirements document, and
                    technical specification across seven stakeholders, delivered in eight months.
                  </li>
                  <li>
                    Recognized by the CIO for cross-functional communication, documentation
                    standards, and stewardship of sensitive systems. Reference letter available.
                  </li>
                </ul>
              </Panel>

              <Panel label="ROLE / PUBLISHING ADMINISTRATOR" variant="inset" showRivets={false}>
                <h3 className="text-ink text-xl font-semibold">Publishing Administrator</h3>
                <p className="text-ink-muted text-sm">
                  Warner Chappell Music Publishing - Toronto, ON - 2014 to 2022
                </p>
                <ul className="text-ink-muted list-disc space-y-2 pl-5 text-sm">
                  <li>
                    Automated royalty reporting and tracking workflows across a multi-tier
                    publishing system, reducing manual processing time and eliminating recurring
                    back-office bottlenecks.
                  </li>
                  <li>
                    Project-managed the redesign and global rollout of Warner Chappell&apos;s
                    worldwide publishing database and client portal, coordinating across
                    international offices, vendors, and internal teams.
                  </li>
                  <li>Administered a catalogue of one million-plus titles.</li>
                  <li>
                    Appointed to the CMRRA Canadian Publishers Committee advising on national
                    copyright and licensing policy on behalf of publishers, songwriters and
                    rightsholders.
                  </li>
                </ul>
              </Panel>

              <Panel
                label="ROLE / FOUNDER AND PRINCIPAL CONSULTANT"
                variant="inset"
                showRivets={false}
              >
                <h3 className="text-ink text-xl font-semibold">Founder and Principal Consultant</h3>
                <p className="text-ink-muted text-sm">
                  Seven:30 Entertainment - Toronto, ON - 1999 to 2022
                </p>
                <ul className="text-ink-muted list-disc space-y-2 pl-5 text-sm">
                  <li>
                    Operated a music and entertainment consulting firm delivering end-to-end project
                    management for artist releases, marketing campaigns, and touring operations over
                    two decades.
                  </li>
                  <li>
                    Client outcomes included certified gold records, multiple #1 national radio
                    singles, Juno nominations, and Canadian Radio Music Awards.
                  </li>
                  <li>
                    Built long-running partnerships with Sony/BMG, Rawkus Records, Red Bull Music
                    Academy, and Nike.
                  </li>
                </ul>
              </Panel>
            </div>
          </Panel>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={180}>
        <section className="space-y-4">
          <LabelTag>MODULE 02 / EDUCATION</LabelTag>
          <h2 className="type-h2 text-ink">Education.</h2>
          <Panel label="CARD / EDUCATION" variant="default">
            <div className="space-y-3">
              <Panel
                label="PROGRAM / HONOURS BACHELOR OF TECHNOLOGY"
                variant="inset"
                showRivets={false}
              >
                <h3 className="text-ink text-xl font-semibold">
                  Honours Bachelor of Technology in Software Development
                </h3>
                <p className="text-ink-muted text-sm">
                  Seneca Polytechnic - Toronto, ON - 2020 to 2025
                </p>
                <p className="text-ink-muted text-sm">
                  Four-year, full-time degree covering the full software development lifecycle:
                  front-end and back-end web development, mobile development, cloud platforms,
                  databases, UI/UX design, information security, Agile project management, and
                  systems analysis. Co-op fulfilled through the eighteen-month placement at OCAD
                  University.
                </p>
              </Panel>

              <Panel
                label="PROGRAM / FOUNDATIONS OF PROJECT MANAGEMENT"
                variant="inset"
                showRivets={false}
              >
                <h3 className="text-ink text-xl font-semibold">
                  Foundations of Project Management
                </h3>
                <p className="text-ink-muted text-sm">
                  University of Toronto - Toronto, ON - 2013 to 2014
                </p>
                <p className="text-ink-muted text-sm">
                  PMBOK methodology, project planning, risk management, and stakeholder management.
                </p>
              </Panel>

              <Panel
                label="PROGRAM / MUSIC PRODUCTION AND ENGINEERING"
                variant="inset"
                showRivets={false}
              >
                <h3 className="text-ink text-xl font-semibold">Music Production and Engineering</h3>
                <p className="text-ink-muted text-sm">
                  Harris Institute for the Arts - Toronto, ON - 1999 to 2000
                </p>
                <p className="text-ink-muted text-sm">
                  Music Production, studio and live audio engineering, music theory and music
                  business managment.
                </p>
              </Panel>
            </div>
          </Panel>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={220}>
        <section className="space-y-4">
          <LabelTag>MODULE 03 / TECHNICAL SKILLS</LabelTag>
          <h2 className="type-h2 text-ink">Skills matrix.</h2>
          <Panel label="CARD / TECHNICAL SKILLS" variant="default">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {["TypeScript", "JavaScript", "C#", "Java", "Python", "C", "C++"].map((item) => (
                    <LabelTag key={item}>{item}</LabelTag>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">Front End</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Next.js (App Router)",
                    "React 19",
                    "Tailwind CSS",
                    "Angular",
                    "HTML5",
                    "CSS3",
                  ].map((item) => (
                    <LabelTag key={item}>{item}</LabelTag>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">Back End</p>
                <div className="flex flex-wrap gap-2">
                  {["Node.js", "REST APIs", "GraphQL", ".NET"].map((item) => (
                    <LabelTag key={item}>{item}</LabelTag>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">Databases</p>
                <div className="flex flex-wrap gap-2">
                  {["PostgreSQL", "MS SQL Server", "MongoDB", "MySQL", "SQLite"].map((item) => (
                    <LabelTag key={item}>{item}</LabelTag>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">Cloud and DevOps</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Vercel",
                    "Azure (Entra ID, Intune)",
                    "AWS",
                    "GitHub Actions",
                    "GitLab Enterprise",
                    "Docker",
                    "CI/CD pipelines",
                  ].map((item) => (
                    <LabelTag key={item}>{item}</LabelTag>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">Practices</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "TypeScript strict mode",
                    "Vitest",
                    "Playwright",
                    "ESLint",
                    "Pull-request governance",
                    "Architecture Decision Records",
                    "Runbooks",
                    "Threat modeling (STRIDE)",
                    "OWASP and CSP",
                    "Agile/Scrum",
                  ].map((item) => (
                    <LabelTag key={item}>{item}</LabelTag>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-ink text-sm font-medium">Design and UX</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Figma",
                    "UI/UX design",
                    "Human-Computer Interaction",
                    "WCAG accessibility",
                    "Responsive design",
                  ].map((item) => (
                    <LabelTag key={item}>{item}</LabelTag>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={260}>
        <section className="space-y-4">
          <LabelTag>MODULE 04 / REFERENCES</LabelTag>
          <h2 className="type-h2 text-ink">References.</h2>
          <Panel label="CARD / REFERENCES" variant="default">
            <div className="space-y-3">
              <p className="text-ink-muted text-sm">
                Want to see the work behind this? The projects and engineering docs go deep. Or get
                in touch.
              </p>
              <div className="flex flex-wrap gap-2">
                <ControlButton href="/projects">PROJECTS</ControlButton>
                <ControlButton href={DOCS_BASE_URL} external>
                  ENGINEERING DOCS
                </ControlButton>
                <ControlButton href="/contact">GET IN TOUCH</ControlButton>
              </div>
              <p className="text-ink-muted text-sm">
                Available on request. Reference letter from the Chief Information Officer, OCAD
                University, available for review.
              </p>
            </div>
          </Panel>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
