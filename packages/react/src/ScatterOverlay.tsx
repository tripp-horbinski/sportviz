import React, { useMemo } from "react";
import { computeScatter, type DataPoint, type ScatterConfig } from "@sportviz/core";
import { useSurface } from "./context";

export interface ScatterOverlayProps extends ScatterConfig {
  data: DataPoint[];
}

export function ScatterOverlay({ data, ...config }: ScatterOverlayProps) {
  useSurface(); // Validate we're inside a surface

  const points = useMemo(() => computeScatter(data, config), [data, config]);

  return (
    <g className="sportviz-scatter">
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={point.r}
          fill={point.fill}
          opacity={point.opacity}
        />
      ))}
    </g>
  );
}
