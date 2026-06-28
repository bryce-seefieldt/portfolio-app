import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";

type EraCard = {
  title: string;
  range: string;
  org: string;
  bullets: string[];
};

const ERA_CARDS: EraCard[] = [
  {
    title: "MUSIC & ENTERTAINMENT",
    range: "1999–2022",
    org: "SEVEN:30 ENTERTAINMENT",
    bullets: [
      "Founded and ran an artist and label consultancy for two decades",
      "Gold records, #1 radio singles, and Juno nominations",
      "Tour management and live mix engineering across 50+ cities",
      "Marketing campaigns with audience reach across five continents",
      "Partnerships with Sony/BMG, Red Bull Music Academy, and Nike",
    ],
  },
  {
    title: "ENTERPRISE PUBLISHING",
    range: "2014–2022",
    org: "WARNER CHAPPELL MUSIC PUBLISHING",
    bullets: [
      "Administered a 1,000,000+ title catalogue",
      "Led the global publishing-database and client-portal rollout",
      "Automated cross-office reporting and removed 45+ weekly manual hours",
      "Appointed to the CMRRA Canadian Publishers Committee",
    ],
  },
  {
    title: "THE PIVOT",
    range: "2020–2025",
    org: "SENECA POLYTECHNIC",
    bullets: [
      "Honours Bachelor of Technology in Software Development",
      "Full SDLC, cloud, security, Agile, and UX practice across eight semesters",
      "A deliberate decision to formalize a lifelong craft",
    ],
  },
  {
    title: "ENTERPRISE IT & PRACTICE",
    range: "2024–present",
    org: "OCAD UNIVERSITY + INDEPENDENT",
    bullets: [
      "18 months of enterprise transformation, reporting to the CIO",
      "Three concurrent modernization projects delivered",
      "Self-directed production engineering through this site and its docs",
    ],
  },
];

export function CareerEraCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {ERA_CARDS.map((card) => (
        <article key={card.title}>
          <Panel className="h-full" variant="default" label={`CARD / ${card.range}`}>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <LabelTag tone="accent">{card.title}</LabelTag>
                <LabelTag>{card.org}</LabelTag>
                <span className="era-card-led" aria-hidden="true" />
              </div>
              <ul className="text-ink list-disc space-y-1 pl-5 text-sm">
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </Panel>
        </article>
      ))}
    </div>
  );
}
