// src/components/Callout.tsx
export function Callout({
  children,
  type = "default",
}: {
  children: React.ReactNode;
  type?: "default" | "info";
}) {
  const defaultStyle = "rounded-2xl border border-line bg-surface p-5 text-sm text-ink";
  const infoStyle = "rounded-2xl border border-accent bg-surface-2 p-5 text-sm text-ink";
  const className = type === "info" ? infoStyle : defaultStyle;

  return <div className={className}>{children}</div>;
}
