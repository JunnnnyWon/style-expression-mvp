export type Stats = {
  popularity: number;
  affection: number;
  jealousy: number;
  mental: number;
};

export type EndingEvaluation = {
  status: "LOCKED" | "NORMAL_READY" | "HAPPY_READY" | "BAD_READY" | "FORCED";
  endingType: "HAPPY" | "BAD" | null;
  reason: string;
};

export function evaluateEnding(stats: Stats, userTurnCount: number): EndingEvaluation {
  if (userTurnCount < 3) {
    return {
      status: "LOCKED",
      endingType: null,
      reason: "도하와 조금 더 대화해 주세요.",
    };
  }

  const happy =
    stats.affection >= 75 &&
    stats.mental >= 60 &&
    stats.jealousy <= 60 &&
    stats.popularity >= 50;

  const emotionalHappy =
    stats.affection >= 85 &&
    stats.mental >= 55 &&
    stats.jealousy <= 65;

  const bad =
    stats.mental <= 25 ||
    stats.affection <= 25 ||
    stats.jealousy >= 85 ||
    (stats.popularity <= 25 && stats.mental <= 40);

  if (bad) {
    return { status: "BAD_READY", endingType: "BAD", reason: "도하의 감정이 더 이상 버티기 어려운 상태입니다." };
  }

  if (happy || emotionalHappy) {
    return { status: "HAPPY_READY", endingType: "HAPPY", reason: "도하가 디렉터를 믿고 무대에 설 준비가 되었습니다." };
  }

  if (userTurnCount >= 10) {
    const score = stats.affection * 0.35 + stats.mental * 0.30 + stats.popularity * 0.20 + (100 - stats.jealousy) * 0.15;
    return { status: "FORCED", endingType: score >= 62 ? "HAPPY" : "BAD", reason: "오늘의 AI TALK를 모두 사용했습니다." };
  }

  const score = stats.affection * 0.35 + stats.mental * 0.30 + stats.popularity * 0.20 + (100 - stats.jealousy) * 0.15;
  return { status: "NORMAL_READY", endingType: score >= 62 ? "HAPPY" : "BAD", reason: "현재 상태로 엔딩을 확인할 수 있습니다." };
}
