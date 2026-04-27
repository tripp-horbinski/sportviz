# @basketball-ceo/charts

React components for basketball data visualization — courts, shot charts, hexbin heatmaps, zone efficiency, play animations.

```bash
npm install @basketball-ceo/charts
```

```tsx
import { BasketballCourt, ScatterOverlay } from "@basketball-ceo/charts";

<BasketballCourt theme="dark" orientation="half">
  <ScatterOverlay
    data={shots}
    color={(p) => (p.made ? "#22c55e" : "#ef4444")}
  />
</BasketballCourt>
```

Full docs and live demo: [github.com/tripp-horbinski/sportviz](https://github.com/tripp-horbinski/sportviz)

By [basketball.ceo](https://basketball.ceo) · MIT
