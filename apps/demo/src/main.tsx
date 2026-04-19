import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BasketballCourt, ScatterOverlay, HexbinOverlay, ZoneOverlay } from "@sportviz/react";
import { redGreen, blueRed } from "@sportviz/core";
import { sampleShots } from "./sample-data";

type DemoMode = "scatter" | "hexbin" | "zones";

function App() {
  const [mode, setMode] = useState<DemoMode>("scatter");

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {(["scatter", "hexbin", "zones"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #334155",
              background: mode === m ? "#3b82f6" : "#1e293b",
              color: "#e2e8f0",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: mode === m ? 600 : 400,
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <BasketballCourt theme="dark" orientation="half">
          {mode === "scatter" && (
            <ScatterOverlay
              data={sampleShots}
              radius={0.4}
              color={(p) => (p.made ? "#22c55e" : "#ef4444")}
              opacity={0.7}
            />
          )}
          {mode === "hexbin" && (
            <HexbinOverlay
              data={sampleShots}
              radius={1.8}
              colorScale={blueRed}
            />
          )}
          {mode === "zones" && (
            <ZoneOverlay
              data={sampleShots}
              stat="made"
              colorScale={redGreen}
              opacity={0.5}
            />
          )}
        </BasketballCourt>
      </div>

      <div style={{ color: "#64748b", fontSize: "0.8rem", textAlign: "center" }}>
        {sampleShots.length} simulated shots &middot;{" "}
        {mode === "scatter" && "Green = made, Red = missed"}
        {mode === "hexbin" && "Color intensity = shot frequency"}
        {mode === "zones" && "Color = FG% (red = low, green = high)"}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
