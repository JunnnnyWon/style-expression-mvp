export function applyStatDelta(
  stats: { popularity: number; affection: number; jealousy: number; mental: number },
  delta: { popularity?: number; affection?: number; jealousy?: number; mental?: number },
): { popularity: number; affection: number; jealousy: number; mental: number } {
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  const clampDelta = (v: unknown) => {
    const n = typeof v === "number" ? v : 0;
    return Math.max(-12, Math.min(12, Math.round(n)));
  };

  return {
    popularity: clamp(stats.popularity + clampDelta(delta.popularity)),
    affection: clamp(stats.affection + clampDelta(delta.affection)),
    jealousy: clamp(stats.jealousy + clampDelta(delta.jealousy)),
    mental: clamp(stats.mental + clampDelta(delta.mental)),
  };
}

export function clampStatDelta(delta: Record<string, unknown>): {
  popularity: number;
  affection: number;
  jealousy: number;
  mental: number;
} {
  const clampDelta = (v: unknown) => {
    const n = typeof v === "number" ? v : 0;
    return Math.max(-12, Math.min(12, Math.round(n)));
  };
  return {
    popularity: clampDelta(delta.popularity),
    affection: clampDelta(delta.affection),
    jealousy: clampDelta(delta.jealousy),
    mental: clampDelta(delta.mental),
  };
}
