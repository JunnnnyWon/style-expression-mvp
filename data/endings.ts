import { Ending } from "./members";

export const endings: Ending[] = [
  {
    id: "dome-light",
    title: "DOME LIGHT",
    tone: "1군 팝스타, 대성공",
    description: "화려한 조명 아래, 당신의 그룹은 최고의 무대에 섰다. 대중의 열광적인 환호 속에서 모든 멤버가 빛난다. 당신의 선택이 만들어낸 완벽한 그림이다.",
    imageUrl: "/backgrounds/ending-stage.png",
  },
  {
    id: "local-stage",
    title: "LOCAL STAGE",
    tone: "생계형 아이돌, 현실적 생존",
    description: "꾸준히 활동했지만 규모는 작았다. 그래도 멤버들은 무대에 설 수 있다는 사실에 감사한다. 현실은 녹록지 않지만, 그래도 음악을 멈추지 않는다.",
  },
  {
    id: "after-contract",
    title: "AFTER CONTRACT",
    tone: "일반인 복귀, 담담한 계약 종료",
    description: "계약 기간이 끝났다. 각자의 길을 가기로 한 멤버들은 담담하게 마지막 인사를 나눈다. 아이돌이 아닌普通人으로서의 새로운 시작. 아쉽지만 후회는 없다.",
  },
  {
    id: "business-exit",
    title: "BUSINESS EXIT",
    tone: "D의 현실적 이탈, 계약 파탄",
    description: "D가 먼저 결정을 내렸다. '감정적인 판단보다 결과가 중요합니다.' 그의 차가운 목소리가 팀에 울려 퍼진다. 사업적으로 실패한 프로젝트, 남은 멤버들은 허탈하게 바라본다.",
  },
  {
    id: "night-fall",
    title: "NIGHT FALL",
    tone: "관계성 과열, 어두운 언더그라운드 암시",
    description: "질투와 스캔들이 팀을 집어삼켰다. 관계성은 과열되었고, 언더그라운드의 어두운 유혹이 그들을 감싼다. 화려했던 조명이 꺼지고 남은 것은 깨진 관계의 파편들뿐.",
  },
];

export interface EndingCondition {
  endingId: string;
  check: (fame: number, scandalRisk: number, members: { id: string; stats: { popularity: number; affection: number; jealousy: number; mental: number } }[]) => boolean;
}
