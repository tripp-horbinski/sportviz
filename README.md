# sportviz

Composable sports data visualization for React. NBA court surfaces with scatter, hexbin, zone, annotation, and play animation overlays.

## Install

```bash
npm install @basketball-ceo/sportviz
```

## Quick Start

```tsx
import { BasketballCourt, ScatterOverlay } from "@basketball-ceo/sportviz";

const shots = [
  { x: 0, y: 1, made: true },
  { x: -5, y: 15, made: false },
  { x: 22, y: 3, made: true },
];

function ShotChart() {
  return (
    <BasketballCourt theme="dark" orientation="half">
      <ScatterOverlay
        data={shots}
        radius={0.4}
        color={(p) => (p.made ? "#22c55e" : "#ef4444")}
      />
    </BasketballCourt>
  );
}
```

## Overlays

### Scatter

Individual data points on the court.

```tsx
<ScatterOverlay
  data={shots}
  radius={0.4}
  color={(p) => (p.made ? "#22c55e" : "#ef4444")}
  opacity={0.75}
  onPointHover={(point, e) => console.log(point)}
  onPointClick={(point, e) => console.log(point)}
/>
```

### Hexbin

Aggregate data into hexagonal bins with color-coded frequency.

```tsx
import { blueRed } from "@basketball-ceo/sportviz";

<HexbinOverlay
  data={shots}
  radius={1.8}
  colorScale={blueRed}
  onCellHover={(cell, e) => console.log(cell?.count)}
/>
```

### Zones

NBA shooting zones with computed efficiency stats.

```tsx
import { redGreen } from "@basketball-ceo/sportviz";

<ZoneOverlay
  data={shots}
  stat="made"
  colorScale={redGreen}
  opacity={0.5}
  onZoneHover={(zone, e) => console.log(zone?.label, zone?.value)}
/>
```

### Annotations

Labels, markers, and arrows on the court.

```tsx
<AnnotationOverlay
  annotations={[
    { x: 0, y: 1.5, label: "Rim", mark: "ring", color: "#22c55e" },
    { x: -22, y: 1, label: "L Corner", mark: "dot", color: "#f59e0b" },
    { x: 10, y: 15, label: "Spot", mark: "cross", target: { x: 0, y: 0 } },
  ]}
/>
```

### Play Animation

Animated play sequences with ball trail and player movement.

```tsx
const play: PlaySequence = {
  duration: 3,
  frames: [
    {
      time: 0,
      ball: { x: 0, y: 25 },
      players: [
        { id: "1", label: "PG", x: 0, y: 25, color: "#3b82f6" },
        { id: "2", label: "C", x: 5, y: 15, color: "#3b82f6" },
      ],
    },
    {
      time: 1,
      ball: { x: 0, y: 2 },
      players: [
        { id: "1", label: "PG", x: -8, y: 10, color: "#3b82f6" },
        { id: "2", label: "C", x: 0, y: 2, color: "#3b82f6" },
      ],
    },
  ],
};

<PlayOverlay sequence={play} progress={0.5} />
```

## Court Options

```tsx
<BasketballCourt
  theme="dark"              // "light" | "dark" | "lakers" | "celtics" | ... (30 NBA teams)
  orientation="half"        // "half" | "full"
  centerLogo="/logo.png"    // optional center court image
  centerLogoSize={10}       // logo size in court units (feet)
/>
```

### Team Themes

All 30 NBA teams available as themes. Wood-toned court with team colors on paint and lines.

```tsx
<BasketballCourt theme="warriors" />  // blue paint, gold lines
<BasketballCourt theme="lakers" />    // purple paint, gold lines
<BasketballCourt theme="celtics" />   // green paint, white lines
```

Map team abbreviations to theme names:

```tsx
import { teamThemeMap } from "@basketball-ceo/sportviz";

const theme = teamThemeMap["GSW"]; // "warriors"
```

## Coordinate System

Origin at basket center, units in feet. +X is right, +Y is toward halfcourt.

- Basket: `(0, 0)`
- Free throw line: `(0, 13.75)`
- Three-point arc: radius `23.75` from origin
- Corner three: `(±22, -5.25)` to `(±22, 8.75)`

NBA API coordinates (`LOC_X`, `LOC_Y`) convert by dividing by 10.

## Color Scales

```tsx
import { blueRed, redGreen, greenRed, colorScale } from "@basketball-ceo/sportviz";

// Built-in
blueRed    // cold → hot (frequency)
redGreen   // bad → good (efficiency like FG%)
greenRed   // good → bad

// Custom
const custom = colorScale(["#000000", "#ff0000", "#ffff00"]);
```

## Package

`@basketball-ceo/sportviz` — React components + framework-agnostic core bundled together. Single install, single import.

## Development

```bash
# Install
bun install

# Build packages
cd packages/core && bun run build
cd packages/react && bun run build

# Run demo
cd apps/demo && bunx vite

# Test
cd packages/core && bun test
```

## License

MIT
