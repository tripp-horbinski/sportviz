import type { Orientation, SurfaceGeometry, SvgPath, SvgCircle, SvgLine, SvgRect } from "../types";

/**
 * NBA court dimensions in feet.
 * Coordinate system: origin at basket center, +X right, +Y toward halfcourt.
 */
export const NBA = {
  courtWidth: 50,
  courtLength: 94,
  halfCourtLength: 47,

  // Basket position (origin)
  basketFromBaseline: 5.25,

  // Three-point line
  threePointRadius: 23.75,
  threePointSideDistance: 22, // horizontal distance at corners
  threePointSideHeight: 14 - 5.25, // corner 3 extends 14ft from baseline, adjusted for origin

  // Paint / key
  paintWidth: 16,
  paintLength: 19 - 5.25, // 19ft from baseline to free throw line, adjusted
  paintOuterWidth: 16, // lane width

  // Free throw circle
  freeThrowRadius: 6,

  // Restricted area
  restrictedRadius: 4,

  // Rim and backboard
  rimRadius: 0.75,
  backboardWidth: 6,
  backboardOffset: -1.0, // behind the basket center

  // Center circle
  centerCircleRadius: 6,
} as const;

export type League = "nba";

/** Generate SVG geometry for a basketball court */
export function basketballCourt(
  orientation: Orientation = "half",
  _league: League = "nba"
): SurfaceGeometry {
  const dim = NBA;
  const halfW = dim.courtWidth / 2;
  const baselineY = -dim.basketFromBaseline;
  const halfCourtY = dim.halfCourtLength - dim.basketFromBaseline;

  const paths: SvgPath[] = [];
  const circles: SvgCircle[] = [];
  const lines: SvgLine[] = [];
  const rects: SvgRect[] = [];

  // Court outline
  if (orientation === "half") {
    rects.push({
      x: -halfW,
      y: baselineY,
      width: dim.courtWidth,
      height: dim.halfCourtLength,
      className: "court-outline",
    });
  } else {
    rects.push({
      x: -halfW,
      y: baselineY,
      width: dim.courtWidth,
      height: dim.courtLength,
      className: "court-outline",
    });
  }

  // Paint / key
  const paintHalfW = dim.paintWidth / 2;
  rects.push({
    x: -paintHalfW,
    y: baselineY,
    width: dim.paintWidth,
    height: dim.paintLength + dim.basketFromBaseline,
    className: "paint",
  });

  // Free throw line
  lines.push({
    x1: -paintHalfW,
    y1: dim.paintLength,
    x2: paintHalfW,
    y2: dim.paintLength,
    className: "free-throw-line",
  });

  // Free throw circle (top half — solid arc above free throw line)
  const ftR = dim.freeThrowRadius;
  const ftY = dim.paintLength;
  paths.push({
    d: describeArc(0, ftY, ftR, 0, Math.PI),
    className: "free-throw-circle-top",
  });

  // Free throw circle (bottom half — dashed arc below free throw line)
  paths.push({
    d: describeArc(0, ftY, ftR, Math.PI, 2 * Math.PI),
    className: "free-throw-circle-bottom",
  });

  // Restricted area arc
  paths.push({
    d: describeArc(0, 0, dim.restrictedRadius, 0, Math.PI),
    className: "restricted-area",
  });

  // Restricted area sides down to baseline
  lines.push({
    x1: -dim.restrictedRadius,
    y1: 0,
    x2: -dim.restrictedRadius,
    y2: baselineY,
    className: "restricted-area",
  });
  lines.push({
    x1: dim.restrictedRadius,
    y1: 0,
    x2: dim.restrictedRadius,
    y2: baselineY,
    className: "restricted-area",
  });

  // Rim
  circles.push({
    cx: 0,
    cy: 0,
    r: dim.rimRadius,
    className: "rim",
  });

  // Backboard
  lines.push({
    x1: -dim.backboardWidth / 2,
    y1: dim.backboardOffset,
    x2: dim.backboardWidth / 2,
    y2: dim.backboardOffset,
    className: "backboard",
  });

  // Three-point line
  const tpR = dim.threePointRadius;
  const cornerY = dim.threePointSideHeight;
  const cornerX = dim.threePointSideDistance;

  // Calculate angle where arc meets the corner line
  const tpAngle = Math.acos(cornerX / tpR);

  // Arc portion
  paths.push({
    d: describeArc(0, 0, tpR, tpAngle, Math.PI - tpAngle),
    className: "three-point-arc",
  });

  // Corner three lines (straight portions along sidelines)
  lines.push({
    x1: -cornerX,
    y1: baselineY,
    x2: -cornerX,
    y2: cornerY,
    className: "three-point-corner",
  });
  lines.push({
    x1: cornerX,
    y1: baselineY,
    x2: cornerX,
    y2: cornerY,
    className: "three-point-corner",
  });

  // Half court line
  if (orientation === "half") {
    lines.push({
      x1: -halfW,
      y1: halfCourtY,
      x2: halfW,
      y2: halfCourtY,
      className: "half-court-line",
    });
  }

  // Center circle (visible at half court line)
  if (orientation === "half") {
    // Bottom half of center circle visible from half court
    paths.push({
      d: describeArc(0, halfCourtY, dim.centerCircleRadius, Math.PI, 2 * Math.PI),
      className: "center-circle",
    });
  } else {
    // Full center circle at midcourt
    const midY = dim.courtLength / 2 - dim.basketFromBaseline;
    circles.push({
      cx: 0,
      cy: midY,
      r: dim.centerCircleRadius,
      className: "center-circle",
    });
    // Half court line
    lines.push({
      x1: -halfW,
      y1: midY,
      x2: halfW,
      y2: midY,
      className: "half-court-line",
    });
  }

  // Full court: mirror everything for the other half
  if (orientation === "full") {
    const mirrorY = dim.courtLength - dim.basketFromBaseline;
    const farBasketY = mirrorY;
    const farBaselineY = mirrorY + dim.basketFromBaseline;

    // Far paint
    rects.push({
      x: -paintHalfW,
      y: farBasketY - dim.paintLength,
      width: dim.paintWidth,
      height: dim.paintLength + dim.basketFromBaseline,
      className: "paint",
    });

    // Far free throw line
    lines.push({
      x1: -paintHalfW,
      y1: farBasketY - dim.paintLength,
      x2: paintHalfW,
      y2: farBasketY - dim.paintLength,
      className: "free-throw-line",
    });

    // Far free throw circle
    paths.push({
      d: describeArc(0, farBasketY - dim.paintLength, ftR, Math.PI, 2 * Math.PI),
      className: "free-throw-circle-top",
    });
    paths.push({
      d: describeArc(0, farBasketY - dim.paintLength, ftR, 0, Math.PI),
      className: "free-throw-circle-bottom",
    });

    // Far restricted area
    paths.push({
      d: describeArc(0, farBasketY, dim.restrictedRadius, Math.PI, 2 * Math.PI),
      className: "restricted-area",
    });
    lines.push({
      x1: -dim.restrictedRadius,
      y1: farBasketY,
      x2: -dim.restrictedRadius,
      y2: farBaselineY,
      className: "restricted-area",
    });
    lines.push({
      x1: dim.restrictedRadius,
      y1: farBasketY,
      x2: dim.restrictedRadius,
      y2: farBaselineY,
      className: "restricted-area",
    });

    // Far rim
    circles.push({
      cx: 0,
      cy: farBasketY,
      r: dim.rimRadius,
      className: "rim",
    });

    // Far backboard
    lines.push({
      x1: -dim.backboardWidth / 2,
      y1: farBasketY - dim.backboardOffset,
      x2: dim.backboardWidth / 2,
      y2: farBasketY - dim.backboardOffset,
      className: "backboard",
    });

    // Far three-point line
    const farCornerY = farBasketY - dim.threePointSideHeight;
    paths.push({
      d: describeArc(0, farBasketY, tpR, Math.PI + tpAngle, 2 * Math.PI - tpAngle),
      className: "three-point-arc",
    });
    lines.push({
      x1: -cornerX,
      y1: farBaselineY,
      x2: -cornerX,
      y2: farCornerY,
      className: "three-point-corner",
    });
    lines.push({
      x1: cornerX,
      y1: farBaselineY,
      x2: cornerX,
      y2: farCornerY,
      className: "three-point-corner",
    });
  }

  // Compute viewBox
  const padding = 1;
  let vbHeight: number;
  if (orientation === "half") {
    vbHeight = dim.halfCourtLength + 2 * padding;
  } else {
    vbHeight = dim.courtLength + 2 * padding;
  }

  return {
    viewBox: [
      -halfW - padding,
      baselineY - padding,
      dim.courtWidth + 2 * padding,
      vbHeight,
    ],
    paths,
    circles,
    lines,
    rects,
  };
}

/**
 * Describe an SVG arc path.
 * Draws from startAngle to endAngle (radians, 0 = right, PI/2 = up in math coords).
 * We flip Y for SVG (Y increases downward in SVG but we handle that in the viewBox).
 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const startX = cx + r * Math.cos(startAngle);
  const startY = cy + r * Math.sin(startAngle);
  const endX = cx + r * Math.cos(endAngle);
  const endY = cy + r * Math.sin(endAngle);

  const angleDiff = endAngle - startAngle;
  const largeArc = angleDiff > Math.PI ? 1 : 0;

  return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
}
