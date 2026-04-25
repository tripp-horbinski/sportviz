import React from "react";
import type { Annotation } from "@sportviz/core";
import { useSurface } from "./context";

export interface AnnotationOverlayProps {
  annotations: Annotation[];
  /** Font size in court units. Default: 1.2 */
  fontSize?: number;
  /** Mark radius in court units. Default: 0.5 */
  markRadius?: number;
  /** Arrow stroke width in court units. Default: 0.12 */
  strokeWidth?: number;
}

export function AnnotationOverlay({
  annotations,
  fontSize = 1.2,
  markRadius = 0.5,
  strokeWidth = 0.12,
}: AnnotationOverlayProps) {
  useSurface();

  return (
    <g className="sportviz-annotations">
      {annotations.map((ann, i) => {
        const color = ann.color ?? "#ffffff";
        const mark = ann.mark ?? "dot";

        return (
          <g key={i}>
            {/* Arrow/line to target */}
            {ann.target && (
              <line
                x1={ann.x}
                y1={ann.y}
                x2={ann.target.x}
                y2={ann.target.y}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeWidth * 4} ${strokeWidth * 3}`}
                opacity={0.7}
              />
            )}

            {/* Mark */}
            {mark === "dot" && (
              <circle
                cx={ann.x}
                cy={ann.y}
                r={markRadius}
                fill={color}
                opacity={0.9}
              />
            )}
            {mark === "ring" && (
              <circle
                cx={ann.x}
                cy={ann.y}
                r={markRadius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth * 1.5}
                opacity={0.9}
              />
            )}
            {mark === "cross" && (
              <g opacity={0.9}>
                <line
                  x1={ann.x - markRadius * 0.7}
                  y1={ann.y - markRadius * 0.7}
                  x2={ann.x + markRadius * 0.7}
                  y2={ann.y + markRadius * 0.7}
                  stroke={color}
                  strokeWidth={strokeWidth * 1.5}
                />
                <line
                  x1={ann.x + markRadius * 0.7}
                  y1={ann.y - markRadius * 0.7}
                  x2={ann.x - markRadius * 0.7}
                  y2={ann.y + markRadius * 0.7}
                  stroke={color}
                  strokeWidth={strokeWidth * 1.5}
                />
              </g>
            )}

            {/* Label */}
            {ann.label && (
              <text
                x={ann.x}
                y={ann.y - markRadius - fontSize * 0.4}
                textAnchor="middle"
                fill={color}
                fontSize={fontSize}
                fontWeight={600}
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                style={{ pointerEvents: "none" }}
              >
                {ann.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
