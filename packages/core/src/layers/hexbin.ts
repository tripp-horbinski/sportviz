import type { DataPoint, HexbinCell, ColorScale } from "../types";
import { blueRed } from "../scales";

export interface HexbinConfig {
  /** Hexagon radius in court units (feet). Default: 1.5 */
  radius?: number;
  /** Color scale mapping normalized value [0,1] to color. Default: blueRed */
  colorScale?: ColorScale;
  /** How to compute the color value for each cell */
  colorBy?: "count" | ((cell: HexbinCell) => number);
  /** Min opacity. Default: 0.3 */
  minOpacity?: number;
  /** Max opacity. Default: 0.9 */
  maxOpacity?: number;
}

export interface HexbinRenderCell {
  x: number;
  y: number;
  /** SVG path for the hexagon, centered at (0,0) — translate to (x,y) */
  path: string;
  fill: string;
  opacity: number;
  count: number;
  data: HexbinCell;
}

/** Assign points to hexagonal bins */
function binPoints(data: DataPoint[], radius: number): HexbinCell[] {
  const dx = radius * 2;
  const dy = radius * Math.sqrt(3);
  const bins = new Map<string, HexbinCell>();

  for (const point of data) {
    // Convert to hex grid coordinates
    let col = Math.round(point.x / dx);
    let row = Math.round(point.y / dy);

    // Offset odd rows
    const isOddRow = row & 1;
    const snapX = col * dx + (isOddRow ? radius : 0);
    const snapY = row * dy;

    const key = `${col},${row}`;
    let cell = bins.get(key);
    if (!cell) {
      cell = { x: snapX, y: snapY, points: [], count: 0 };
      bins.set(key, cell);
    }
    cell.points.push(point);
    cell.count++;
  }

  return Array.from(bins.values());
}

/** Generate a flat-top hexagon SVG path centered at origin */
function hexPath(radius: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return `M ${points.join(" L ")} Z`;
}

/** Compute hexbin cells for rendering */
export function computeHexbin(
  data: DataPoint[],
  config: HexbinConfig = {}
): HexbinRenderCell[] {
  const {
    radius = 1.5,
    colorScale: scale = blueRed,
    colorBy = "count",
    minOpacity = 0.3,
    maxOpacity = 0.9,
  } = config;

  const cells = binPoints(data, radius);
  if (cells.length === 0) return [];

  // Compute values for color mapping
  const valueFn =
    colorBy === "count" ? (cell: HexbinCell) => cell.count : colorBy;

  const values = cells.map(valueFn);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;

  const path = hexPath(radius);

  return cells.map((cell, i) => {
    const t = (values[i] - minVal) / range;
    return {
      x: cell.x,
      y: cell.y,
      path,
      fill: scale(t),
      opacity: minOpacity + t * (maxOpacity - minOpacity),
      count: cell.count,
      data: cell,
    };
  });
}
