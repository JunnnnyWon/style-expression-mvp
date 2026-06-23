import { GameState } from "@/data/members";

export function calculateEnding(state: GameState): string {
  const { group, members } = state;

  const maxJealousy = Math.max(...members.map(m => m.stats.jealousy));
  const averageMental = members.reduce((sum, m) => sum + m.stats.mental, 0) / members.length;
  const dAffection = members.find(m => m.id === "D")?.stats.affection ?? 0;

  if (group.fame >= 80 && group.scandalRisk <= 40) return "dome-light";
  if (maxJealousy >= 85 && group.scandalRisk >= 70) return "night-fall";
  if (dAffection <= 25 && group.fame <= 50) return "business-exit";
  if (group.fame <= 35 && averageMental >= 55) return "after-contract";

  return "local-stage";
}
