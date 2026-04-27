import type { DataPoint } from "@basketball-ceo/core";

/**
 * Sample shot chart data modeled after a typical NBA player's shot distribution.
 * Coordinates are in feet, origin at basket center.
 */

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateShots(count: number): DataPoint[] {
  const shots: DataPoint[] = [];

  for (let i = 0; i < count; i++) {
    const zone = Math.random();
    let x: number, y: number, made: boolean;

    if (zone < 0.25) {
      // Restricted area — high efficiency
      const angle = rand(0, Math.PI);
      const r = rand(0, 4);
      x = r * Math.cos(angle);
      y = r * Math.sin(angle);
      made = Math.random() < 0.65;
    } else if (zone < 0.35) {
      // Mid-range — lower efficiency
      const angle = rand(0.1, Math.PI - 0.1);
      const r = rand(8, 20);
      x = r * Math.cos(angle);
      y = r * Math.sin(angle);
      made = Math.random() < 0.40;
    } else if (zone < 0.55) {
      // Corner three — decent efficiency
      const side = Math.random() < 0.5 ? -1 : 1;
      x = side * rand(22, 24);
      y = rand(-4, 7);
      made = Math.random() < 0.38;
    } else if (zone < 0.85) {
      // Above the break three
      const angle = rand(0.3, Math.PI - 0.3);
      const r = rand(23.75, 28);
      x = r * Math.cos(angle);
      y = r * Math.sin(angle);
      made = Math.random() < 0.36;
    } else {
      // Paint (non-restricted)
      x = rand(-7, 7);
      y = rand(4, 13);
      made = Math.random() < 0.45;
    }

    shots.push({ x, y, made });
  }

  return shots;
}

export const sampleShots = generateShots(300);
