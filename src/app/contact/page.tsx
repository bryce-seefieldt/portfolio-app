// src/app/contact/page.tsx
import { Section } from "@/components/Section";
import {
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  mailtoUrl,
} from "@/lib/config";

function ContactLink({
  href,
  label,
  sublabel,
}: {
  href: string;
  label: string;
  sublabel?: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col gap-1 rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
    >
      <div className="font-medium">{label}</div>
      {sublabel ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">{sublabel}</div>
      ) : null}
    </a>
  );
}

export default function ContactPage() {
  const hasAny = Boolean(CONTACT_EMAIL || GITHUB_URL || LINKEDIN_URL);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="max-w-3xl text-zinc-700 dark:text-zinc-300">
          This portfolio intentionally avoids a backend contact form (no auth, no
          form processing) to keep the surface area minimal and public-safe. Use
          one of the methods below.
        </p>
      </header>

      <Section
        title="Preferred contact methods"
        subtitle="Static links only. No accounts or tokens are required."
      >
        {hasAny ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {LINKEDIN_URL ? (
              <ContactLink
                href={LINKEDIN_URL}
                label="LinkedIn"
                sublabel="Best for professional introductions and context."
              />
            ) : null}

            {GITHUB_URL ? (
              <ContactLink
                href={GITHUB_URL}
                label="GitHub"
                sublabel="Best for technical discussions and reviewing code."
              />
            ) : null}

            {CONTACT_EMAIL ? (
              <ContactLink
                href={mailtoUrl(CONTACT_EMAIL, "Portfolio inquiry")}
                label="Email"
                sublabel="Mailto link (no form)."
              />
            ) : null}
          </div>
        ) : (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            No contact links are configured yet. Set one or more of the following
            environment variables:
            <ul className="mt-2 list-disc pl-5">
              <li>
                <code>NEXT_PUBLIC_LINKEDIN_URL</code>
              </li>
              <li>
                <code>NEXT_PUBLIC_GITHUB_URL</code>
              </li>
              <li>
                <code>NEXT_PUBLIC_CONTACT_EMAIL</code>
              </li>
            </ul>
          </div>
        )}
      </Section>

      <Section title="Response expectations" subtitle="Set clear expectations for reviewers.">
        <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>I typically respond within a reasonable timeframe.</li>
          <li>
            For technical discussions, include links to the relevant project page
            and (if applicable) the evidence dossier.
          </li>
          <li>
            If you’re reviewing for a role, include the role title and the key
            requirements you’d like mapped to evidence.
          </li>
        </ul>
      </Section>
    </div>
  );
}
