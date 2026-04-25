import React, { useEffect, useRef, useMemo, useCallback } from "react";
import type { PlaySequence, PlayFrame, Point } from "@sportviz/core";
import { useSurface } from "./context";

export interface PlayOverlayProps {
  sequence: PlaySequence;
  /** Current playback progress 0–1. Controlled externally. */
  progress: number;
  /** Player dot radius in court units. Default: 0.8 */
  playerRadius?: number;
  /** Whether to show player labels. Default: true */
  showLabels?: boolean;
}

/** Linearly interpolate between two points */
function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Find the two bracketing frames and interpolation factor */
function interpolateFrames(frames: PlayFrame[], progress: number) {
  const p = Math.max(0, Math.min(1, progress));

  // Find bracketing frames
  let before = frames[0];
  let after = frames[frames.length - 1];
  let segmentT = 0;

  for (let i = 0; i < frames.length - 1; i++) {
    if (p >= frames[i].time && p <= frames[i + 1].time) {
      before = frames[i];
      after = frames[i + 1];
      const span = after.time - before.time;
      segmentT = span > 0 ? (p - before.time) / span : 0;
      break;
    }
  }

  // If past last frame
  if (p >= frames[frames.length - 1].time) {
    before = frames[frames.length - 1];
    after = before;
    segmentT = 0;
  }

  return { before, after, t: segmentT };
}

/** Build SVG path string from ball positions at sampled progress values */
function buildTrailPath(frames: PlayFrame[], upTo: number, steps = 40): string {
  if (frames.length < 2 || upTo <= 0) return "";

  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = (i / steps) * upTo;
    const { before, after, t } = interpolateFrames(frames, p);
    pts.push(lerpPoint(before.ball, after.ball, t));
  }

  return pts
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`)
    .join(" ");
}

export function PlayOverlay({
  sequence,
  progress,
  playerRadius = 0.8,
  showLabels = true,
}: PlayOverlayProps) {
  useSurface();

  const {
    frames,
    ballColor = "#f97316",
    ballRadius = 0.6,
    showTrail = true,
  } = sequence;

  if (frames.length === 0) return null;

  const { before, after, t } = interpolateFrames(frames, progress);

  // Current ball position
  const ball = lerpPoint(before.ball, after.ball, t);

  // Current player positions
  const players = before.players.map((bp) => {
    const ap = after.players.find((p) => p.id === bp.id);
    if (!ap) return bp;
    return {
      ...bp,
      x: bp.x + (ap.x - bp.x) * t,
      y: bp.y + (ap.y - bp.y) * t,
    };
  });

  // Ball trail path
  const trailD = showTrail ? buildTrailPath(frames, progress) : "";

  const fontSize = playerRadius * 0.85;

  return (
    <g className="sportviz-play">
      {/* Ball trail */}
      {showTrail && trailD && (
        <path
          d={trailD}
          fill="none"
          stroke={ballColor}
          strokeWidth={0.15}
          strokeDasharray="0.6 0.3"
          opacity={0.5}
        />
      )}

      {/* Player dots */}
      {players.map((player) => {
        const color = player.color ?? "#ffffff";
        return (
          <g key={player.id}>
            <circle
              cx={player.x}
              cy={player.y}
              r={playerRadius}
              fill={color}
              opacity={0.85}
              stroke="#000"
              strokeWidth={0.08}
            />
            {showLabels && (
              <text
                x={player.x}
                y={player.y + fontSize * 0.35}
                textAnchor="middle"
                fill="#000"
                fontSize={fontSize}
                fontWeight={700}
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                style={{ pointerEvents: "none" }}
              >
                {player.label ?? player.id}
              </text>
            )}
          </g>
        );
      })}

      {/* Ball */}
      <circle
        cx={ball.x}
        cy={ball.y}
        r={ballRadius}
        fill={ballColor}
        stroke="#000"
        strokeWidth={0.08}
      />
    </g>
  );
}
