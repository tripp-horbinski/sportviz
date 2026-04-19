import type { DataPoint, ColorScale, Zone } from "../types";
import { redGreen } from "../scales";
import { NBA } from "../surfaces/basketball";

/** Predefined NBA shooting zone definitions */
export type ZoneName =
  | "restricted-area"
  | "paint-non-ra"
  | "mid-left"
  | "mid-right"
  | "mid-center"
  | "mid-left-baseline"
  | "mid-right-baseline"
  | "three-left-corner"
  | "three-right-corner"
  | "three-left-wing"
  | "three-right-wing"
  | "three-center";

interface ZoneDef {
  id: ZoneName;
  label: string;
  /** Test if a point (in court coordinates) falls in this zone */
  contains: (x: number, y: number) => boolean;
  /** SVG path for the zone shape */
  path: string;
}

const TP_R = NBA.threePointRadius;
const RA_R = NBA.restrictedRadius;
const PAINT_W = NBA.paintWidth / 2;
const PAINT_TOP = NBA.paintLength;
const BASELINE = -NBA.basketFromBaseline;
const CORNER_X = NBA.threePointSideDistance;
const CORNER_Y = NBA.threePointSideHeight;
const HALF_W = NBA.courtWidth / 2;

function dist(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function arcPath(r: number, startAngle: number, endAngle: number): string {
  const sx = r * Math.cos(startAngle);
  const sy = r * Math.sin(startAngle);
  const ex = r * Math.cos(endAngle);
  const ey = r * Math.sin(endAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

/** Angle at which 3pt arc meets the corner line */
const TP_ANGLE = Math.acos(CORNER_X / TP_R);

const ZONE_DEFS: ZoneDef[] = [
  {
    id: "restricted-area",
    label: "Restricted Area",
    contains: (x, y) => dist(x, y) <= RA_R && y >= BASELINE,
    path: `M ${-RA_R} ${BASELINE} L ${-RA_R} 0 ${arcPath(RA_R, Math.PI, 0).replace("A", "A")} L ${RA_R} ${BASELINE} Z`.replace(
      /A/,
      `L ${-RA_R} 0 A`
    ),
  },
  {
    id: "paint-non-ra",
    label: "In The Paint (Non-RA)",
    contains: (x, y) =>
      Math.abs(x) <= PAINT_W && y >= BASELINE && y <= PAINT_TOP && dist(x, y) > RA_R,
    path: (() => {
      const raArc = arcPath(RA_R, Math.PI, 0);
      return `M ${-PAINT_W} ${BASELINE} L ${-PAINT_W} ${PAINT_TOP} L ${PAINT_W} ${PAINT_TOP} L ${PAINT_W} ${BASELINE} L ${RA_R} ${BASELINE} L ${RA_R} 0 ${arcPath(RA_R, 0, Math.PI)} L ${-RA_R} ${BASELINE} Z`;
    })(),
  },
  {
    id: "mid-center",
    label: "Mid-Range Center",
    contains: (x, y) =>
      dist(x, y) <= TP_R &&
      dist(x, y) > RA_R &&
      y > PAINT_TOP &&
      Math.abs(x) <= PAINT_W,
    path: `M ${-PAINT_W} ${PAINT_TOP} L ${-PAINT_W} ${Math.sqrt(TP_R * TP_R - PAINT_W * PAINT_W)} ${arcPath(TP_R, Math.PI - Math.acos(PAINT_W / TP_R), Math.acos(PAINT_W / TP_R))} L ${PAINT_W} ${PAINT_TOP} Z`,
  },
  {
    id: "mid-left",
    label: "Mid-Range Left",
    contains: (x, y) =>
      x < -PAINT_W && dist(x, y) <= TP_R && y > CORNER_Y && dist(x, y) > RA_R,
    path: `M ${-PAINT_W} ${PAINT_TOP} L ${-PAINT_W} ${Math.sqrt(TP_R * TP_R - PAINT_W * PAINT_W)} ${arcPath(TP_R, Math.PI - Math.acos(PAINT_W / TP_R), Math.PI - TP_ANGLE)} L ${-CORNER_X} ${CORNER_Y} L ${-PAINT_W} ${CORNER_Y} Z`,
  },
  {
    id: "mid-right",
    label: "Mid-Range Right",
    contains: (x, y) =>
      x > PAINT_W && dist(x, y) <= TP_R && y > CORNER_Y && dist(x, y) > RA_R,
    path: `M ${PAINT_W} ${PAINT_TOP} L ${PAINT_W} ${CORNER_Y} L ${CORNER_X} ${CORNER_Y} ${arcPath(TP_R, TP_ANGLE, Math.acos(PAINT_W / TP_R))} L ${PAINT_W} ${Math.sqrt(TP_R * TP_R - PAINT_W * PAINT_W)} Z`,
  },
  {
    id: "mid-left-baseline",
    label: "Mid-Range Left Baseline",
    contains: (x, y) =>
      x < -PAINT_W && y >= BASELINE && y <= CORNER_Y && dist(x, y) <= TP_R,
    path: `M ${-PAINT_W} ${BASELINE} L ${-PAINT_W} ${CORNER_Y} L ${-CORNER_X} ${CORNER_Y} L ${-CORNER_X} ${BASELINE} Z`,
  },
  {
    id: "mid-right-baseline",
    label: "Mid-Range Right Baseline",
    contains: (x, y) =>
      x > PAINT_W && y >= BASELINE && y <= CORNER_Y && dist(x, y) <= TP_R,
    path: `M ${PAINT_W} ${BASELINE} L ${PAINT_W} ${CORNER_Y} L ${CORNER_X} ${CORNER_Y} L ${CORNER_X} ${BASELINE} Z`,
  },
  {
    id: "three-left-corner",
    label: "Left Corner 3",
    contains: (x, y) =>
      x < -CORNER_X && y >= BASELINE && y <= CORNER_Y,
    path: `M ${-HALF_W} ${BASELINE} L ${-HALF_W} ${CORNER_Y} L ${-CORNER_X} ${CORNER_Y} L ${-CORNER_X} ${BASELINE} Z`,
  },
  {
    id: "three-right-corner",
    label: "Right Corner 3",
    contains: (x, y) =>
      x > CORNER_X && y >= BASELINE && y <= CORNER_Y,
    path: `M ${HALF_W} ${BASELINE} L ${HALF_W} ${CORNER_Y} L ${CORNER_X} ${CORNER_Y} L ${CORNER_X} ${BASELINE} Z`,
  },
  {
    id: "three-left-wing",
    label: "Left Wing 3",
    contains: (x, y) => {
      const angle = Math.atan2(y, x);
      return dist(x, y) > TP_R && x < 0 && angle > Math.PI / 2 + 0.01 && y > CORNER_Y;
    },
    path: `M ${-HALF_W} ${CORNER_Y} L ${-HALF_W} ${NBA.halfCourtLength - NBA.basketFromBaseline} L 0 ${NBA.halfCourtLength - NBA.basketFromBaseline} L ${-TP_R * Math.cos(Math.PI - TP_ANGLE)} ${TP_R * Math.sin(Math.PI - TP_ANGLE)} ${arcPath(TP_R, Math.PI - TP_ANGLE, Math.PI)} L ${-CORNER_X} ${CORNER_Y} Z`,
  },
  {
    id: "three-right-wing",
    label: "Right Wing 3",
    contains: (x, y) => {
      const angle = Math.atan2(y, x);
      return dist(x, y) > TP_R && x > 0 && angle < Math.PI / 2 - 0.01 && y > CORNER_Y;
    },
    path: `M ${HALF_W} ${CORNER_Y} L ${CORNER_X} ${CORNER_Y} ${arcPath(TP_R, 0, TP_ANGLE)} L ${TP_R * Math.cos(TP_ANGLE)} ${TP_R * Math.sin(TP_ANGLE)} L ${HALF_W} ${NBA.halfCourtLength - NBA.basketFromBaseline} Z`,
  },
  {
    id: "three-center",
    label: "Center 3",
    contains: (x, y) => {
      const angle = Math.atan2(y, x);
      return dist(x, y) > TP_R && angle >= TP_ANGLE && angle <= Math.PI - TP_ANGLE;
    },
    path: (() => {
      const topY = NBA.halfCourtLength - NBA.basketFromBaseline;
      const lx = TP_R * Math.cos(Math.PI - TP_ANGLE);
      const ly = TP_R * Math.sin(Math.PI - TP_ANGLE);
      const rx = TP_R * Math.cos(TP_ANGLE);
      const ry = TP_R * Math.sin(TP_ANGLE);
      return `M ${lx} ${ly} ${arcPath(TP_R, Math.PI - TP_ANGLE, TP_ANGLE)} L ${rx} ${topY} L ${lx} ${topY} Z`;
    })(),
  },
];

export interface ZoneConfig {
  /** Stat key to aggregate, or a function returning the value for each point */
  stat?: string | ((points: DataPoint[]) => number);
  /** Color scale. Default: redGreen (for efficiency) */
  colorScale?: ColorScale;
  /** Min/max for normalizing values. If omitted, computed from data */
  domain?: [number, number];
  /** Opacity. Default: 0.6 */
  opacity?: number;
}

/** Compute zone overlays from shot data */
export function computeZones(
  data: DataPoint[],
  config: ZoneConfig = {}
): Zone[] {
  const {
    stat = "made",
    colorScale: scale = redGreen,
    domain,
    opacity = 0.6,
  } = config;

  // Bin points into zones
  const zoneBins = new Map<string, DataPoint[]>();
  for (const def of ZONE_DEFS) {
    zoneBins.set(def.id, []);
  }

  for (const point of data) {
    for (const def of ZONE_DEFS) {
      if (def.contains(point.x, point.y)) {
        zoneBins.get(def.id)!.push(point);
        break;
      }
    }
  }

  // Compute stat value per zone
  const statFn =
    typeof stat === "function"
      ? stat
      : (points: DataPoint[]) => {
          if (points.length === 0) return 0;
          const made = points.filter((p) => p[stat]).length;
          return made / points.length;
        };

  const zones: { def: ZoneDef; value: number; count: number }[] = [];
  for (const def of ZONE_DEFS) {
    const points = zoneBins.get(def.id)!;
    zones.push({ def, value: statFn(points), count: points.length });
  }

  // Normalize
  const values = zones.map((z) => z.value);
  const [minVal, maxVal] = domain ?? [Math.min(...values), Math.max(...values)];
  const range = maxVal - minVal || 1;

  return zones
    .filter((z) => z.count > 0)
    .map((z) => ({
      id: z.def.id,
      label: z.def.label,
      path: z.def.path,
      value: z.value,
    }));
}

/** Get the zone definitions (useful for rendering empty zones) */
export function getZoneDefs(): { id: ZoneName; label: string; path: string }[] {
  return ZONE_DEFS.map((d) => ({ id: d.id, label: d.label, path: d.path }));
}
