import { useId } from "react";

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
  const dialId = useId();
  const bezelGradId = `bezel-grad-${dialId}`;
  const hubGradId = `hub-grad-${dialId}`;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`.trim()}>
      <div className="dial-mount">
        <svg width="86" height="86" viewBox="0 0 86 86" className="text-line" aria-hidden="true">
          <defs>
            {/* Gradient for bezel (top-left light source) */}
            <linearGradient id={bezelGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--edge-highlight)" />
              <stop offset="50%" stopColor="rgba(0, 0, 0, 0)" />
              <stop offset="100%" stopColor="var(--edge-shadow)" />
            </linearGradient>
            {/* Radial gradient for dimensional rivet/hub */}
            <radialGradient id={hubGradId} cx="35%" cy="35%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="70%" stopColor="currentColor" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.5)" />
            </radialGradient>
          </defs>

          {/* Outer bezel ring with dimensional bevel */}
          <circle cx="43" cy="43" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="43" cy="43" r="38" fill={`url(#${bezelGradId})`} opacity="0.6" />

          {/* Recessed face (inner circle with inset shadow) */}
          <circle
            cx="43"
            cy="43"
            r="30"
            fill="color-mix(in srgb, var(--bg) 28%, var(--surface) 72%)"
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
            stroke="var(--dial-face-shadow-1)"
            strokeWidth="1.4"
            opacity="0.95"
          />
          <circle
            cx="43"
            cy="43"
            r="27.75"
            fill="none"
            stroke="var(--dial-face-shadow-2)"
            strokeWidth="2.2"
            opacity="0.75"
          />
          <circle
            cx="42.2"
            cy="42.2"
            r="28.4"
            fill="none"
            stroke="var(--dial-face-highlight)"
            strokeWidth="0.9"
            opacity="0.8"
          />

          {/* Optional: Subtle accent value-arc highlighting current value zone (dark mode) */}
          <circle
            className="dial-accent-arc"
            cx="43"
            cy="43"
            r="25"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.8"
            strokeDasharray="157 628"
            strokeDashoffset={157 - (safeValue / 100) * 157}
            opacity="0.42"
            strokeLinecap="round"
          />

          {/* Ticks: rotated 90 degrees counter-clockwise to align with needle sweep */}
          {Array.from({ length: 11 }).map((_, idx) => {
            const isMajorTick = idx % 5 === 0;
            const tickAngle = (-210 + idx * 24) * (Math.PI / 180);
            const innerRadius = isMajorTick ? 25.5 : 26.5;
            const outerRadius = isMajorTick ? 34.5 : 33.5;
            const x1 = 43 + Math.cos(tickAngle) * innerRadius;
            const y1 = 43 + Math.sin(tickAngle) * innerRadius;
            const x2 = 43 + Math.cos(tickAngle) * outerRadius;
            const y2 = 43 + Math.sin(tickAngle) * outerRadius;
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth={isMajorTick ? 1.55 : 1.2}
                strokeLinecap="round"
                opacity={isMajorTick ? 0.98 : 0.78}
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
              stroke="var(--dial-needle-shadow)"
              strokeWidth="3.2"
              strokeLinecap="round"
              transform={`rotate(${angle + 2.25} 43 43) translate(1.1 1.4)`}
              opacity="0.62"
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
          <circle cx="43" cy="43" r="5" fill={`url(#${hubGradId})`} />
          <circle cx="43" cy="43" r="5" fill="var(--rivet)" opacity="0.7" />
          {/* Highlight on hub for dimension */}
          <circle cx="41" cy="41" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
        </svg>
      </div>

      {caption ? <div className="type-label text-ink-muted">{caption}</div> : null}
    </div>
  );
}
