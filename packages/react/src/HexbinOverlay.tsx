import React, { useMemo } from "react";
import { computeHexbin, type DataPoint, type HexbinConfig } from "@sportviz/core";
import { useSurface } from "./context";

export interface HexbinOverlayProps extends HexbinConfig {
  data: DataPoint[];
}

export function HexbinOverlay({ data, ...config }: HexbinOverlayProps) {
  useSurface();

  const cells = useMemo(() => computeHexbin(data, config), [data, config]);

  return (
    <g className="sportviz-hexbin">
      {cells.map((cell, i) => (
        <path
          key={i}
          d={cell.path}
          transform={`translate(${cell.x}, ${cell.y})`}
          fill={cell.fill}
          opacity={cell.opacity}
        />
      ))}
    </g>
  );
}
