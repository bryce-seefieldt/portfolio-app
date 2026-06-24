import { Dial } from "@/components/Dial";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";
import { Readout } from "@/components/Readout";

export default function DesignTokensPreviewPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header className="space-y-2">
        <h1 className="type-h1 text-ink">Design Token Preview</h1>
        <p className="type-body text-ink-muted">
          Phase 2A component sandbox for panel primitives and typography tokens.
        </p>
      </header>

      <Panel label="MODULE 01 / PANEL" variant="default">
        <div className="flex flex-wrap items-start gap-4">
          <Readout value="98.4" unit="%" caption="BUILD HEALTH" />
          <Dial value={72} caption="SYSTEM LOAD" />
          <div className="flex flex-wrap gap-2">
            <LabelTag>DEFAULT</LabelTag>
            <LabelTag tone="accent">ACCENT</LabelTag>
            <LabelTag tone="warn">WARN</LabelTag>
          </div>
        </div>
      </Panel>

      <Panel label="MODULE 02 / INSET" variant="inset">
        <p className="type-body-lg text-ink">
          This isolated route previews the cassette-futurism design primitives without changing any
          production page structure.
        </p>
      </Panel>

      {/* Dial alignment verification: multiple fixed values */}
      <Panel label="DIAL ALIGNMENT VERIFICATION" variant="default">
        <div className="flex flex-wrap items-end justify-start gap-8">
          <div className="flex flex-col items-center">
            <Dial value={0} />
            <div className="type-label text-ink-muted mt-2">0</div>
          </div>
          <div className="flex flex-col items-center">
            <Dial value={25} />
            <div className="type-label text-ink-muted mt-2">25</div>
          </div>
          <div className="flex flex-col items-center">
            <Dial value={50} />
            <div className="type-label text-ink-muted mt-2">50</div>
          </div>
          <div className="flex flex-col items-center">
            <Dial value={75} />
            <div className="type-label text-ink-muted mt-2">75</div>
          </div>
          <div className="flex flex-col items-center">
            <Dial value={100} />
            <div className="type-label text-ink-muted mt-2">100</div>
          </div>
        </div>
        <p className="type-caption text-ink-muted mt-6">
          Verify: ticks align with needle at each value; dimensional bezel, recessed face, and
          shadowed needle visible; accent arc highlights current zone (dark mode).
        </p>
      </Panel>
    </div>
  );
}
