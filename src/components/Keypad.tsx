import { Panel } from "@/components/Panel";
import { Keycap } from "@/components/Keycap";
import type { CSSProperties, ReactNode } from "react";
import type { ComponentPropsWithoutRef } from "react";

type KeypadKey = {
  id: string;
  legend: ReactNode;
  subLegend?: ReactNode;
  capColor: string;
  legendColor: string;
  size?: "1u" | "1.25u" | "1.5u" | "2u";
  state?: "rest" | "hover" | "pressed" | "backlit";
};

interface KeypadProps {
  label: string;
  keys: KeypadKey[];
  columns?: number;
  className?: string;
  getKeyButtonProps?: (key: KeypadKey, index: number) => ComponentPropsWithoutRef<"button">;
}

function getSpan(size: KeypadKey["size"]) {
  switch (size) {
    case "2u":
      return 2;
    default:
      return 1;
  }
}

export function Keypad({
  label,
  keys,
  columns = 6,
  className = "",
  getKeyButtonProps,
}: KeypadProps) {
  const gridStyle = {
    display: "inline-grid",
    width: "max-content",
    gridTemplateColumns: `repeat(${columns}, var(--keypad-unit-pitch-x))`,
  } as CSSProperties;

  const shellStyle = {
    width: "fit-content",
    maxWidth: "100%",
  } as CSSProperties;

  return (
    <Panel label={label} variant="inset" className={className}>
      <div className="keypad-shell" style={shellStyle}>
        <div className="keypad-grid" style={gridStyle}>
          {keys.map((key, index) => {
            const span = getSpan(key.size);
            const keyButtonProps = getKeyButtonProps?.(key, index) ?? {};
            return (
              <div
                key={key.id}
                className="keypad-grid__cell"
                style={{ gridColumn: `span ${span}` }}
              >
                <Keycap
                  legend={key.legend}
                  subLegend={key.subLegend}
                  capColor={key.capColor}
                  legendColor={key.legendColor}
                  size={key.size}
                  state={key.state}
                  className="keypad-grid__key"
                  {...keyButtonProps}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
