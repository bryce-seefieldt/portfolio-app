import type { CSSProperties } from "react";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";

type Stat = {
  label: string;
  value: string;
  instrument: "seven" | "nixie" | "gauge" | "bar" | "lamps" | "glyph";
  ratio?: number;
  ratioCaption?: string;
  glyph?: "disc" | "numberOne" | "trophy";
};

type Bank = {
  title: string;
  stats: Stat[];
};

const BANKS: Bank[] = [
  {
    title: "BANK D / THE CRAFT",
    stats: [
      {
        value: "6 years",
        label: "Building software every day",
        instrument: "seven",
      },
      {
        value: "16+",
        label: "Architecture Decision Records on this site",
        instrument: "bar",
        ratio: 0.8,
        ratioCaption: "of ~20 and growing",
      },
      {
        value: "12",
        label: "STRIDE threat scenarios modeled",
        instrument: "seven",
      },
      {
        value: "~1 min",
        label: "Mean time to rollback",
        instrument: "seven",
      },
    ],
  },
  {
    title: "BANK A / ENTERPRISE DELIVERY",
    stats: [
      {
        value: "2,500+",
        label: "Users served by the cloud print platform",
        instrument: "seven",
      },
      {
        value: "50%",
        label: "Reduction in print-related support tickets",
        instrument: "gauge",
        ratio: 0.5,
        ratioCaption: "fewer tickets",
      },
      {
        value: "150+",
        label: "Services brought under continuity planning",
        instrument: "nixie",
      },
      {
        value: "$10K/yr",
        label: "Licensing cost eliminated",
        instrument: "seven",
      },
    ],
  },
  {
    title: "BANK B / SCALE & AUTOMATION",
    stats: [
      {
        value: "1,000,000+",
        label: "Titles administered at Warner Chappell Music Publishing",
        instrument: "nixie",
      },
      {
        value: "45+ hrs",
        label: "Manual work removed per week",
        instrument: "seven",
      },
      {
        value: "8 years",
        label: "Enterprise rights & royalty operations",
        instrument: "seven",
      },
    ],
  },
  {
    title: "BANK C / THE CAREER",
    stats: [
      {
        value: "25+ years",
        label: "Professional services & project delivery",
        instrument: "seven",
      },
      {
        value: "Multiple",
        label: "Multiple certified gold records",
        instrument: "glyph",
        glyph: "disc",
      },
      {
        value: "#1s",
        label: "Multiple national radio singles",
        instrument: "glyph",
        glyph: "numberOne",
      },
      {
        value: "Juno + CRMA",
        label: "Juno nominations and a Canadian Radio Music Award",
        instrument: "glyph",
        glyph: "trophy",
      },
    ],
  },
];

function ratioToNeedleAngle(ratio: number) {
  const safeRatio = Math.max(0, Math.min(1, ratio));
  const angle = -52 + safeRatio * 104;
  return `${angle.toFixed(1)}deg`;
}

function InstrumentGlyph({ glyph }: { glyph: Stat["glyph"] }) {
  if (glyph === "disc") {
    return (
      <svg viewBox="0 0 24 24" className="instrument-glyph" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      </svg>
    );
  }

  if (glyph === "numberOne") {
    return (
      <svg viewBox="0 0 24 24" className="instrument-glyph" aria-hidden="true">
        <path d="M8 7l4-2v14" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M15 7h3v12h-3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="instrument-glyph" aria-hidden="true">
      <path
        d="M12 3l2.2 4.5 5 .7-3.7 3.6.9 5-4.4-2.4-4.4 2.4.9-5-3.7-3.6 5-.7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M7.5 18h9" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function Instrument({ stat }: { stat: Stat }) {
  if (stat.instrument === "gauge") {
    const angle = ratioToNeedleAngle(stat.ratio ?? 0);
    return (
      <div className="instrument-gauge" aria-hidden="true">
        <span
          className="instrument-gauge__needle"
          style={{ "--needle-angle": angle } as CSSProperties}
        />
      </div>
    );
  }

  if (stat.instrument === "bar") {
    const fill = `${Math.max(0, Math.min(1, stat.ratio ?? 0)) * 100}%`;
    return (
      <div className="instrument-bar" aria-hidden="true">
        <span className="instrument-bar__fill" style={{ width: fill }} />
      </div>
    );
  }

  if (stat.instrument === "glyph") {
    return <InstrumentGlyph glyph={stat.glyph} />;
  }

  if (stat.instrument === "lamps") {
    return (
      <div className="instrument-lamps" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <div className={stat.instrument === "nixie" ? "instrument-nixie" : "instrument-seven"}>
      {stat.value}
    </div>
  );
}

export function ByTheNumbersCluster() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {BANKS.map((bank) => (
        <Panel
          key={bank.title}
          label={bank.title}
          variant="inset"
          className={
            bank.title === "BANK D / THE CRAFT" ? "ring-accent/40 h-full ring-1" : "h-full"
          }
        >
          <div className="grid gap-3">
            {bank.stats.map((stat) => (
              <div key={`${bank.title}-${stat.label}`} className="instrument-stat">
                <div className="instrument-stat__top">
                  <Instrument stat={stat} />
                  {stat.instrument === "seven" || stat.instrument === "nixie" ? null : (
                    <LabelTag>{stat.value}</LabelTag>
                  )}
                </div>
                <p className="type-caption text-ink">{stat.label}</p>
                {stat.ratioCaption ? (
                  <p className="type-caption text-ink-muted mt-1">{stat.ratioCaption}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}
