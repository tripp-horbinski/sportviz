/** Top NBA players with IDs for the demo player search */
export interface PlayerInfo {
  id: number;
  name: string;
  teamId: number;
  team: string;
}

export const PLAYERS: PlayerInfo[] = [
  { id: 2544, name: "LeBron James", teamId: 1610612747, team: "LAL" },
  { id: 201566, name: "Russell Westbrook", teamId: 1610612743, team: "DEN" },
  { id: 201142, name: "Kevin Durant", teamId: 1610612756, team: "PHX" },
  { id: 201939, name: "Stephen Curry", teamId: 1610612744, team: "GSW" },
  { id: 203507, name: "Giannis Antetokounmpo", teamId: 1610612749, team: "MIL" },
  { id: 203954, name: "Joel Embiid", teamId: 1610612755, team: "PHI" },
  { id: 203999, name: "Nikola Jokic", teamId: 1610612743, team: "DEN" },
  { id: 1629029, name: "Luka Doncic", teamId: 1610612742, team: "DAL" },
  { id: 1628369, name: "Jayson Tatum", teamId: 1610612738, team: "BOS" },
  { id: 1628368, name: "De'Aaron Fox", teamId: 1610612758, team: "SAC" },
  { id: 201935, name: "James Harden", teamId: 1610612746, team: "LAC" },
  { id: 203076, name: "Anthony Davis", teamId: 1610612747, team: "LAL" },
  { id: 202331, name: "Paul George", teamId: 1610612755, team: "PHI" },
  { id: 202695, name: "Kawhi Leonard", teamId: 1610612746, team: "LAC" },
  { id: 202681, name: "Kyrie Irving", teamId: 1610612742, team: "DAL" },
  { id: 1629630, name: "Ja Morant", teamId: 1610612763, team: "MEM" },
  { id: 1629627, name: "Zion Williamson", teamId: 1610612740, team: "NOP" },
  { id: 1630162, name: "Anthony Edwards", teamId: 1610612750, team: "MIN" },
  { id: 1630169, name: "Tyrese Haliburton", teamId: 1610612754, team: "IND" },
  { id: 1628983, name: "Shai Gilgeous-Alexander", teamId: 1610612760, team: "OKC" },
  { id: 1629631, name: "RJ Barrett", teamId: 1610612761, team: "TOR" },
  { id: 203081, name: "Damian Lillard", teamId: 1610612749, team: "MIL" },
  { id: 1630559, name: "Scottie Barnes", teamId: 1610612761, team: "TOR" },
  { id: 1630578, name: "Cade Cunningham", teamId: 1610612765, team: "DET" },
  { id: 1630532, name: "Jalen Green", teamId: 1610612745, team: "HOU" },
  { id: 1630596, name: "Paolo Banchero", teamId: 1610612753, team: "ORL" },
  { id: 1630595, name: "Victor Wembanyama", teamId: 1610612759, team: "SAS" },
  { id: 203944, name: "Julius Randle", teamId: 1610612750, team: "MIN" },
  { id: 1629636, name: "Darius Garland", teamId: 1610612739, team: "CLE" },
  { id: 1628378, name: "Donovan Mitchell", teamId: 1610612739, team: "CLE" },
];

export function searchPlayers(query: string): PlayerInfo[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PLAYERS.filter(
    (p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)
  );
}
