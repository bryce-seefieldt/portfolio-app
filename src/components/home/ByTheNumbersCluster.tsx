import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";

type Stat = {
  label: string;
  value: string;
  instrument: "seven" | "nixie" | "gauge" | "bar" | "lamps";
};

type Bank = {
  title: string;
  stats: Stat[];
};

const BANKS: Bank[] = [
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
        instrument: "gauge",
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
        value: "Gold",
        label: "Multiple certified gold records",
        instrument: "gauge",
      },
      {
        value: "#1s",
        label: "Multiple national radio singles",
        instrument: "lamps",
      },
      {
        value: "Juno + CRMA",
        label: "Juno nominations and a Canadian Radio Music Award",
        instrument: "lamps",
      },
    ],
  },
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
      },
      {
        value: "12",
        label: "STRIDE threat scenarios modeled",
        instrument: "bar",
      },
      {
        value: "~1 min",
        label: "Mean time to rollback",
        instrument: "seven",
      },
    ],
  },
];

function Instrument({ stat }: { stat: Stat }) {
  if (stat.instrument === "gauge") {
    return (
      <div className="instrument-gauge" aria-hidden="true">
        <span className="instrument-gauge__needle" />
      </div>
    );
  }

  if (stat.instrument === "bar") {
    return (
      <div className="instrument-bar" aria-hidden="true">
        <span className="instrument-bar__fill" />
      </div>
    );
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
        <Panel key={bank.title} label={bank.title} variant="inset" className="h-full">
          <div className="grid gap-3">
            {bank.stats.map((stat) => (
              <div key={`${bank.title}-${stat.label}`} className="instrument-stat">
                <div className="instrument-stat__top">
                  <Instrument stat={stat} />
                  <LabelTag>{stat.value}</LabelTag>
                </div>
                <p className="type-caption text-ink">{stat.label}</p>
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}
