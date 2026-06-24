interface ReadoutProps {
  value: string | number;
  unit?: string;
  caption: string;
  className?: string;
}

export function Readout({ value, unit, caption, className = "" }: ReadoutProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`.trim()}>
      <div className="type-readout text-accent glow-accent">
        <span>{value}</span>
        {unit ? <span className="text-ink-muted ml-1 align-top text-base">{unit}</span> : null}
      </div>
      <div className="type-label text-ink-muted">{caption}</div>
    </div>
  );
}
