import { GameState, Mission } from "@/data/members";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function applyMission(state: GameState, mission: Mission): GameState {
  const updatedMembers = state.members.map(member => {
    const effect = mission.effects.find(item => item.memberId === member.id);
    if (!effect) return member;

    return {
      ...member,
      stats: {
        popularity: clamp(member.stats.popularity + (effect.popularity ?? 0)),
        affection: clamp(member.stats.affection + (effect.affection ?? 0)),
        jealousy: clamp(member.stats.jealousy + (effect.jealousy ?? 0)),
        mental: clamp(member.stats.mental + (effect.mental ?? 0)),
      },
    };
  });

  return {
    ...state,
    selectedMissionId: mission.id,
    members: updatedMembers,
    group: {
      fame: clamp(state.group.fame + mission.groupEffect.fame),
      scandalRisk: clamp(state.group.scandalRisk + mission.groupEffect.scandalRisk),
    },
  };
}
