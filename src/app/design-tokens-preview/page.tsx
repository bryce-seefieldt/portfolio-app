import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";
import { Readout } from "@/components/Readout";

const LIGHT_PALETTE = [
  ["bg", "#E8E2D0"],
  ["surface", "#D4CBB3"],
  ["surface-2", "#C9BFA3"],
  ["ink", "#1A1814"],
  ["accent", "#A34722"],
  ["line", "#9A958A"],
] as const;

const DARK_PALETTE = [
  ["bg", "#0A0A0A"],
  ["surface", "#1A1814"],
  ["surface-2", "#211E18"],
  ["ink", "#E8E2D0"],
  ["accent", "#00FF41"],
  ["line", "#003311"],
] as const;

function PaletteCard({
  title,
  palette,
  dark = false,
}: {
  title: string;
  palette: ReadonlyArray<readonly [string, string]>;
  dark?: boolean;
}) {
  return (
    <div
      className="rounded-md border p-4"
      style={{
        borderColor: dark ? "#003311" : "#9A958A",
        background: dark ? "#1A1814" : "#D4CBB3",
        color: dark ? "#E8E2D0" : "#1A1814",
      }}
    >
      <h3 className="type-h3">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {palette.map(([name, value]) => (
          <div key={name} className="rounded border p-2" style={{ borderColor: "currentColor" }}>
            <div className="type-label">{name}</div>
            <div
              className="mt-2 h-8 rounded border"
              style={{ backgroundColor: value, borderColor: "currentColor" }}
            />
            <div className="type-caption mt-2">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesignTokensPreviewPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="space-y-2">
        <h1 className="type-h1 text-ink">Design Token Preview</h1>
        <p className="type-body text-ink-muted">
          Phase 2C lock: Beige/Institutional light mode, phosphor-on-near-black dark mode, and four
          type registers.
        </p>
      </header>

      <Panel label="MODULE 00 / PALETTE LOCK" variant="default">
        <div className="grid gap-4 md:grid-cols-2">
          <PaletteCard title="Light / Beige Institutional" palette={LIGHT_PALETTE} />
          <PaletteCard title="Dark / Powered-On Phosphor" palette={DARK_PALETTE} dark />
        </div>
      </Panel>

      <Panel label="MODULE 01 / TYPE REGISTERS" variant="default">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-line rounded-md border p-4">
            <div className="type-label text-ink-muted">DISPLAY · SPACE GROTESK</div>
            <p className="type-h2 text-ink mt-2">Panel headline register</p>
          </div>
          <div className="border-line rounded-md border p-4">
            <div className="type-label text-ink-muted">BODY · INTER</div>
            <p className="type-body text-ink mt-2">
              Human-readable prose register for core narrative and explanatory copy.
            </p>
          </div>
          <div className="border-line rounded-md border p-4">
            <div className="type-label text-ink-muted">MONO · JETBRAINS MONO</div>
            <p className="type-readout text-accent mt-2">45+ HRS</p>
          </div>
          <div className="border-line rounded-md border p-4">
            <div className="type-label text-ink-muted">PIXEL ACCENT · DEPARTURE MONO</div>
            <p className="type-register-pixel text-ink mt-2">Module 03 / Bank A / Readout</p>
          </div>
        </div>
      </Panel>

      <Panel label="MODULE 02 / PRIMITIVES" variant="default">
        <div className="flex flex-wrap items-start gap-4">
          <Readout value="OPERATIONAL" caption="DEPLOY STATUS" />
          <Readout value="~1" unit="min" caption="ROLLBACK MTTR" />
          <div className="flex flex-wrap gap-2">
            <LabelTag>DEFAULT</LabelTag>
            <LabelTag tone="accent">ACCENT</LabelTag>
            <LabelTag tone="warn">WARN</LabelTag>
          </div>
        </div>
      </Panel>

      <Panel label="MODULE 03 / INSET PANEL" variant="inset">
        <p className="type-body-lg text-ink">
          Verify that hero, nav, footer, and panel primitives remain readable in both themes,
          especially under the new cream light mode.
        </p>
      </Panel>
    </div>
  );
}
