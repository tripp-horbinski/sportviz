import { useState, useCallback } from "react";
import type { DataPoint } from "@basketball-ceo/core";

export interface NbaShotResult {
  shots: DataPoint[];
  playerName: string;
  loading: boolean;
  error: string | null;
}

/**
 * Convert NBA stats.nba.com LOC_X/LOC_Y (tenths of feet) to
 * sportviz court coordinates (feet, origin at basket center).
 */
function nbaToCourtCoords(locX: number, locY: number): { x: number; y: number } {
  // LOC_X: -250 to 250 (tenths of ft, left to right)
  // LOC_Y: -47 to ~400+ (tenths of ft, baseline to halfcourt)
  // Our system: x in feet, y in feet, origin at basket
  return { x: locX / 10, y: locY / 10 };
}

export function useNbaShots() {
  const [result, setResult] = useState<NbaShotResult>({
    shots: [],
    playerName: "",
    loading: false,
    error: null,
  });

  const fetchShots = useCallback(
    async (playerId: number, teamId: number, season = "2024-25") => {
      setResult((r) => ({ ...r, loading: true, error: null }));

      try {
        const resp = await fetch(
          `/api/shots?playerId=${playerId}&teamId=${teamId}&season=${season}`
        );

        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${resp.status}`);
        }

        const data = await resp.json();

        // NBA API returns resultSets array; Shot_Chart_Detail is index 0
        const resultSet = data.resultSets?.[0];
        if (!resultSet) throw new Error("No shot data returned");

        const headers: string[] = resultSet.headers;
        const rows: unknown[][] = resultSet.rowSet;

        const locXIdx = headers.indexOf("LOC_X");
        const locYIdx = headers.indexOf("LOC_Y");
        const madeIdx = headers.indexOf("SHOT_MADE_FLAG");
        const nameIdx = headers.indexOf("PLAYER_NAME");
        const typeIdx = headers.indexOf("SHOT_TYPE");
        const zoneIdx = headers.indexOf("SHOT_ZONE_BASIC");
        const distIdx = headers.indexOf("SHOT_DISTANCE");
        const actionIdx = headers.indexOf("ACTION_TYPE");

        const playerName =
          rows.length > 0 && nameIdx >= 0
            ? (rows[0][nameIdx] as string)
            : "Unknown";

        const shots: DataPoint[] = rows.map((row) => {
          const { x, y } = nbaToCourtCoords(
            row[locXIdx] as number,
            row[locYIdx] as number
          );
          return {
            x,
            y,
            made: (row[madeIdx] as number) === 1,
            shotType: typeIdx >= 0 ? row[typeIdx] : undefined,
            zone: zoneIdx >= 0 ? row[zoneIdx] : undefined,
            distance: distIdx >= 0 ? row[distIdx] : undefined,
            action: actionIdx >= 0 ? row[actionIdx] : undefined,
          };
        });

        setResult({ shots, playerName, loading: false, error: null });
      } catch (err: any) {
        setResult((r) => ({
          ...r,
          loading: false,
          error: err.message ?? "Failed to fetch",
        }));
      }
    },
    []
  );

  const clear = useCallback(() => {
    setResult({ shots: [], playerName: "", loading: false, error: null });
  }, []);

  return { ...result, fetchShots, clear };
}
