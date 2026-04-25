import React, { useId, useMemo } from "react";
import {
  basketballCourt,
  NBA,
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
  /** URL of an image to render at center court (e.g. team logo) */
  centerLogo?: string;
  /** Size of center logo in court units. Default: 10 */
  centerLogoSize?: number;
  /** URL of a court background image (overhead photo). Replaces court fill color. */
  courtImage?: string;
  /** Rotation for courtImage in degrees (e.g. 90 for landscape→portrait). Default: 0 */
  courtImageRotation?: number;
  /** Offset the court image in court units {x, y} to align with coordinate system */
  courtImageOffset?: { x: number; y: number };
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
  centerLogo,
  centerLogoSize = 10,
  courtImage,
  courtImageRotation = 0,
  courtImageOffset,
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

  const clipId = useId();

  const [vbX, vbY, vbW, vbH] = geometry.viewBox;
  const viewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;

  const strokeWidth = resolvedTheme.courtStrokeWidth;

  // Court outline rect for clipping overlays
  const courtRect = geometry.rects.find((r) => r.className === "court-outline");

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
        {/* Defs: clip path to court boundary */}
        <defs>
          {courtRect && (
            <clipPath id={clipId}>
              <rect
                x={courtRect.x}
                y={courtRect.y}
                width={courtRect.width}
                height={courtRect.height}
              />
            </clipPath>
          )}
        </defs>

        {/* Background */}
        <rect
          x={vbX}
          y={vbY}
          width={vbW}
          height={vbH}
          fill={resolvedTheme.background}
        />

        {/* Court background image (when provided, replaces fill colors) */}
        {courtImage && courtRect && (() => {
          const isRotated = Math.abs(courtImageRotation) === 90 || courtImageRotation === 270;
          // For half court, the image covers the full court; clipPath shows only our half
          const fullW = courtRect.width;
          const fullH = orientation === "half" ? courtRect.height * 2 : courtRect.height;
          // Pivot at center of visible court rect
          const cx = courtRect.x + courtRect.width / 2;
          const cy = courtRect.y + courtRect.height / 2;
          // Image sized to full court, placed so visible half aligns with court rect
          const imgW = isRotated ? fullH : fullW;
          const imgH = isRotated ? fullW : fullH;
          const ox = courtImageOffset?.x ?? 0;
          const oy = courtImageOffset?.y ?? 0;
          return (
            <image
              href={courtImage}
              x={cx - imgW / 2 + ox}
              y={cy - imgH / 2 + oy}
              width={imgW}
              height={imgH}
              preserveAspectRatio="xMidYMin slice"
              transform={courtImageRotation ? `rotate(${courtImageRotation} ${cx} ${cy})` : undefined}
              clipPath={`url(#${clipId})`}
            />
          );
        })()}

        {/* Court elements */}
        {geometry.rects.map((rect, i) => (
          <rect
            key={`r-${i}`}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={
              courtImage
                ? "none"
                : rect.className === "paint"
                  ? resolvedTheme.paintFill
                  : rect.className === "court-outline"
                    ? resolvedTheme.courtFill
                    : "none"
            }
            stroke={courtImage ? "none" : resolvedTheme.courtStroke}
            strokeWidth={strokeWidth}
          />
        ))}

        {/* Court markings — hidden when courtImage provides its own */}
        {!courtImage && (
          <>
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
          </>
        )}

        {/* Center logo */}
        {centerLogo && (() => {
          const halfSize = centerLogoSize / 2;
          // Half court: logo at top edge (half-court line); full court: logo at midcourt
          const logoY = orientation === "half"
            ? NBA.halfCourtLength - NBA.basketFromBaseline - halfSize
            : (NBA.courtLength / 2) - NBA.basketFromBaseline - halfSize;
          return (
            <image
              href={centerLogo}
              x={-halfSize}
              y={logoY}
              width={centerLogoSize}
              height={centerLogoSize}
              opacity={0.15}
              preserveAspectRatio="xMidYMid meet"
            />
          );
        })()}

        {/* Data overlay layers — clipped to court boundary */}
        <g clipPath={courtRect ? `url(#${clipId})` : undefined}>
          {children}
        </g>
      </svg>
    </SurfaceContext.Provider>
  );
}
