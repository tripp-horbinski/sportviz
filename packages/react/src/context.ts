import { createContext, useContext } from "react";
import type { Theme, SurfaceGeometry } from "@basketball-ceo/core";

export interface CourtContext {
  geometry: SurfaceGeometry;
  theme: Theme;
}

export const SurfaceContext = createContext<CourtContext | null>(null);

export function useSurface(): CourtContext {
  const ctx = useContext(SurfaceContext);
  if (!ctx) {
    throw new Error(
      "sportviz: Overlay components must be rendered inside a surface component (e.g. <BasketballCourt>)"
    );
  }
  return ctx;
}
