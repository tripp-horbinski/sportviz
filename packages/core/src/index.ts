// Types
export type {
  Point,
  DataPoint,
  Orientation,
  SvgPath,
  SvgCircle,
  SvgLine,
  SvgRect,
  SurfaceGeometry,
  ColorScale,
  Theme,
  Zone,
  HexbinCell,
  Annotation,
  AnnotationMark,
  PlayPlayer,
  PlayFrame,
  PlaySequence,
} from "./types";

// Surfaces
export { basketballCourt, NBA } from "./surfaces";
export type { League } from "./surfaces";

// Layers
export { computeScatter, computeHexbin, computeZones, getZoneDefs } from "./layers";
export type {
  ScatterConfig,
  ScatterPoint,
  HexbinConfig,
  HexbinRenderCell,
  ZoneConfig,
  ZoneName,
} from "./layers";

// Scales
export { colorScale, blueRed, greenRed, redGreen, opacityScale } from "./scales";

// Themes
export { themes, light, dark, teamThemeMap } from "./themes";
export type { ThemeName } from "./themes";
