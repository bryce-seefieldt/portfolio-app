import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

type KeycapSize = "1u" | "1.25u" | "1.5u" | "2u";
type KeycapState = "rest" | "hover" | "pressed" | "backlit";

interface KeycapProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "type" | "className" | "style"
> {
  legend: ReactNode;
  subLegend?: ReactNode;
  capColor: string;
  legendColor: string;
  size?: KeycapSize;
  state?: KeycapState;
  className?: string;
}

function getSizeClass(size: KeycapSize) {
  switch (size) {
    case "1.25u":
      return "keycap--1-25u";
    case "1.5u":
      return "keycap--1-5u";
    case "2u":
      return "keycap--2u";
    default:
      return "keycap--1u";
  }
}

function getStateClass(state: KeycapState) {
  switch (state) {
    case "hover":
      return "keycap--hover";
    case "pressed":
      return "keycap--pressed";
    case "backlit":
      return "keycap--backlit";
    default:
      return "";
  }
}

export function Keycap({
  legend,
  subLegend,
  capColor,
  legendColor,
  size = "1u",
  state = "rest",
  className = "",
  ...buttonProps
}: KeycapProps) {
  const style = {
    "--keycap-bg": capColor,
    "--keycap-legend": legendColor,
  } as CSSProperties;

  return (
    <button
      type="button"
      className={`keycap ${getSizeClass(size)} ${getStateClass(state)} ${className}`.trim()}
      style={style}
      aria-label={buttonProps["aria-label"] ?? (typeof legend === "string" ? legend : "Keycap")}
      {...buttonProps}
    >
      <span className="keycap__dish" aria-hidden="true" />
      <span className="keycap__legend">{legend}</span>
      {subLegend ? <span className="keycap__sublegend">{subLegend}</span> : null}
    </button>
  );
}
