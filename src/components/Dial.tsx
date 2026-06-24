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
        <defs>
          {/* Gradient for bezel (top-left light source) */}
          <linearGradient id="bezel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="50%" stopColor="rgba(0, 0, 0, 0)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.25)" />
          </linearGradient>
          {/* Radial gradient for dimensional rivet/hub */}
          <radialGradient id="hub-grad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="70%" stopColor="currentColor" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.5)" />
          </radialGradient>
        </defs>

        {/* Outer bezel ring with dimensional bevel */}
        <circle cx="43" cy="43" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="43" cy="43" r="38" fill="url(#bezel-grad)" opacity="0.6" />

        {/* Recessed face (inner circle with inset shadow) */}
        <circle
          cx="43"
          cy="43"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Inset shadow effect for recessed face */}
        <circle
          cx="43"
          cy="43"
          r="29.5"
          fill="none"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* Optional: Subtle accent value-arc highlighting current value zone (dark mode) */}
        <circle
          cx="43"
          cy="43"
          r="25"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="157 628"
          strokeDashoffset={157 - (safeValue / 100) * 157}
          opacity="0.15"
          strokeLinecap="round"
        />

        {/* Ticks: rotated 90 degrees counter-clockwise to align with needle sweep */}
        {Array.from({ length: 11 }).map((_, idx) => {
          const tickAngle = (-210 + idx * 24) * (Math.PI / 180);
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

        {/* Needle with subtle shadow for dimensional effect */}
        <g>
          {/* Needle shadow */}
          <line
            x1="43"
            y1="43"
            x2="43"
            y2="16"
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${angle + 1.5} 43 43)`}
            opacity="0.4"
          />
          {/* Main needle */}
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
        </g>

        {/* Center pivot hub: larger and dimensional */}
        <circle cx="43" cy="43" r="5" fill="url(#hub-grad)" />
        <circle cx="43" cy="43" r="5" fill="var(--rivet)" opacity="0.7" />
        {/* Highlight on hub for dimension */}
        <circle cx="41" cy="41" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
      </svg>

      {caption ? <div className="type-label text-ink-muted">{caption}</div> : null}
    </div>
  );
}
