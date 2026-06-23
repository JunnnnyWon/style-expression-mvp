export const dohaFallbackReplies: Record<string, {
  reply: string;
  emotion: string;
  statDelta: { popularity: number; affection: number; jealousy: number; mental: number };
  endingHint: string;
}> = {
  neutral: {
    reply: "음… 아직 잘 모르겠어요. 그래도 디렉터님이 그렇게 말해주니까, 조금은 버텨볼 수 있을 것 같아요.",
    emotion: "neutral",
    statDelta: { popularity: 0, affection: 2, jealousy: 0, mental: 1 },
    endingHint: "none",
  },
  nervous: {
    reply: "솔직히 조금 무서워요. 제가 이 콘셉트를 제대로 버틸 수 있을지 아직 확신이 없어요.",
    emotion: "nervous",
    statDelta: { popularity: 0, affection: 0, jealousy: 2, mental: -3 },
    endingHint: "bad_risk",
  },
  relieved: {
    reply: "그렇게 말해주니까 이상하게 숨이 좀 쉬어져요. 오늘은 도망치지 않고 끝까지 있어볼게요.",
    emotion: "relieved",
    statDelta: { popularity: 1, affection: 4, jealousy: -2, mental: 4 },
    endingHint: "happy_possible",
  },
};

export const happyEndingFallback = {
  endingType: "HAPPY",
  title: "STAGE BREATH",
  subtitle: "해피 엔딩",
  body: "조명이 켜졌을 때, 도하는 객석보다 먼저 디렉터님을 바라봤다. 손끝은 아직 조금 떨렸지만 그는 더 이상 도망치지 않았다. 오늘의 콘셉트는 완벽한 정답은 아니었지만, 도하에게 자기 자리를 만들어줬다. 무대가 끝난 뒤 그는 헤드폰을 목에 걸고 아주 작게 웃었다.",
  finalLine: "오늘은… 제 음악이 조금 들린 것 같아요.",
  relationTag: "신뢰가 시작된 디렉터",
  statSummary: "도하는 불안을 완전히 지우지는 못했지만, 디렉터를 믿고 무대에 설 수 있게 되었다.",
};

export const badEndingFallback = {
  endingType: "BAD",
  title: "MUTED TRACK",
  subtitle: "배드 엔딩",
  body: "무대는 예정대로 시작됐지만, 도하의 목소리는 끝내 앞으로 나오지 못했다. 카메라는 계속 다른 곳을 향했고, 도하는 웃는 법을 잊은 사람처럼 조명을 지나쳤다. 대기실로 돌아온 그는 헤드폰을 다시 목에 걸었다. 디렉터님에게 보내려던 메시지는 입력창 안에서 몇 번이나 지워졌다.",
  finalLine: "괜찮아요. 원래 제 자리는 이런 데였나 봐요.",
  relationTag: "닿지 못한 디렉터",
  statSummary: "도하는 끝내 신뢰를 회복하지 못했고, 무대 위에서 자신의 자리를 잃어버렸다.",
};
