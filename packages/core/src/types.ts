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
  /** Optional accent color for branding. Used by some overlays. */
  accent?: string;
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

/** Annotation mark type */
export type AnnotationMark = "dot" | "ring" | "cross" | "none";

/** A single annotation on the court */
export interface Annotation {
  /** Position in court coordinates */
  x: number;
  y: number;
  /** Text label */
  label?: string;
  /** Mark type at the position. Default: "dot" */
  mark?: AnnotationMark;
  /** Color for mark and label. Default: "#ffffff" */
  color?: string;
  /** Optional arrow/line pointing to a target position */
  target?: { x: number; y: number };
}

/** A player position within a play frame */
export interface PlayPlayer {
  id: string;
  x: number;
  y: number;
  /** Short label (jersey number or initials). Default: id */
  label?: string;
  /** Player color. Default: "#ffffff" */
  color?: string;
}

/** A single keyframe in a play sequence */
export interface PlayFrame {
  /** Normalized time 0–1 */
  time: number;
  /** Ball position */
  ball: Point;
  /** Player positions at this keyframe */
  players: PlayPlayer[];
}

/** A complete play sequence for animation */
export interface PlaySequence {
  /** Ordered keyframes (time should increase monotonically) */
  frames: PlayFrame[];
  /** Animation duration in seconds. Default: 3 */
  duration?: number;
  /** Ball color. Default: "#f97316" (orange) */
  ballColor?: string;
  /** Ball radius in court units. Default: 0.6 */
  ballRadius?: number;
  /** Whether to draw trail lines behind the ball. Default: true */
  showTrail?: boolean;
}
