import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  BasketballCourt,
  ScatterOverlay,
  HexbinOverlay,
  ZoneOverlay,
  AnnotationOverlay,
  PlayOverlay,
  type Annotation,
  type DataPoint,
  type PlaySequence,
} from "@basketball-ceo/sportviz";
import type { Orientation } from "@sportviz/core";
import { redGreen, blueRed } from "@sportviz/core";
import { sampleShots } from "./sample-data";
import { searchPlayers, type PlayerInfo } from "./players";
import { useNbaShots } from "./use-nba-shots";
import "./demo.css";

type DemoMode = "scatter" | "hexbin" | "zones" | "plays";

const MODES: { key: DemoMode; label: string; desc: string }[] = [
  { key: "scatter", label: "Scatter", desc: "Individual shot locations" },
  { key: "hexbin", label: "Hexbin", desc: "Frequency heatmap" },
  { key: "zones", label: "Zones", desc: "Zone efficiency (FG%)" },
  { key: "plays", label: "Plays", desc: "Animated play sequences" },
];

/** Sample annotations highlighting hot/cold spots */
const ANNOTATIONS: Annotation[] = [
  { x: 0, y: 1.5, label: "Rim", mark: "ring", color: "#22c55e" },
  { x: -22, y: 1, label: "L Corner", mark: "dot", color: "#f59e0b" },
  { x: 22, y: 1, label: "R Corner", mark: "dot", color: "#f59e0b" },
];

/** Pick-and-roll play sequence */
const PICK_AND_ROLL: PlaySequence = {
  duration: 4,
  ballColor: "#f97316",
  ballRadius: 0.55,
  frames: [
    {
      time: 0,
      ball: { x: 0, y: 28 },
      players: [
        { id: "1", label: "PG", x: 0, y: 28, color: "#3b82f6" },
        { id: "2", label: "C", x: 5, y: 20, color: "#3b82f6" },
        { id: "3", label: "SG", x: -18, y: 22, color: "#3b82f6" },
        { id: "4", label: "SF", x: 18, y: 22, color: "#3b82f6" },
        { id: "5", label: "PF", x: -8, y: 12, color: "#3b82f6" },
        { id: "d1", label: "X", x: 0, y: 30, color: "#ef4444" },
        { id: "d2", label: "X", x: 5, y: 18, color: "#ef4444" },
        { id: "d3", label: "X", x: -17, y: 24, color: "#ef4444" },
        { id: "d4", label: "X", x: 17, y: 24, color: "#ef4444" },
        { id: "d5", label: "X", x: -8, y: 14, color: "#ef4444" },
      ],
    },
    {
      time: 0.25,
      ball: { x: 2, y: 24 },
      players: [
        { id: "1", label: "PG", x: 2, y: 24, color: "#3b82f6" },
        { id: "2", label: "C", x: 3, y: 22, color: "#3b82f6" },
        { id: "3", label: "SG", x: -20, y: 20, color: "#3b82f6" },
        { id: "4", label: "SF", x: 20, y: 20, color: "#3b82f6" },
        { id: "5", label: "PF", x: -6, y: 10, color: "#3b82f6" },
        { id: "d1", label: "X", x: 1, y: 26, color: "#ef4444" },
        { id: "d2", label: "X", x: 4, y: 20, color: "#ef4444" },
        { id: "d3", label: "X", x: -19, y: 22, color: "#ef4444" },
        { id: "d4", label: "X", x: 19, y: 22, color: "#ef4444" },
        { id: "d5", label: "X", x: -7, y: 12, color: "#ef4444" },
      ],
    },
    {
      time: 0.45,
      ball: { x: -2, y: 20 },
      players: [
        { id: "1", label: "PG", x: -2, y: 20, color: "#3b82f6" },
        { id: "2", label: "C", x: 1, y: 21, color: "#3b82f6" },
        { id: "3", label: "SG", x: -22, y: 18, color: "#3b82f6" },
        { id: "4", label: "SF", x: 22, y: 18, color: "#3b82f6" },
        { id: "5", label: "PF", x: -5, y: 8, color: "#3b82f6" },
        { id: "d1", label: "X", x: 0, y: 22, color: "#ef4444" },
        { id: "d2", label: "X", x: 2, y: 19, color: "#ef4444" },
        { id: "d3", label: "X", x: -21, y: 20, color: "#ef4444" },
        { id: "d4", label: "X", x: 21, y: 20, color: "#ef4444" },
        { id: "d5", label: "X", x: -6, y: 10, color: "#ef4444" },
      ],
    },
    {
      time: 0.6,
      ball: { x: -6, y: 14 },
      players: [
        { id: "1", label: "PG", x: -6, y: 14, color: "#3b82f6" },
        { id: "2", label: "C", x: 2, y: 12, color: "#3b82f6" },
        { id: "3", label: "SG", x: -22, y: 16, color: "#3b82f6" },
        { id: "4", label: "SF", x: 22, y: 16, color: "#3b82f6" },
        { id: "5", label: "PF", x: -4, y: 6, color: "#3b82f6" },
        { id: "d1", label: "X", x: -2, y: 18, color: "#ef4444" },
        { id: "d2", label: "X", x: -1, y: 14, color: "#ef4444" },
        { id: "d3", label: "X", x: -21, y: 18, color: "#ef4444" },
        { id: "d4", label: "X", x: 21, y: 18, color: "#ef4444" },
        { id: "d5", label: "X", x: -5, y: 8, color: "#ef4444" },
      ],
    },
    {
      time: 0.8,
      ball: { x: 2, y: 8 },
      players: [
        { id: "1", label: "PG", x: -8, y: 10, color: "#3b82f6" },
        { id: "2", label: "C", x: 2, y: 8, color: "#3b82f6" },
        { id: "3", label: "SG", x: -22, y: 14, color: "#3b82f6" },
        { id: "4", label: "SF", x: 22, y: 14, color: "#3b82f6" },
        { id: "5", label: "PF", x: -3, y: 4, color: "#3b82f6" },
        { id: "d1", label: "X", x: -5, y: 14, color: "#ef4444" },
        { id: "d2", label: "X", x: -2, y: 10, color: "#ef4444" },
        { id: "d3", label: "X", x: -21, y: 16, color: "#ef4444" },
        { id: "d4", label: "X", x: 21, y: 16, color: "#ef4444" },
        { id: "d5", label: "X", x: -4, y: 6, color: "#ef4444" },
      ],
    },
    {
      time: 1,
      ball: { x: 1, y: 2 },
      players: [
        { id: "1", label: "PG", x: -10, y: 8, color: "#3b82f6" },
        { id: "2", label: "C", x: 1, y: 2, color: "#3b82f6" },
        { id: "3", label: "SG", x: -22, y: 12, color: "#3b82f6" },
        { id: "4", label: "SF", x: 22, y: 12, color: "#3b82f6" },
        { id: "5", label: "PF", x: -2, y: 3, color: "#3b82f6" },
        { id: "d1", label: "X", x: -7, y: 12, color: "#ef4444" },
        { id: "d2", label: "X", x: -3, y: 6, color: "#ef4444" },
        { id: "d3", label: "X", x: -21, y: 14, color: "#ef4444" },
        { id: "d4", label: "X", x: 21, y: 14, color: "#ef4444" },
        { id: "d5", label: "X", x: -3, y: 5, color: "#ef4444" },
      ],
    },
  ],
};

interface HoverInfo {
  text: string;
  clientX: number;
  clientY: number;
}

function usePlayback(duration: number) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const playingRef = useRef(false);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    lastTimeRef.current = 0;

    const tick = (timestamp: number) => {
      if (!playingRef.current) return;
      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
      const elapsed = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      let done = false;
      setProgress((prev) => {
        const next = Math.min(1, prev + elapsed / duration);
        if (next >= 1) done = true;
        return next;
      });

      if (done) {
        setPlaying(false);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, duration]);

  const play = useCallback(() => {
    setProgress((prev) => (prev >= 1 ? 0 : prev));
    setPlaying(true);
  }, []);
  const pause = useCallback(() => setPlaying(false), []);
  const reset = useCallback(() => {
    setPlaying(false);
    setProgress(0);
  }, []);

  return { progress, playing, play, pause, reset, setProgress };
}

function App() {
  const [mode, setMode] = useState<DemoMode>("scatter");
  const [orientation, setOrientation] = useState<Orientation>("half");
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const playback = usePlayback(PICK_AND_ROLL.duration ?? 3);

  // Player search + season
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlayerInfo[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo | null>(null);
  const [season, setSeason] = useState("2025-26");
  const nba = useNbaShots();

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setSearchResults(q.length >= 2 ? searchPlayers(q) : []);
  }, []);

  const handleSelectPlayer = useCallback((player: PlayerInfo) => {
    setSelectedPlayer(player);
    setSearchQuery("");
    setSearchResults([]);
    nba.fetchShots(player.id, player.teamId, season);
  }, [nba.fetchShots, season]);

  const handleSeasonChange = useCallback((newSeason: string) => {
    setSeason(newSeason);
    if (selectedPlayer) {
      nba.fetchShots(selectedPlayer.id, selectedPlayer.teamId, newSeason);
    }
  }, [selectedPlayer, nba.fetchShots]);

  const handleClearPlayer = useCallback(() => {
    setSelectedPlayer(null);
    nba.clear();
  }, [nba.clear]);

  // Use NBA data when available, otherwise sample data
  const activeShots = nba.shots.length > 0 ? nba.shots : sampleShots;
  const dataLabel = selectedPlayer ? `${selectedPlayer.name} (${selectedPlayer.team})` : "Sample Data (300 shots)";


  const handleScatterHover = useCallback(
    (point: DataPoint | null, e: React.MouseEvent) => {
      if (!point) return setHover(null);
      setHover({
        text: `${point.made ? "Made" : "Missed"} · (${(point.x as number).toFixed(1)}, ${(point.y as number).toFixed(1)})`,
        clientX: e.clientX,
        clientY: e.clientY,
      });
    },
    []
  );

  const handleHexbinHover = useCallback(
    (cell: { count: number } | null, e: React.MouseEvent) => {
      if (!cell) return setHover(null);
      setHover({
        text: `${cell.count} shot${cell.count !== 1 ? "s" : ""}`,
        clientX: e.clientX,
        clientY: e.clientY,
      });
    },
    []
  );

  const handleZoneHover = useCallback(
    (zone: { label: string; value: number } | null, e: React.MouseEvent) => {
      if (!zone) return setHover(null);
      setHover({
        text: `${zone.label}: ${(zone.value * 100).toFixed(1)}% FG`,
        clientX: e.clientX,
        clientY: e.clientY,
      });
    },
    []
  );

  const stats = useMemo(() => {
    const total = activeShots.length;
    const made = activeShots.filter((s) => s.made).length;
    const missed = total - made;
    const fgPct = total > 0 ? ((made / total) * 100).toFixed(1) : "0.0";

    const threeCount = activeShots.filter((s) => {
      const d = Math.sqrt(s.x * s.x + s.y * s.y);
      return d > 23.75 || (Math.abs(s.x) > 22 && s.y < 8.75);
    }).length;
    const threeMade = activeShots.filter((s) => {
      const d = Math.sqrt(s.x * s.x + s.y * s.y);
      return (d > 23.75 || (Math.abs(s.x) > 22 && s.y < 8.75)) && s.made;
    }).length;
    const paintCount = activeShots.filter((s) => {
      const d = Math.sqrt(s.x * s.x + s.y * s.y);
      return d <= 4;
    }).length;
    const paintMade = activeShots.filter((s) => {
      const d = Math.sqrt(s.x * s.x + s.y * s.y);
      return d <= 4 && s.made;
    }).length;
    const midCount = total - threeCount - paintCount;
    const midMade = made - threeMade - paintMade;

    return {
      total,
      made,
      missed,
      fgPct,
      threeCount,
      threePct:
        threeCount > 0 ? ((threeMade / threeCount) * 100).toFixed(1) : "—",
      paintCount,
      paintPct:
        paintCount > 0 ? ((paintMade / paintCount) * 100).toFixed(1) : "—",
      midCount,
      midPct: midCount > 0 ? ((midMade / midCount) * 100).toFixed(1) : "—",
    };
  }, [activeShots]);

  const modeInfo = MODES.find((m) => m.key === mode)!;

  return (
    <div className="demo-shell">
      {/* Floating tooltip */}
      {hover && (
        <div
          className="demo-tooltip"
          style={{ left: hover.clientX + 12, top: hover.clientY - 8 }}
        >
          {hover.text}
        </div>
      )}

      {/* Header */}
      <header className="demo-header">
        <div className="demo-header-inner">
          <div className="demo-brand">
            <h1 className="demo-logo">sportviz</h1>
            <span className="demo-tagline">
              Sports data visualization for React
            </span>
          </div>
          <a
            className="demo-github"
            href="https://github.com/sportviz"
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="demo-main">
        {/* Controls row */}
        <div className="demo-controls">
          <div className="demo-tabs">
            {MODES.map((m) => (
              <button
                key={m.key}
                className={`demo-tab ${mode === m.key ? "demo-tab--active" : ""}`}
                onClick={() => setMode(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="demo-toggles">
            <button
              className={`demo-toggle ${orientation === "full" ? "demo-toggle--active" : ""}`}
              onClick={() =>
                setOrientation((o) => (o === "half" ? "full" : "half"))
              }
            >
              {orientation === "half" ? "Half Court" : "Full Court"}
            </button>
            {mode === "scatter" && (
              <button
                className={`demo-toggle ${showAnnotations ? "demo-toggle--active" : ""}`}
                onClick={() => setShowAnnotations((v) => !v)}
              >
                Annotations
              </button>
            )}
          </div>
        </div>

        <div className="demo-layout">
          {/* Court */}
          <div className="demo-court">
            <BasketballCourt
              theme="dark"
              orientation={orientation}
            >
              {mode === "scatter" && (
                <ScatterOverlay
                  data={activeShots}
                  radius={0.4}
                  color={(p) => (p.made ? "#22c55e" : "#ef4444")}
                  opacity={0.75}
                  onPointHover={handleScatterHover}
                />
              )}
              {mode === "hexbin" && (
                <HexbinOverlay
                  data={activeShots}
                  radius={1.8}
                  colorScale={blueRed}
                  onCellHover={handleHexbinHover}
                />
              )}
              {mode === "zones" && (
                <ZoneOverlay
                  data={activeShots}
                  stat="made"
                  colorScale={redGreen}
                  opacity={0.5}
                  onZoneHover={handleZoneHover}
                />
              )}
              {mode === "plays" && (
                <PlayOverlay
                  sequence={PICK_AND_ROLL}
                  progress={playback.progress}
                />
              )}
              {mode === "scatter" && showAnnotations && (
                <AnnotationOverlay annotations={ANNOTATIONS} />
              )}
            </BasketballCourt>
          </div>

          {/* Sidebar */}
          <aside className="demo-sidebar">
            <div className="demo-card">
              <div className="demo-card-title">{modeInfo.label}</div>
              <div className="demo-card-desc">{modeInfo.desc}</div>
            </div>

            {/* Player search — shot chart modes only */}
            {mode !== "plays" && (
              <div className="demo-card">
                <div className="demo-card-title">Player</div>
                {selectedPlayer ? (
                  <div className="demo-player-selected">
                    <div className="demo-player-name">
                      {selectedPlayer.name}
                      <span className="demo-player-team">{selectedPlayer.team}</span>
                    </div>
                    <button className="demo-player-clear" onClick={handleClearPlayer}>
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="demo-player-search">
                    <input
                      className="demo-search-input"
                      type="text"
                      placeholder="Search player..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchResults.length > 0 && (
                      <div className="demo-search-results">
                        {searchResults.map((p) => (
                          <button
                            key={p.id}
                            className="demo-search-result"
                            onClick={() => handleSelectPlayer(p)}
                          >
                            {p.name}
                            <span className="demo-search-team">{p.team}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <select
                  className="demo-season-select"
                  value={season}
                  onChange={(e) => handleSeasonChange(e.target.value)}
                >
                  {Array.from({ length: 11 }, (_, i) => {
                    const y = 2025 - i;
                    const s = `${y}-${String(y + 1).slice(2)}`;
                    return <option key={s} value={s}>{s}</option>;
                  })}
                </select>
                {nba.loading && (
                  <div className="demo-player-loading">Loading shots...</div>
                )}
                {nba.error && (
                  <div className="demo-player-error">{nba.error}</div>
                )}
                <div className="demo-player-source">{dataLabel}</div>
              </div>
            )}

            {/* Play controls */}
            {mode === "plays" && (
              <div className="demo-card">
                <div className="demo-card-title">Playback</div>
                <div className="demo-play-controls">
                  <div className="demo-play-buttons">
                    {playback.playing ? (
                      <button className="demo-play-btn" onClick={playback.pause}>
                        Pause
                      </button>
                    ) : (
                      <button className="demo-play-btn demo-play-btn--primary" onClick={playback.play}>
                        {playback.progress >= 1 ? "Replay" : "Play"}
                      </button>
                    )}
                    <button className="demo-play-btn" onClick={playback.reset}>
                      Reset
                    </button>
                  </div>
                  <input
                    className="demo-play-scrubber"
                    type="range"
                    min={0}
                    max={1}
                    step={0.005}
                    value={playback.progress}
                    onChange={(e) => {
                      playback.pause();
                      playback.setProgress(parseFloat(e.target.value));
                    }}
                  />
                  <div className="demo-play-time">
                    {(playback.progress * (PICK_AND_ROLL.duration ?? 3)).toFixed(1)}s / {PICK_AND_ROLL.duration ?? 3}s
                  </div>
                </div>
                <div className="demo-card-desc demo-play-label">
                  Pick and Roll — PG drives off screen, passes to rolling C for layup
                </div>
              </div>
            )}

            {/* Play legend */}
            {mode === "plays" && (
              <div className="demo-card">
                <div className="demo-card-title">Legend</div>
                <div className="demo-legend-items">
                  <div className="demo-legend-item">
                    <span className="demo-legend-dot" style={{ background: "#3b82f6" }} />
                    Offense
                  </div>
                  <div className="demo-legend-item">
                    <span className="demo-legend-dot" style={{ background: "#ef4444" }} />
                    Defense
                  </div>
                  <div className="demo-legend-item">
                    <span className="demo-legend-dot" style={{ background: "#f97316" }} />
                    Ball
                  </div>
                </div>
              </div>
            )}

            {/* Legend for shot modes */}
            {mode !== "plays" && (
              <div className="demo-card">
                <div className="demo-card-title">Legend</div>
                {mode === "scatter" && (
                  <div className="demo-legend-items">
                    <div className="demo-legend-item">
                      <span className="demo-legend-dot" style={{ background: "#22c55e" }} />
                      Made
                    </div>
                    <div className="demo-legend-item">
                      <span className="demo-legend-dot" style={{ background: "#ef4444" }} />
                      Missed
                    </div>
                  </div>
                )}
                {mode === "hexbin" && (
                  <div className="demo-legend-scale">
                    <div className="demo-legend-gradient demo-legend-gradient--hexbin" />
                    <div className="demo-legend-labels">
                      <span>Low</span>
                      <span>Frequency</span>
                      <span>High</span>
                    </div>
                  </div>
                )}
                {mode === "zones" && (
                  <div className="demo-legend-scale">
                    <div className="demo-legend-gradient demo-legend-gradient--zones" />
                    <div className="demo-legend-labels">
                      <span>Low FG%</span>
                      <span>Efficiency</span>
                      <span>High FG%</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stats — hide for plays mode */}
            {mode !== "plays" && (
              <>
                <div className="demo-card">
                  <div className="demo-card-title">Shot Stats</div>
                  <div className="demo-stats">
                    <div className="demo-stat">
                      <div className="demo-stat-value">{stats.fgPct}%</div>
                      <div className="demo-stat-label">FG%</div>
                    </div>
                    <div className="demo-stat">
                      <div className="demo-stat-value">{stats.total}</div>
                      <div className="demo-stat-label">Total</div>
                    </div>
                    <div className="demo-stat">
                      <div className="demo-stat-value demo-stat-value--made">{stats.made}</div>
                      <div className="demo-stat-label">Made</div>
                    </div>
                    <div className="demo-stat">
                      <div className="demo-stat-value demo-stat-value--missed">{stats.missed}</div>
                      <div className="demo-stat-label">Missed</div>
                    </div>
                  </div>
                </div>

                <div className="demo-card">
                  <div className="demo-card-title">Zone Breakdown</div>
                  <div className="demo-zone-list">
                    <ZoneRow label="Paint" shots={stats.paintCount} pct={stats.paintPct} total={stats.total} />
                    <ZoneRow label="Mid-Range" shots={stats.midCount} pct={stats.midPct} total={stats.total} />
                    <ZoneRow label="Three-Point" shots={stats.threeCount} pct={stats.threePct} total={stats.total} />
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function ZoneRow({ label, shots, pct, total }: { label: string; shots: number; pct: string; total: number }) {
  const barWidth = total > 0 ? (shots / total) * 100 : 0;
  return (
    <div className="demo-zone-row">
      <div className="demo-zone-header">
        <span className="demo-zone-label">{label}</span>
        <span className="demo-zone-pct">{pct}%</span>
      </div>
      <div className="demo-zone-bar-track">
        <div className="demo-zone-bar-fill" style={{ width: `${barWidth}%` }} />
      </div>
      <div className="demo-zone-shots">{shots} shots</div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
