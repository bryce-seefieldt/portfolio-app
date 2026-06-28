import { Panel } from "@/components/Panel";
import { Keycap } from "@/components/Keycap";

type KeypadKey = {
  id: string;
  legend: string;
  subLegend?: string;
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
}

export function Keypad({ label, keys, columns = 6, className = "" }: KeypadProps) {
  return (
    <Panel label={label} variant="inset" className={className}>
      <div className="keypad-shell">
        <div
          className="keypad-grid"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {keys.map((key) => (
            <Keycap
              key={key.id}
              legend={key.legend}
              subLegend={key.subLegend}
              capColor={key.capColor}
              legendColor={key.legendColor}
              size={key.size}
              state={key.state}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}
