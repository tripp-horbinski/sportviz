import { describe, test, expect } from "bun:test";
import { computeScatter } from "../src/layers/scatter";
import { computeHexbin } from "../src/layers/hexbin";
import { computeZones } from "../src/layers/zones";
import type { DataPoint } from "../src/types";

const sampleShots: DataPoint[] = [
  { x: 0, y: 0, made: true },       // at the rim
  { x: 0, y: 1, made: true },       // restricted area
  { x: 5, y: 10, made: false },     // mid-range
  { x: -5, y: 10, made: true },     // mid-range
  { x: 20, y: 15, made: false },    // three-point
  { x: -22, y: -3, made: true },    // corner three
  { x: 0, y: 25, made: false },     // deep three
  { x: 10, y: 5, made: true },      // mid-range
  { x: -10, y: 5, made: false },    // mid-range
  { x: 0, y: 4, made: true },       // paint
];

describe("computeScatter", () => {
  test("returns same number of points as input", () => {
    const result = computeScatter(sampleShots);
    expect(result).toHaveLength(sampleShots.length);
  });

  test("preserves coordinates", () => {
    const result = computeScatter(sampleShots);
    expect(result[0].x).toBe(0);
    expect(result[0].y).toBe(0);
  });

  test("applies default config", () => {
    const result = computeScatter(sampleShots);
    expect(result[0].r).toBe(0.3);
    expect(result[0].opacity).toBe(0.7);
  });

  test("applies custom color function", () => {
    const result = computeScatter(sampleShots, {
      color: (p) => (p.made ? "green" : "red"),
    });
    expect(result[0].fill).toBe("green");
    expect(result[2].fill).toBe("red");
  });
});

describe("computeHexbin", () => {
  test("returns cells for non-empty data", () => {
    const result = computeHexbin(sampleShots);
    expect(result.length).toBeGreaterThan(0);
  });

  test("total point count matches input", () => {
    const result = computeHexbin(sampleShots);
    const total = result.reduce((sum, cell) => sum + cell.count, 0);
    expect(total).toBe(sampleShots.length);
  });

  test("returns empty for empty data", () => {
    const result = computeHexbin([]);
    expect(result).toHaveLength(0);
  });

  test("respects custom radius", () => {
    const small = computeHexbin(sampleShots, { radius: 0.5 });
    const large = computeHexbin(sampleShots, { radius: 5 });

    // Smaller radius = more bins
    expect(small.length).toBeGreaterThanOrEqual(large.length);
  });

  test("cells have valid SVG path", () => {
    const result = computeHexbin(sampleShots);
    expect(result[0].path).toContain("M ");
    expect(result[0].path).toContain("Z");
  });
});

describe("computeZones", () => {
  test("returns zones for non-empty data", () => {
    const result = computeZones(sampleShots);
    expect(result.length).toBeGreaterThan(0);
  });

  test("zones have valid ids", () => {
    const result = computeZones(sampleShots);
    for (const zone of result) {
      expect(zone.id).toBeTruthy();
      expect(zone.path).toBeTruthy();
    }
  });

  test("returns empty zones for empty data", () => {
    const result = computeZones([]);
    expect(result).toHaveLength(0);
  });
});
