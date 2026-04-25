import React, { useMemo } from "react";
import { computeZones, redGreen, type DataPoint, type ZoneConfig, type ColorScale, type Zone } from "@sportviz/core";
import { useSurface } from "./context";

export interface ZoneOverlayProps {
  data: DataPoint[];
  /** Stat key to aggregate, or a function returning the value for each point */
  stat?: ZoneConfig["stat"];
  /** Color scale. Default: redGreen (for efficiency) */
  colorScale?: ColorScale;
  /** Min/max for normalizing values */
  domain?: [number, number];
  /** Opacity. Default: 0.6 */
  opacity?: number;
  /** Format tooltip for each zone. Return null to suppress. */
  tooltip?: (zone: { id: string; label: string; value: number }) => string | null;
  /** Called when a zone is hovered. Null on mouse leave. */
  onZoneHover?: (zone: Zone | null, event: React.MouseEvent) => void;
  /** Called when a zone is clicked. */
  onZoneClick?: (zone: Zone, event: React.MouseEvent) => void;
}

export function ZoneOverlay({
  data,
  stat,
  colorScale: scale = redGreen,
  domain,
  opacity = 0.6,
  tooltip,
  onZoneHover,
  onZoneClick,
}: ZoneOverlayProps) {
  useSurface();

  const interactive = !!(onZoneHover || onZoneClick);
  const config: ZoneConfig = { stat, colorScale: scale, domain, opacity };
  const zones = useMemo(() => computeZones(data, config), [data, stat, scale, domain, opacity]);

  // Compute normalized colors
  const values = zones.map((z) => z.value);
  const [minVal, maxVal] = domain ?? [
    Math.min(...values),
    Math.max(...values),
  ];
  const range = maxVal - minVal || 1;

  return (
    <g className="sportviz-zones">
      {zones.map((zone) => {
        const t = (zone.value - minVal) / range;
        const tip = tooltip?.(zone);
        return (
          <path
            key={zone.id}
            d={zone.path}
            fill={scale(t)}
            opacity={opacity}
            stroke="none"
            style={interactive ? { cursor: "pointer" } : undefined}
            onMouseEnter={onZoneHover ? (e) => onZoneHover(zone, e) : undefined}
            onMouseLeave={onZoneHover ? (e) => onZoneHover(null, e) : undefined}
            onClick={onZoneClick ? (e) => onZoneClick(zone, e) : undefined}
          >
            {tip && <title>{tip}</title>}
          </path>
        );
      })}
    </g>
  );
}
