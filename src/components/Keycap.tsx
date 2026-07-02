import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { ObliqueSurface } from "@/components/ObliqueSurface";

type KeycapSize = "1u" | "1.25u" | "1.5u" | "2u";
type KeycapState = "rest" | "hover" | "pressed" | "backlit";

interface KeycapProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "className" | "style" | "type"
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
  const keycapClass = `keycap ${getSizeClass(size)} ${className}`.trim();
  const style = {
    "--topw": "calc(var(--keycap-unit) * var(--keycap-units))",
    "--toph": "calc(var(--keycap-unit) - 6px)",
    "--radius": "10px",
  } as CSSProperties;

  return (
    <ObliqueSurface
      className={keycapClass}
      capColor={capColor}
      legendColor={legendColor}
      legend={legend}
      subLegend={subLegend}
      style={style}
      state={state}
      renderCap={({ className: capClassName, children }) => (
        <button
          type="button"
          className={capClassName}
          aria-label={buttonProps["aria-label"] ?? (typeof legend === "string" ? legend : "Keycap")}
          {...buttonProps}
        >
          {children}
        </button>
      )}
    />
  );
}
