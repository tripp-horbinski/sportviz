import type { Theme } from "./types";

export const light: Theme = {
  background: "#ffffff",
  courtFill: "#f0e6d2",
  courtStroke: "#333333",
  courtStrokeWidth: 0.15,
  paintFill: "#e8d5b7",
};

export const dark: Theme = {
  background: "#1a1a2e",
  courtFill: "#16213e",
  courtStroke: "#e0e0e0",
  courtStrokeWidth: 0.15,
  paintFill: "#0f3460",
};

// ── NBA Team Themes ─────────────────────────────────
// Wood-toned court floor, team colors as paint + line accents

/** Light wood floor */
const WOOD = "#c4944a";
/** Slightly darker wood for contrast */
const WOOD_BG = "#1a1510";

function nbaTheme(paint: string, stroke: string, accent: string): Theme {
  return {
    background: WOOD_BG,
    courtFill: WOOD,
    courtStroke: stroke,
    courtStrokeWidth: 0.15,
    paintFill: paint,
    accent,
  };
}

// Atlantic
export const celtics   = nbaTheme("#007a33", "#ffffff", "#007a33");
export const nets      = nbaTheme("#2a2a2a", "#000000", "#ffffff");
export const knicks    = nbaTheme("#1d428a", "#f58426", "#f58426");
export const sixers    = nbaTheme("#003da5", "#ed174c", "#ed174c");
export const raptors   = nbaTheme("#ce1141", "#000000", "#ce1141");

// Central
export const bulls     = nbaTheme("#ce1141", "#000000", "#ce1141");
export const cavaliers = nbaTheme("#6f263d", "#ffb81c", "#ffb81c");
export const pistons   = nbaTheme("#1d428a", "#c8102e", "#c8102e");
export const pacers    = nbaTheme("#002d62", "#fdbb30", "#fdbb30");
export const bucks     = nbaTheme("#00471b", "#eee1c6", "#00471b");

// Southeast
export const hawks     = nbaTheme("#c8102e", "#000000", "#c8102e");
export const hornets   = nbaTheme("#1d1160", "#00788c", "#00788c");
export const heat      = nbaTheme("#98002e", "#000000", "#f9a01b");
export const magic     = nbaTheme("#0077c0", "#000000", "#0077c0");
export const wizards   = nbaTheme("#002b5c", "#e31837", "#e31837");

// Northwest
export const nuggets   = nbaTheme("#0e2240", "#fec524", "#fec524");
export const timberwolves = nbaTheme("#0c2340", "#78be20", "#78be20");
export const thunder   = nbaTheme("#007ac1", "#ef6100", "#ef6100");
export const blazers   = nbaTheme("#e03a3e", "#000000", "#e03a3e");
export const jazz      = nbaTheme("#002b5c", "#f9a01b", "#f9a01b");

// Pacific
export const warriors  = nbaTheme("#1d428a", "#ffc72c", "#ffc72c");
export const clippers  = nbaTheme("#c8102e", "#1d428a", "#c8102e");
export const lakers    = nbaTheme("#552583", "#fdb927", "#fdb927");
export const suns      = nbaTheme("#1d1160", "#e56020", "#e56020");
export const kings     = nbaTheme("#5a2d81", "#63727a", "#5a2d81");

// Southwest
export const mavericks = nbaTheme("#00538c", "#b8c4ca", "#00538c");
export const rockets   = nbaTheme("#ce1141", "#000000", "#ce1141");
export const grizzlies = nbaTheme("#5d76a9", "#f5b112", "#5d76a9");
export const spurs     = nbaTheme("#1a1a1a", "#c4ced4", "#c4ced4");
export const pelicans  = nbaTheme("#0c2340", "#b4975a", "#b4975a");

/** All themes indexed by name */
export const themes = {
  light,
  dark,
  // Atlantic
  celtics, nets, knicks, sixers, raptors,
  // Central
  bulls, cavaliers, pistons, pacers, bucks,
  // Southeast
  hawks, hornets, heat, magic, wizards,
  // Northwest
  nuggets, timberwolves, thunder, blazers, jazz,
  // Pacific
  warriors, clippers, lakers, suns, kings,
  // Southwest
  mavericks, rockets, grizzlies, spurs, pelicans,
} as const;

export type ThemeName = keyof typeof themes;

/** Map team abbreviations to theme names */
export const teamThemeMap: Record<string, ThemeName> = {
  BOS: "celtics", BKN: "nets", NYK: "knicks", PHI: "sixers", TOR: "raptors",
  CHI: "bulls", CLE: "cavaliers", DET: "pistons", IND: "pacers", MIL: "bucks",
  ATL: "hawks", CHA: "hornets", MIA: "heat", ORL: "magic", WAS: "wizards",
  DEN: "nuggets", MIN: "timberwolves", OKC: "thunder", POR: "blazers", UTA: "jazz",
  GSW: "warriors", LAC: "clippers", LAL: "lakers", PHX: "suns", SAC: "kings",
  DAL: "mavericks", HOU: "rockets", MEM: "grizzlies", SAS: "spurs", NOP: "pelicans",
};
