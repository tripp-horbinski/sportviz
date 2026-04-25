import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Vite plugin that proxies /api/shots to stats.nba.com */
function nbaProxy(): Plugin {
  return {
    name: "nba-proxy",
    configureServer(server) {
      server.middlewares.use("/api/shots", async (req, res) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const playerId = url.searchParams.get("playerId");
        const teamId = url.searchParams.get("teamId") ?? "0";
        const season = url.searchParams.get("season") ?? "2024-25";

        if (!playerId) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "playerId required" }));
          return;
        }

        const params = new URLSearchParams({
          ContextMeasure: "FGA",
          LastNGames: "0",
          LeagueID: "00",
          Month: "0",
          OpponentTeamID: "0",
          Period: "0",
          PlayerID: playerId,
          SeasonType: "Regular Season",
          TeamID: teamId,
          Season: season,
          DateFrom: "",
          DateTo: "",
          GameSegment: "",
          Location: "",
          Outcome: "",
          PlayerPosition: "",
          RookieYear: "",
          SeasonSegment: "",
          VsConference: "",
          VsDivision: "",
          GameID: "",
        });

        const nbaUrl = `https://stats.nba.com/stats/shotchartdetail?${params}`;

        try {
          const resp = await fetch(nbaUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
              Referer: "https://stats.nba.com/",
              Origin: "https://stats.nba.com",
              Accept: "application/json",
            },
          });

          if (!resp.ok) {
            res.writeHead(resp.status, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: `NBA API returned ${resp.status}` }));
            return;
          }

          const data = await resp.json();
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify(data));
        } catch (err: any) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), nbaProxy()],
});
