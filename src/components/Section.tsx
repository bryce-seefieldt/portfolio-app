// src/components/Section.tsx
export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line bg-surface rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-ink text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="text-ink-muted text-sm">{subtitle}</p> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
