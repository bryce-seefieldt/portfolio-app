import { LabelTag } from "@/components/LabelTag";
import { Keycap } from "@/components/Keycap";
import { Keypad } from "@/components/Keypad";
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

const KEY_TOKENS_DARK = [
  { token: "--key-neutral", bg: "#2A2722", legend: "#E8E2D0" },
  { token: "--key-primary", bg: "#00FF41", legend: "#07220E" },
  { token: "--key-secondary", bg: "#FFB000", legend: "#2F1800" },
  { token: "--key-tertiary", bg: "#5FD0D0", legend: "#062024" },
  { token: "--key-alert", bg: "#CC2B2B", legend: "#FFF3F1" },
  { token: "--key-contrast", bg: "#E8E2D0", legend: "#17120D" },
  { token: "--key-instrument-green", bg: "#2E8B57", legend: "#081C13" },
  { token: "--key-amber-phosphor", bg: "#FF6A00", legend: "#2D1300" },
] as const;

const KEY_TOKENS_LIGHT = [
  { token: "--key-neutral", bg: "#C9BFA3", legend: "#1A1814" },
  { token: "--key-primary", bg: "#A34722", legend: "#F5ECE1" },
  { token: "--key-secondary", bg: "#D4891F", legend: "#281606" },
  { token: "--key-tertiary", bg: "#2D7F87", legend: "#E8F5F7" },
  { token: "--key-alert", bg: "#B53A2F", legend: "#FFF2EF" },
  { token: "--key-contrast", bg: "#1A1814", legend: "#EFE9D9" },
  { token: "--key-instrument-green", bg: "#3E6B47", legend: "#F1F8F2" },
  { token: "--key-amber-phosphor", bg: "#C85A2C", legend: "#FFF1EA" },
] as const;

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const parsed = [0, 2, 4].map((idx) => Number.parseInt(normalized.slice(idx, idx + 2), 16));
  return { r: parsed[0] ?? 0, g: parsed[1] ?? 0, b: parsed[2] ?? 0 };
}

function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  const [rs, gs, bs] = channels;
  return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0);
}

function getContrastRatio(foreground: string, background: string) {
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const high = Math.max(l1, l2);
  const low = Math.min(l1, l2);
  return (high + 0.05) / (low + 0.05);
}

function KeycapTokenBoard({
  title,
  tokens,
}: {
  title: string;
  tokens: ReadonlyArray<{ token: string; bg: string; legend: string }>;
}) {
  const keys = tokens.map((entry, index) => ({
    id: `${title}-${entry.token}`,
    legend: `K${index + 1}`,
    subLegend: entry.token.replace("--key-", ""),
    capColor: entry.bg,
    legendColor: entry.legend,
    size: "1u" as const,
  }));

  return (
    <div className="space-y-3">
      <h3 className="type-h3 text-ink">{title}</h3>
      <Keypad label={`${title} / KEY COLOR BOARD`} keys={keys} columns={4} />
      <div className="grid gap-2 sm:grid-cols-2">
        {tokens.map((entry) => {
          const ratio = getContrastRatio(entry.legend, entry.bg);
          const passes = ratio >= 4.5;
          return (
            <div key={`${title}-${entry.token}-meta`} className="border-line rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="type-label text-ink-muted">{entry.token}</span>
                <span className={`type-label ${passes ? "text-accent" : "text-accent-warn"}`}>
                  {passes ? "AA PASS" : "AA FAIL"}
                </span>
              </div>
              <div className="mb-2 flex items-center gap-3">
                <Keycap
                  legend="TXT"
                  subLegend={`${ratio.toFixed(2)}:1`}
                  capColor={entry.bg}
                  legendColor={entry.legend}
                  size="1u"
                />
                <div className="type-caption text-ink-muted space-y-1">
                  <div>bg: {entry.bg}</div>
                  <div>legend: {entry.legend}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

      <Panel label="MODULE 04 / KEYCAP + KEYPAD VISUAL TREATMENT" variant="default">
        <div className="space-y-6">
          <p className="type-body text-ink-muted">
            Design-tokens sandbox only. Keypad integration on the home hero is intentionally
            deferred.
          </p>

          <KeycapTokenBoard title="Dark theme keycap colors" tokens={KEY_TOKENS_DARK} />
          <KeycapTokenBoard title="Light theme keycap colors" tokens={KEY_TOKENS_LIGHT} />

          <div className="space-y-3">
            <h3 className="type-h3 text-ink">Keycap states and sizes</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-line rounded-md border p-3">
                <div className="type-label text-ink-muted mb-2">REST / 1U</div>
                <Keycap legend="TS" subLegend="1u" capColor="#A34722" legendColor="#F5ECE1" />
              </div>
              <div className="border-line rounded-md border p-3">
                <div className="type-label text-ink-muted mb-2">HOVER / 1.5U</div>
                <Keycap
                  legend="NEXT"
                  subLegend="1.5u"
                  capColor="#2D7F87"
                  legendColor="#E8F5F7"
                  size="1.5u"
                  state="hover"
                />
              </div>
              <div className="border-line rounded-md border p-3">
                <div className="type-label text-ink-muted mb-2">PRESSED / 2U</div>
                <Keycap
                  legend="REACT"
                  subLegend="2u"
                  capColor="#3E6B47"
                  legendColor="#F1F8F2"
                  size="2u"
                  state="pressed"
                />
              </div>
              <div className="border-line rounded-md border p-3">
                <div className="type-label text-ink-muted mb-2">BACKLIT / 1.25U</div>
                <Keycap
                  legend="SQL"
                  subLegend="1.25u"
                  capColor="#00FF41"
                  legendColor="#07220E"
                  size="1.25u"
                  state="backlit"
                />
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
