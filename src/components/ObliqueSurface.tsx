import type { CSSProperties, ReactNode } from "react";

type RenderCapArgs = {
  className: string;
  children: ReactNode;
};

interface ObliqueSurfaceProps {
  capColor: string;
  legendColor: string;
  legend: ReactNode;
  subLegend?: ReactNode;
  className?: string;
  capClassName?: string;
  style?: CSSProperties;
  state?: "rest" | "hover" | "pressed" | "backlit";
  renderCap: (args: RenderCapArgs) => ReactNode;
}

const SLICE_COUNT = 16;

function getStateClass(state: ObliqueSurfaceProps["state"]) {
  switch (state) {
    case "hover":
      return "obl--hover";
    case "pressed":
      return "obl--pressed";
    case "backlit":
      return "obl--backlit";
    default:
      return "";
  }
}

function getSliceMixPercent(t: number) {
  const low = 36;
  const high = 92;
  return low + (1 - t) * (high - low);
}

export function ObliqueSurface({
  capColor,
  legendColor,
  legend,
  subLegend,
  className = "",
  capClassName = "",
  style,
  state = "rest",
  renderCap,
}: ObliqueSurfaceProps) {
  const rootStyle = {
    "--cap": capColor,
    "--legend": legendColor,
    ...style,
  } as CSSProperties;

  const slices = Array.from({ length: SLICE_COUNT }, (_, index) => {
    const t = (SLICE_COUNT - index) / SLICE_COUNT;
    const mix = getSliceMixPercent(t);
    return (
      <span
        key={`slice-${index}`}
        className="obl__slice"
        aria-hidden="true"
        style={
          {
            "--t": Number(t.toFixed(4)),
            background: `color-mix(in srgb, var(--cap) ${mix.toFixed(1)}%, #000)`,
          } as CSSProperties
        }
      />
    );
  });

  return (
    <span className={`obl ${getStateClass(state)} ${className}`.trim()} style={rootStyle}>
      <span className="obl__socket" aria-hidden="true" />
      {renderCap({
        className: `obl__cap ${capClassName}`.trim(),
        children: (
          <>
            {slices}
            <span className="obl__top" aria-hidden="true">
              <span className="obl__glare" />
            </span>
            <span className="obl__legend-wrap">
              <span className="obl__legend">{legend}</span>
              {subLegend ? <span className="obl__sub">{subLegend}</span> : null}
            </span>
          </>
        ),
      })}
    </span>
  );
}
