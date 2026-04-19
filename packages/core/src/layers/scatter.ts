import type { DataPoint } from "../types";

export interface ScatterConfig {
  /** Radius of each point in court units (feet). Default: 0.3 */
  radius?: number;
  /** Fixed color for all points, or a function mapping each point to a color */
  color?: string | ((point: DataPoint) => string);
  /** Opacity 0-1. Default: 0.7 */
  opacity?: number;
}

export interface ScatterPoint {
  x: number;
  y: number;
  r: number;
  fill: string;
  opacity: number;
  data: DataPoint;
}

/** Process data points for scatter rendering */
export function computeScatter(
  data: DataPoint[],
  config: ScatterConfig = {}
): ScatterPoint[] {
  const { radius = 0.3, color = "#ef4444", opacity = 0.7 } = config;
  const colorFn = typeof color === "function" ? color : () => color;

  return data.map((point) => ({
    x: point.x,
    y: point.y,
    r: radius,
    fill: colorFn(point),
    opacity,
    data: point,
  }));
}
