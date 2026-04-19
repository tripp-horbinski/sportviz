import React, { useMemo } from "react";
import {
  basketballCourt,
  themes,
  type Orientation,
  type League,
  type Theme,
  type ThemeName,
} from "@sportviz/core";
import { SurfaceContext } from "./context";

export interface BasketballCourtProps {
  /** Court orientation. Default: "half" */
  orientation?: Orientation;
  /** League for court dimensions. Default: "nba" */
  league?: League;
  /** Theme name or custom theme object. Default: "light" */
  theme?: ThemeName | Theme;
  /** Width of the SVG element. Default: "100%" */
  width?: string | number;
  /** Height of the SVG element. Auto-computed from aspect ratio if omitted */
  height?: string | number;
  /** Additional CSS class for the SVG element */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Data overlay components */
  children?: React.ReactNode;
}

export function BasketballCourt({
  orientation = "half",
  league = "nba",
  theme: themeProp = "light",
  width = "100%",
  height,
  className,
  style,
  children,
}: BasketballCourtProps) {
  const geometry = useMemo(
    () => basketballCourt(orientation, league),
    [orientation, league]
  );

  const resolvedTheme: Theme = useMemo(
    () => (typeof themeProp === "string" ? themes[themeProp] : themeProp),
    [themeProp]
  );

  const [vbX, vbY, vbW, vbH] = geometry.viewBox;
  const viewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;

  const strokeWidth = resolvedTheme.courtStrokeWidth;

  return (
    <SurfaceContext.Provider value={{ geometry, theme: resolvedTheme }}>
      <svg
        viewBox={viewBox}
        width={width}
        height={height}
        className={className}
        style={{ ...style, overflow: "hidden" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect
          x={vbX}
          y={vbY}
          width={vbW}
          height={vbH}
          fill={resolvedTheme.background}
        />

        {/* Court elements */}
        {geometry.rects.map((rect, i) => (
          <rect
            key={`r-${i}`}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={
              rect.className === "paint"
                ? resolvedTheme.paintFill
                : rect.className === "court-outline"
                  ? resolvedTheme.courtFill
                  : "none"
            }
            stroke={resolvedTheme.courtStroke}
            strokeWidth={strokeWidth}
          />
        ))}

        {geometry.paths.map((path, i) => (
          <path
            key={`p-${i}`}
            d={path.d}
            fill="none"
            stroke={resolvedTheme.courtStroke}
            strokeWidth={strokeWidth}
            strokeDasharray={
              path.className === "free-throw-circle-bottom"
                ? `${strokeWidth * 6} ${strokeWidth * 6}`
                : undefined
            }
          />
        ))}

        {geometry.lines.map((line, i) => (
          <line
            key={`l-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={resolvedTheme.courtStroke}
            strokeWidth={
              line.className === "backboard"
                ? strokeWidth * 2
                : strokeWidth
            }
          />
        ))}

        {geometry.circles.map((circle, i) => (
          <circle
            key={`c-${i}`}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill="none"
            stroke={resolvedTheme.courtStroke}
            strokeWidth={
              circle.className === "rim"
                ? strokeWidth * 1.5
                : strokeWidth
            }
          />
        ))}

        {/* Data overlay layers */}
        {children}
      </svg>
    </SurfaceContext.Provider>
  );
}
