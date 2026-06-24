interface DialProps {
  value: number;
  caption?: string;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function Dial({ value, caption, className = "" }: DialProps) {
  const safeValue = clamp(value, 0, 100);
  const angle = -120 + (safeValue / 100) * 240;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`.trim()}>
      <svg width="86" height="86" viewBox="0 0 86 86" className="text-line" aria-hidden="true">
        <circle cx="43" cy="43" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle
          cx="43"
          cy="43"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />

        {Array.from({ length: 11 }).map((_, idx) => {
          const tickAngle = (-120 + idx * 24) * (Math.PI / 180);
          const x1 = 43 + Math.cos(tickAngle) * 27;
          const y1 = 43 + Math.sin(tickAngle) * 27;
          const x2 = 43 + Math.cos(tickAngle) * 33;
          const y2 = 43 + Math.sin(tickAngle) * 33;
          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              opacity={idx % 5 === 0 ? 0.9 : 0.55}
            />
          );
        })}

        <line
          x1="43"
          y1="43"
          x2="43"
          y2="16"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${angle} 43 43)`}
        />
        <circle cx="43" cy="43" r="3" fill="var(--rivet)" />
      </svg>

      {caption ? <div className="type-label text-ink-muted">{caption}</div> : null}
    </div>
  );
}
