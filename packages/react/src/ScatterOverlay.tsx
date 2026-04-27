import React, { useMemo } from "react";
import { computeScatter, type DataPoint, type ScatterConfig, type ScatterPoint } from "@basketball-ceo/core";
import { useSurface } from "./context";

export interface ScatterOverlayProps extends ScatterConfig {
  data: DataPoint[];
  /** Format tooltip for each point. Return null to suppress. */
  tooltip?: (point: DataPoint) => string | null;
  /** Called when a point is hovered. Null on mouse leave. */
  onPointHover?: (point: DataPoint | null, event: React.MouseEvent) => void;
  /** Called when a point is clicked. */
  onPointClick?: (point: DataPoint, event: React.MouseEvent) => void;
}

export function ScatterOverlay({
  data,
  tooltip,
  onPointHover,
  onPointClick,
  ...config
}: ScatterOverlayProps) {
  const { geometry } = useSurface();

  const courtRect = geometry.rects.find((r) => r.className === "court-outline");
  const interactive = !!(onPointHover || onPointClick);

  const points = useMemo(() => {
    const all = computeScatter(data, config);
    if (!courtRect) return all;
    // Only keep points whose full circle fits inside the court
    const minX = courtRect.x;
    const maxX = courtRect.x + courtRect.width;
    const minY = courtRect.y;
    const maxY = courtRect.y + courtRect.height;
    return all.filter((p) =>
      p.x - p.r >= minX &&
      p.x + p.r <= maxX &&
      p.y - p.r >= minY &&
      p.y + p.r <= maxY
    );
  }, [data, config, courtRect]);

  return (
    <g className="sportviz-scatter">
      {points.map((point, i) => {
        const tip = tooltip?.(point.data);
        return (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={point.r}
            fill={point.fill}
            opacity={point.opacity}
            style={interactive ? { cursor: "pointer" } : undefined}
            onMouseEnter={onPointHover ? (e) => onPointHover(point.data, e) : undefined}
            onMouseLeave={onPointHover ? (e) => onPointHover(null, e) : undefined}
            onClick={onPointClick ? (e) => onPointClick(point.data, e) : undefined}
          >
            {tip && <title>{tip}</title>}
          </circle>
        );
      })}
    </g>
  );
}
