import { Callout } from "@/components/Callout";
import { ControlButton } from "@/components/ControlButton";
import { DeployPipeline } from "@/components/DeployPipeline";
import { Dial } from "@/components/Dial";
import { GoldStandardBadge } from "@/components/GoldStandardBadge";
import { Keycap } from "@/components/Keycap";
import { Keypad } from "@/components/Keypad";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";
import { Readout } from "@/components/Readout";
import { Section } from "@/components/Section";
import { VerificationBadge } from "@/components/VerificationBadge";

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

const KEY_TOKENS_DARK_PRIMARY = [
  { token: "--key-neutral", bg: "#2A2722", legend: "#E8E2D0" },
  { token: "--key-primary", bg: "#00FF41", legend: "#07220E" },
  { token: "--key-secondary", bg: "#FFB000", legend: "#2F1800" },
  { token: "--key-tertiary", bg: "#5FD0D0", legend: "#062024" },
  { token: "--key-alert", bg: "#CC2B2B", legend: "#FFF3F1" },
  { token: "--key-contrast", bg: "#E8E2D0", legend: "#17120D" },
  { token: "--key-instrument-green", bg: "#2A7B4E", legend: "#EAFFF2" },
  { token: "--key-amber-phosphor", bg: "#FF6A00", legend: "#2D1300" },
] as const;

const KEY_TOKENS_DARK_SECONDARY = [
  { token: "--key2-teal", bg: "#1F6B64", legend: "#F1F6EF" },
  { token: "--key2-violet", bg: "#5B4A7A", legend: "#F2ECFF" },
  { token: "--key2-blue", bg: "#3D5F86", legend: "#EDF4FF" },
  { token: "--key2-olive", bg: "#7B8450", legend: "#12140C" },
  { token: "--key2-rust", bg: "#8B4A2C", legend: "#FFF0E6" },
  { token: "--key2-slate", bg: "#59616C", legend: "#EEF1F4" },
  { token: "--key2-gold", bg: "#9A7A34", legend: "#171008" },
  { token: "--key2-magenta", bg: "#7D3C67", legend: "#FFEEFA" },
] as const;

const KEY_TOKENS_LIGHT_PRIMARY = [
  { token: "--key-neutral", bg: "#C9BFA3", legend: "#1A1814" },
  { token: "--key-primary", bg: "#A34722", legend: "#F5ECE1" },
  { token: "--key-secondary", bg: "#D4891F", legend: "#281606" },
  { token: "--key-tertiary", bg: "#2B6F76", legend: "#F4FCFF" },
  { token: "--key-alert", bg: "#B53A2F", legend: "#FFF2EF" },
  { token: "--key-contrast", bg: "#1A1814", legend: "#EFE9D9" },
  { token: "--key-instrument-green", bg: "#3E6B47", legend: "#F1F8F2" },
  { token: "--key-amber-phosphor", bg: "#B24B22", legend: "#FFF1EA" },
] as const;

const KEY_TOKENS_LIGHT_SECONDARY = [
  { token: "--key2-teal", bg: "#2F7772", legend: "#F3FCFA" },
  { token: "--key2-plum", bg: "#6F5678", legend: "#F8EFFF" },
  { token: "--key2-blue", bg: "#43688A", legend: "#EEF5FF" },
  { token: "--key2-olive", bg: "#78804F", legend: "#0F1109" },
  { token: "--key2-rust", bg: "#9F5431", legend: "#FFF2EB" },
  { token: "--key2-stone", bg: "#8A7F70", legend: "#17130F" },
  { token: "--key2-ochre", bg: "#A67D2E", legend: "#181109" },
  { token: "--key2-mauve", bg: "#8B6677", legend: "#FFF4FA" },
] as const;

type TokenEntry = {
  token: string;
  bg: string;
  legend: string;
};

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

function KeycapTokenBoard({ title, tokens }: { title: string; tokens: ReadonlyArray<TokenEntry> }) {
  const keys = tokens.map((entry, index) => ({
    id: `${title}-${entry.token}`,
    legend: `K${index + 1}`,
    subLegend: entry.token.replace("--", ""),
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

export default function DesignTokensPreviewPage() {
  const mixedKeypadKeys = [
    { id: "mix-1", legend: "TS", subLegend: "LANG", capColor: "#C9BFA3", legendColor: "#1A1814" },
    { id: "mix-2", legend: "RE", subLegend: "UI", capColor: "#A34722", legendColor: "#F5ECE1" },
    { id: "mix-3", legend: "GO", subLegend: "API", capColor: "#2F7772", legendColor: "#F3FCFA" },
    {
      id: "mix-4",
      legend: "CI",
      subLegend: "PIPE",
      capColor: "#3E6B47",
      legendColor: "#F1F8F2",
      state: "backlit" as const,
    },
    {
      id: "mix-5",
      legend: "SQL",
      subLegend: "DB",
      capColor: "#43688A",
      legendColor: "#EEF5FF",
      size: "1.5u" as const,
    },
    {
      id: "mix-6",
      legend: "K8S",
      subLegend: "OPS",
      capColor: "#78804F",
      legendColor: "#16150F",
      size: "1.5u" as const,
    },
    {
      id: "mix-7",
      legend: "AUTH",
      subLegend: "SEC",
      capColor: "#8B6677",
      legendColor: "#1A1417",
      size: "2u" as const,
      state: "pressed" as const,
    },
    {
      id: "mix-8",
      legend: "SHIP",
      subLegend: "PR",
      capColor: "#9F5431",
      legendColor: "#FFF2EB",
      size: "2u" as const,
      state: "hover" as const,
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Governance rule: this page is the canonical rendered catalog for reusable design-system components. */}
      <header className="space-y-2">
        <h1 className="type-h1 text-ink">Design Token Preview</h1>
        <p className="type-body text-ink-muted">
          Canonical component gallery: every reusable design-system component must be represented on
          this page and updated in the same PR whenever its attributes change.
        </p>
      </header>

      <Panel label="MODULE 00 / PALETTE" variant="default">
        <div className="grid gap-4 md:grid-cols-2">
          <PaletteCard title="Light / Beige Institutional" palette={LIGHT_PALETTE} />
          <PaletteCard title="Dark / Powered-On Phosphor" palette={DARK_PALETTE} dark />
        </div>
      </Panel>

      <Panel label="MODULE 01 / TYPE" variant="default">
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

      <Panel label="MODULE 02 / PANELS" variant="default">
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel label="PANEL / DEFAULT" variant="default" showRivets={false}>
            <p className="type-body text-ink">
              Raised panel surface with tunable elevation token stack.
            </p>
          </Panel>
          <Panel label="PANEL / INSET" variant="inset" showRivets={false}>
            <p className="type-body text-ink">
              Recessed panel/well treatment with top-inner catch light.
            </p>
          </Panel>
        </div>
      </Panel>

      <Panel label="MODULE 03 / CONTROLS" variant="default">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="type-h3 text-ink">ControlButton variants + states</h3>
            <div className="flex flex-wrap gap-2">
              <ControlButton href="/" className="pointer-events-none">
                DEFAULT
              </ControlButton>
              <ControlButton href="/" className="control-button--compact pointer-events-none">
                COMPACT
              </ControlButton>
              <button
                type="button"
                className="control-button type-label is-hover pointer-events-none"
              >
                HOVER
              </button>
              <button
                type="button"
                className="control-button type-label is-active pointer-events-none"
              >
                ACTIVE
              </button>
              <button
                type="button"
                className="control-button type-label is-focus-visible pointer-events-none"
              >
                FOCUS
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="type-h3 text-ink">Deploy pipeline</h3>
            <DeployPipeline />
          </div>
        </div>
      </Panel>

      <Panel label="MODULE 04 / INSTRUMENTS" variant="default">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="type-h3 text-ink">Dial values</h3>
            <div className="flex flex-wrap gap-4">
              <Dial value={25} caption="LOAD 25" />
              <Dial value={50} caption="LOAD 50" />
              <Dial value={74} caption="LOAD 74" />
              <Dial value={90} caption="LOAD 90" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="type-h3 text-ink">Readout + tags</h3>
            <Readout value="OPERATIONAL" caption="DEPLOY STATUS" />
            <Readout value="~1" unit="min" caption="ROLLBACK MTTR" />
            <div className="flex flex-wrap gap-2">
              <LabelTag>DEFAULT</LabelTag>
              <LabelTag tone="accent">ACCENT</LabelTag>
              <LabelTag tone="warn">WARN</LabelTag>
            </div>
          </div>
        </div>
      </Panel>

      <Panel label="MODULE 05 / KEYS" variant="default">
        <div className="space-y-6">
          <p className="type-body text-ink-muted">
            Design-tokens sandbox only. Home-page keypad integration is intentionally deferred.
          </p>

          <KeycapTokenBoard title="Dark primary keycap colors" tokens={KEY_TOKENS_DARK_PRIMARY} />
          <KeycapTokenBoard
            title="Dark secondary keycap colors"
            tokens={KEY_TOKENS_DARK_SECONDARY}
          />
          <KeycapTokenBoard title="Light primary keycap colors" tokens={KEY_TOKENS_LIGHT_PRIMARY} />
          <KeycapTokenBoard
            title="Light secondary keycap colors"
            tokens={KEY_TOKENS_LIGHT_SECONDARY}
          />

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
                  capColor="#2B6F76"
                  legendColor="#F4FCFF"
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

          <div className="space-y-3">
            <h3 className="type-h3 text-ink">Representative mixed-color keypad</h3>
            <Keypad label="MIXED BOARD / TECH STACK" keys={mixedKeypadKeys} columns={4} />
          </div>
        </div>
      </Panel>

      <Panel label="MODULE 06 / COMPOSITES" variant="default">
        <div className="grid gap-4 lg:grid-cols-2">
          <Section title="Section primitive" subtitle="Reusable framing container">
            <p className="type-body text-ink">
              Use for grouped content with consistent heading structure.
            </p>
          </Section>

          <div className="space-y-3">
            <Callout>Default callout treatment for supporting notes.</Callout>
            <Callout type="info">
              Info callout treatment for highlighted implementation guidance.
            </Callout>
          </div>

          <div className="space-y-2">
            <div className="type-label text-ink-muted">Verification badges</div>
            <div className="flex flex-wrap gap-2">
              <VerificationBadge type="docs-available" />
              <VerificationBadge type="threat-model" />
              <VerificationBadge type="gold-standard" />
              <VerificationBadge type="adr-complete" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="type-label text-ink-muted">Gold-standard badge</div>
            <GoldStandardBadge />
          </div>
        </div>
      </Panel>
    </div>
  );
}
