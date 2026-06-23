import Link from "next/link";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { GITHUB_BASE_URL, LINKEDIN_URL, DOCS_BASE_URL } from "@/lib/config";

export default function CVPage() {
  return (
    <main className="flex flex-col gap-8">
      <ScrollFadeIn>
        <header className="flex flex-col gap-4">

          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Full-Stack Developer
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {GITHUB_BASE_URL ? (
              <a
                className="font-medium underline"
                href={GITHUB_BASE_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            ) : null}
            {LINKEDIN_URL ? (
              <a
                className="font-medium underline"
                href={LINKEDIN_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            ) : null}
            <a
              className="font-medium underline"
              href="https://bryce.seefieldt.ca"
              rel="noopener noreferrer"
              target="_blank"
            >
              Portfolio home
            </a>
            <a className="font-medium underline" download href="/portfolio-app/public/Bryce_Seefieldt_Full_Stack_Developer.pdf">
              Download PDF resume
            </a>
          </div>
        </header>
      </ScrollFadeIn>

      <ScrollFadeIn delay={50}>
        <section className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-tight">Summary</h3>
          <p className="max-w-4xl text-zinc-700 dark:text-zinc-300">
            Full-stack developer who works comfortably across the whole stack, from the interface a
            user clicks to the pipeline that ships it. Eighteen months leading enterprise technology
            projects at OCAD University, reporting directly to the CIO, followed by a self-directed
            production engineering practice. Two decades of prior professional experience taught me
            that good software is mostly good decisions. I build with that in mind: tested, secured,
            documented, and shipped through a real pipeline.
          </p>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={100}>
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold tracking-tight">Experience</h3>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold">IT Services Specialist</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              OCAD University · Toronto, ON · 2024 – 2025
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Co-op placement extended to eighteen months based on performance. Reported directly to
              the CIO, leading three concurrent enterprise transformation initiatives across ten IT
              units.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                Led a campus-wide cloud print infrastructure migration (Microsoft Universal Print),
                moving 50 multifunction printers across 10 buildings to serve 2,500+ users. Cut
                print-related support tickets by 50% within three months and eliminated a
                $10,000-per-year licensing cost.
              </li>
              <li>
                Built the institution&apos;s first formal enterprise-wide Disaster Recovery and
                Business Continuity Planning program from scratch: authored a 25-page overview,
                documented 150+ services in the CMDB with 30+ administrators, and cross-trained 25+
                secondary support admins.
              </li>
              <li>
                Served as internal IT lead for a SaaS e-commerce procurement and deployment
                (OnPrintShop), co-authoring the RFP, business requirements document, and technical
                specification across seven stakeholders, delivered in eight months.
              </li>
              <li>
                Recognized by the CIO for cross-functional communication, documentation standards,
                and stewardship of sensitive systems. Reference letter available.
              </li>
            </ul>
          </article>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Publishing Administrator</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Warner Chappell Music Publishing · Toronto, ON · 2014 – 2022
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                Automated royalty reporting and tracking workflows across a multi-tier publishing
                system, reducing manual processing time and eliminating recurring back-office
                bottlenecks.
              </li>
              <li>
                Project-managed the redesign and global rollout of Warner Chappell&apos;s worldwide
                publishing database and client portal, coordinating across international offices,
                vendors, and internal teams.
              </li>
              <li>Administered a catalogue of one million-plus titles.</li>
              <li>
                Appointed to the CMRRA Canadian Publishers Committee advising on national copyright
                and licensing policy on behalf of publishers, songwriters and rightsholders.
              </li>
            </ul>
          </article>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Founder and Principal Consultant</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Seven:30 Entertainment · Toronto, ON · 1999 – 2022
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                Operated a music and entertainment consulting firm delivering end-to-end project
                management for artist releases, marketing campaigns, and touring operations over two
                decades.
              </li>
              <li>
                Client outcomes included certified gold records, multiple #1 national radio singles,
                Juno nominations, and Canadian Radio Music Awards.
              </li>
              <li>
                Built long-running partnerships with Sony/BMG, Rawkus Records, Red Bull Music
                Academy, and Nike.
              </li>
            </ul>
          </article>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={150}>
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold tracking-tight">Education</h3>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold">
              Honours Bachelor of Technology in Software Development
            </h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Seneca Polytechnic · Toronto, ON · 2020 – 2025
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Four-year, full-time degree covering the full software development lifecycle:
              front-end and back-end web development, mobile development, cloud platforms,
              databases, UI/UX design, information security, Agile project management, and systems
              analysis. Co-op fulfilled through the eighteen-month placement at OCAD University.
            </p>
          </article>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Foundations of Project Management</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              University of Toronto · Toronto, ON · 2013 – 2014
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              PMBOK methodology, project planning, risk management, and stakeholder management.
            </p>
          </article>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Music Production and Engineering</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Harris Institute for the Arts · Toronto, ON · 1999 – 2000
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Music Production, studio and live audio engineering, music theory and music business
              managment.
            </p>
          </article>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={200}>
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold tracking-tight">Technical Skills</h3>

          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Languages:</strong> TypeScript,
              JavaScript, C#, Java, Python, C, C++
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Front End:</strong> Next.js (App
              Router), React 19, Tailwind CSS, Angular, HTML5, CSS3
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Back End:</strong> Node.js, REST
              APIs, GraphQL, .NET
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Databases:</strong> PostgreSQL,
              MS SQL Server, MongoDB, MySQL, SQLite
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Cloud & DevOps:</strong> Vercel,
              Azure (Entra ID, Intune), AWS, GitHub Actions, GitLab Enterprise, Docker, CI/CD
              pipelines
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Practices:</strong> TypeScript
              strict mode, Vitest, Playwright, ESLint, pull-request governance, Architecture
              Decision Records, runbooks, threat modeling (STRIDE), OWASP and CSP, Agile/Scrum
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Design & UX:</strong> Figma,
              UI/UX design, Human-Computer Interaction, WCAG accessibility, responsive design
            </li>
          </ul>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn delay={250}>
        <section className="space-y-3">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Want to see the work behind this? The{" "}
            <Link className="underline" href="/projects">
              projects
            </Link>{" "}
            and{" "}
            <a className="underline" href={DOCS_BASE_URL}
            target="_blank" rel="noopener noreferrer">
              engineering docs
            </a>{" "}
            go deep. Or{" "}
            <Link className="underline" href="/contact">
              get in touch
            </Link>
            .
          </p>

          <section className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">References</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Available on request. Reference letter from the Chief Information Officer, OCAD
              University, available for review.
            </p>
          </section>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
