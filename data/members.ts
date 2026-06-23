export interface MemberStats {
  popularity: number;
  affection: number;
  jealousy: number;
  mental: number;
}

export interface Member {
  id: "A" | "B" | "C" | "D" | "E";
  name: string;
  role: string;
  archetype: string;
  visualSummary: string;
  personality: string;
  trigger: string;
  imageUrl: string;
  stats: MemberStats;
}

export interface MissionEffect {
  memberId: "A" | "B" | "C" | "D" | "E";
  popularity?: number;
  affection?: number;
  jealousy?: number;
  mental?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  visualKeyword: string;
  posterUrl: string;
  effects: MissionEffect[];
  groupEffect: { fame: number; scandalRisk: number };
}

export interface Ending {
  id: string;
  title: string;
  tone: string;
  description: string;
  imageUrl?: string;
}

export interface ChatMessage {
  memberId: string;
  role: "user" | "assistant";
  message: string;
}

export interface GameState {
  selectedMissionId: string | null;
  members: Member[];
  group: { fame: number; scandalRisk: number };
  chatHistory: ChatMessage[];
  endingId: string | null;
}

export function createInitialMembers(): Member[] {
  return [
    {
      id: "A",
      name: "(이름 미정)",
      role: "작곡 멤버",
      archetype: "예민한 작업실 캐릭터",
      visualSummary: "차분한 분위기, 뿔테 안경, 오버사이즈 니트",
      personality: "감성적이고 예민하다. 음악과 감정을 중요시한다. 디렉터의 관심을 갈망한다.",
      trigger: "감성과 음악이 무시되면 멘탈 하락",
      imageUrl: "/characters/member-a-default.webp",
      stats: { popularity: 40, affection: 50, jealousy: 30, mental: 60 },
    },
    {
      id: "B",
      name: "은오",
      role: "비주얼 캐릭터",
      archetype: "모델형 센터",
      visualSummary: "화려한 비주얼, 트렌디한 스트릿 패션",
      personality: "자신감 넘치고 카리스마 있다. 스포트라이트를 즐긴다. 무대 위에서 빛난다.",
      trigger: "과도한 센터화가 다른 멤버 질투 유발",
      imageUrl: "/characters/member-b-default.webp",
      stats: { popularity: 65, affection: 40, jealousy: 20, mental: 70 },
    },
    {
      id: "C",
      name: "태훈",
      role: "춤·랩",
      archetype: "육각형 무끼 캐릭터",
      visualSummary: "시크하고 날렵한 눈매, 스포티한 실루엣",
      personality: "춤과 랩을 모두 잘하는 육각형 멤버. 비주얼과 실력은 완벽하지만 인기가 따라주지 않아 불만. 디렉터의 인정에 목말라 있다.",
      trigger: "주목받지 못하면 질투 폭발",
      imageUrl: "/characters/member-c-default.webp",
      stats: { popularity: 45, affection: 35, jealousy: 45, mental: 50 },
    },
    {
      id: "D",
      name: "도진",
      role: "보컬",
      archetype: "현실 비즈니스형",
      visualSummary: "세련된 수트, 차가운 인상",
      personality: "현실적이고 계산적인 성격. 성과와 결과를 중시한다. 팀의 비즈니스 마인드를 담당한다.",
      trigger: "성과가 낮으면 신뢰도와 애정 하락",
      imageUrl: "/characters/member-d-default.webp",
      stats: { popularity: 50, affection: 30, jealousy: 25, mental: 65 },
    },
    {
      id: "E",
      name: "정민",
      role: "리더",
      archetype: "멘탈 케어형",
      visualSummary: "부드러운 미소, 따뜻한 이미지, 깔끔한 정장",
      personality: "팀을 먼저 생각하는 리더. 외유내강 타입으로 멤버들의 갈등을 중재한다. 팀 안정을 최우선으로 한다.",
      trigger: "팀 갈등이 심하면 멘탈 소모",
      imageUrl: "/characters/member-e-default.webp",
      stats: { popularity: 55, affection: 55, jealousy: 10, mental: 55 },
    },
  ];
}

export const INITIAL_GAME_STATE: GameState = {
  selectedMissionId: null,
  members: createInitialMembers(),
  group: { fame: 40, scandalRisk: 20 },
  chatHistory: [],
  endingId: null,
};
