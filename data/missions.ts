import { Mission } from "./members";

export const missions: Mission[] = [
  {
    id: "runway-crush",
    title: "Runway Crush",
    description: "실크 셔츠, 크롭 자켓, 글리터 메이크업 중심의 하이패션 콘셉트",
    visualKeyword: "크롭 자켓, 실크 셔츠, 글리터, 하이패션",
    posterUrl: "/posters/runway-crush.webp",
    effects: [
      { memberId: "B", popularity: 25, affection: 5, jealousy: 0, mental: 5 },
      { memberId: "C", popularity: 5, affection: -3, jealousy: 18, mental: -5 },
      { memberId: "A", popularity: 0, affection: -5, jealousy: 8, mental: -8 },
    ],
    groupEffect: { fame: 20, scandalRisk: 18 },
  },
  {
    id: "dark-dopamine",
    title: "Dark Dopamine",
    description: "블랙 레더, 하네스, 스모키 메이크업의 다크 테크웨어 콘셉트",
    visualKeyword: "블랙 레더, 하네스, 스모키, 다크 테크웨어",
    posterUrl: "/posters/dark-dopamine.webp",
    effects: [
      { memberId: "C", popularity: 20, affection: 8, jealousy: 0, mental: 10 },
      { memberId: "E", popularity: 0, affection: 0, jealousy: 0, mental: -8 },
      { memberId: "D", popularity: 8, affection: 0, jealousy: 10, mental: 0 },
    ],
    groupEffect: { fame: 15, scandalRisk: 25 },
  },
  {
    id: "soft-savior",
    title: "Soft Savior",
    description: "화이트 제복, 니트, 카디건의 청량한 남친룩 콘셉트",
    visualKeyword: "화이트 제복, 니트, 카디건, 청량 남친룩",
    posterUrl: "/posters/soft-savior.webp",
    effects: [
      { memberId: "E", popularity: 5, affection: 10, jealousy: 0, mental: 20 },
      { memberId: "A", popularity: 8, affection: 15, jealousy: 0, mental: 5 },
      { memberId: "D", popularity: -5, affection: -8, jealousy: 0, mental: 0 },
      { memberId: "C", popularity: 0, affection: 0, jealousy: 5, mental: 3 },
    ],
    groupEffect: { fame: 5, scandalRisk: -10 },
  },
];
