// src/components/Callout.tsx
export function Callout({
  children,
  type = "default",
}: {
  children: React.ReactNode;
  type?: "default" | "info";
}) {
  const defaultStyle =
    "rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200";
  const infoStyle =
    "rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100";
  const className = type === "info" ? infoStyle : defaultStyle;

  return <div className={className}>{children}</div>;
}
