import type { Theme } from "./types";

export const light: Theme = {
  background: "#ffffff",
  courtFill: "#f0e6d2",
  courtStroke: "#333333",
  courtStrokeWidth: 0.15,
  paintFill: "#e8d5b7",
};

export const dark: Theme = {
  background: "#1a1a2e",
  courtFill: "#16213e",
  courtStroke: "#e0e0e0",
  courtStrokeWidth: 0.15,
  paintFill: "#0f3460",
};

export const themes = { light, dark } as const;
export type ThemeName = keyof typeof themes;
