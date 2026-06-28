interface ReadoutProps {
  value: string | number;
  unit?: string;
  caption: string;
  className?: string;
}

export function Readout({ value, unit, caption, className = "" }: ReadoutProps) {
  const normalizedValue = String(value).trim();
  const compactValue = normalizedValue.length > 8 || /[a-z]/i.test(normalizedValue);

  return (
    <div className={`flex flex-col gap-1 ${className}`.trim()}>
      <div
        className={`text-accent glow-accent ${
          compactValue
            ? "font-mono text-[1rem] leading-tight font-semibold tracking-[0.06em] sm:text-[1.125rem]"
            : "type-readout"
        }`}
      >
        <span>{value}</span>
        {unit ? <span className="text-ink-muted ml-1 align-top text-base">{unit}</span> : null}
      </div>
      <div className="type-label text-ink-muted">{caption}</div>
    </div>
  );
}
