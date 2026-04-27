# @basketball-ceo/core

Framework-agnostic basketball visualization engine. Court geometry, layer computations (scatter, hexbin, zones), color scales, and team themes. Pure TypeScript, no DOM, no React.

```bash
npm install @basketball-ceo/core
```

Most React users want [`@basketball-ceo/charts`](https://www.npmjs.com/package/@basketball-ceo/charts) instead — it bundles this engine plus React components.

Use `@basketball-ceo/core` directly if you're rendering with Vue, Svelte, raw SVG, Canvas, or your own pipeline.

```ts
import { basketballCourt, computeHexbin, blueRed } from "@basketball-ceo/core";

const geometry = basketballCourt({ orientation: "half" });
const cells = computeHexbin(shots, { radius: 1.8, colorScale: blueRed });
// render `geometry.paths` and `cells` however you want
```

Full docs and live demo: [github.com/tripp-horbinski/sportviz](https://github.com/tripp-horbinski/sportviz)

By [basketball.ceo](https://basketball.ceo) · MIT
