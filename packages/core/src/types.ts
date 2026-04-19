/** A point in court/field coordinates (feet) */
export interface Point {
  x: number;
  y: number;
}

/** A data point with position and arbitrary metadata */
export interface DataPoint {
  x: number;
  y: number;
  [key: string]: unknown;
}

/** Surface orientation */
export type Orientation = "full" | "half";

/** SVG path element with styling hints */
export interface SvgPath {
  d: string;
  className: string;
}

/** SVG circle element */
export interface SvgCircle {
  cx: number;
  cy: number;
  r: number;
  className: string;
}

/** SVG line element */
export interface SvgLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  className: string;
}

/** SVG rect element */
export interface SvgRect {
  x: number;
  y: number;
  width: number;
  height: number;
  className: string;
}

/** Complete court/field geometry as SVG primitives */
export interface SurfaceGeometry {
  /** Viewbox: [minX, minY, width, height] */
  viewBox: [number, number, number, number];
  paths: SvgPath[];
  circles: SvgCircle[];
  lines: SvgLine[];
  rects: SvgRect[];
}

/** Color scale function: maps a value [0,1] to a CSS color string */
export type ColorScale = (t: number) => string;

/** Theme configuration */
export interface Theme {
  background: string;
  courtFill: string;
  courtStroke: string;
  courtStrokeWidth: number;
  paintFill: string;
}

/** Predefined shooting zone with computed stats */
export interface Zone {
  id: string;
  label: string;
  path: string;
  value: number;
}

/** Hexbin cell after aggregation */
export interface HexbinCell {
  x: number;
  y: number;
  points: DataPoint[];
  count: number;
}
