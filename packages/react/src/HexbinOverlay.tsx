import React, { useMemo } from "react";
import { computeHexbin, type DataPoint, type HexbinConfig, type HexbinCell } from "@sportviz/core";
import { useSurface } from "./context";

export interface HexbinOverlayProps extends HexbinConfig {
  data: DataPoint[];
  /** Format tooltip for each cell. Return null to suppress. */
  tooltip?: (cell: { count: number; data: HexbinCell }) => string | null;
  /** Called when a cell is hovered. Null on mouse leave. */
  onCellHover?: (cell: { count: number; data: HexbinCell } | null, event: React.MouseEvent) => void;
  /** Called when a cell is clicked. */
  onCellClick?: (cell: { count: number; data: HexbinCell }, event: React.MouseEvent) => void;
}

export function HexbinOverlay({
  data,
  tooltip,
  onCellHover,
  onCellClick,
  ...config
}: HexbinOverlayProps) {
  useSurface();

  const interactive = !!(onCellHover || onCellClick);
  const cells = useMemo(() => computeHexbin(data, config), [data, config]);

  return (
    <g className="sportviz-hexbin">
      {cells.map((cell, i) => {
        const tip = tooltip?.(cell);
        return (
          <path
            key={i}
            d={cell.path}
            transform={`translate(${cell.x}, ${cell.y})`}
            fill={cell.fill}
            opacity={cell.opacity}
            style={interactive ? { cursor: "pointer" } : undefined}
            onMouseEnter={onCellHover ? (e) => onCellHover(cell, e) : undefined}
            onMouseLeave={onCellHover ? (e) => onCellHover(null, e) : undefined}
            onClick={onCellClick ? (e) => onCellClick(cell, e) : undefined}
          >
            {tip && <title>{tip}</title>}
          </path>
        );
      })}
    </g>
  );
}
