import { describe, test, expect } from "bun:test";
import { basketballCourt, NBA } from "../src/surfaces/basketball";

describe("basketballCourt", () => {
  test("half court returns valid geometry", () => {
    const geo = basketballCourt("half");

    expect(geo.viewBox).toHaveLength(4);
    expect(geo.paths.length).toBeGreaterThan(0);
    expect(geo.circles.length).toBeGreaterThan(0);
    expect(geo.lines.length).toBeGreaterThan(0);
    expect(geo.rects.length).toBeGreaterThan(0);
  });

  test("half court viewbox covers correct area", () => {
    const geo = basketballCourt("half");
    const [minX, minY, width, height] = geo.viewBox;

    // Should span full court width (50ft) plus padding
    expect(width).toBeCloseTo(52, 0);
    // Should span half court length (47ft) plus padding
    expect(height).toBeCloseTo(49, 0);
  });

  test("full court viewbox covers correct area", () => {
    const geo = basketballCourt("full");
    const [minX, minY, width, height] = geo.viewBox;

    // Should span full court width (50ft) plus padding
    expect(width).toBeCloseTo(52, 0);
    // Should span full court length (94ft) plus padding
    expect(height).toBeCloseTo(96, 0);
  });

  test("half court has court outline", () => {
    const geo = basketballCourt("half");
    const outline = geo.rects.find((r) => r.className === "court-outline");

    expect(outline).toBeDefined();
    expect(outline!.width).toBe(NBA.courtWidth);
    expect(outline!.height).toBe(NBA.halfCourtLength);
  });

  test("half court has paint", () => {
    const geo = basketballCourt("half");
    const paint = geo.rects.find((r) => r.className === "paint");

    expect(paint).toBeDefined();
    expect(paint!.width).toBe(NBA.paintWidth);
  });

  test("half court has rim at origin", () => {
    const geo = basketballCourt("half");
    const rim = geo.circles.find((c) => c.className === "rim");

    expect(rim).toBeDefined();
    expect(rim!.cx).toBe(0);
    expect(rim!.cy).toBe(0);
    expect(rim!.r).toBe(NBA.rimRadius);
  });

  test("half court has three-point arc", () => {
    const geo = basketballCourt("half");
    const arc = geo.paths.find((p) => p.className === "three-point-arc");

    expect(arc).toBeDefined();
    expect(arc!.d).toContain("A"); // SVG arc command
  });

  test("half court has corner three lines", () => {
    const geo = basketballCourt("half");
    const corners = geo.lines.filter(
      (l) => l.className === "three-point-corner"
    );

    expect(corners).toHaveLength(2);
  });

  test("full court has two rims", () => {
    const geo = basketballCourt("full");
    const rims = geo.circles.filter((c) => c.className === "rim");

    expect(rims).toHaveLength(2);
  });

  test("full court has two paint areas", () => {
    const geo = basketballCourt("full");
    const paints = geo.rects.filter((r) => r.className === "paint");

    expect(paints).toHaveLength(2);
  });

  test("half court has center circle arc", () => {
    const geo = basketballCourt("half");
    const cc = geo.paths.find((p) => p.className === "center-circle");

    expect(cc).toBeDefined();
  });

  test("full court has center circle", () => {
    const geo = basketballCourt("full");
    const cc = geo.circles.find((c) => c.className === "center-circle");

    expect(cc).toBeDefined();
    expect(cc!.r).toBe(NBA.centerCircleRadius);
  });
});
