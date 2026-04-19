import type { ColorScale } from "./types";

/** Interpolate between two hex colors */
function lerpColor(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);

  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

/** Create a color scale from an array of color stops */
export function colorScale(colors: string[]): ColorScale {
  return (t: number) => {
    const clamped = Math.max(0, Math.min(1, t));
    if (colors.length === 1) return colors[0];
    const segment = clamped * (colors.length - 1);
    const i = Math.floor(segment);
    const frac = segment - i;
    if (i >= colors.length - 1) return colors[colors.length - 1];
    return lerpColor(colors[i], colors[i + 1], frac);
  };
}

/** Blue (cold) to Red (hot) */
export const blueRed = colorScale(["#3b82f6", "#eab308", "#ef4444"]);

/** Green (good) to Red (bad) */
export const greenRed = colorScale(["#22c55e", "#eab308", "#ef4444"]);

/** Red (bad) to Green (good) — for efficiency metrics like FG% */
export const redGreen = colorScale(["#ef4444", "#eab308", "#22c55e"]);

/** Single color with opacity-based intensity */
export function opacityScale(color: string): (t: number) => string {
  return (t: number) => {
    const clamped = Math.max(0, Math.min(1, t));
    const alpha = Math.round(clamped * 255);
    return `${color}${alpha.toString(16).padStart(2, "0")}`;
  };
}
