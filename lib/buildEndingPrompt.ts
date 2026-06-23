export function buildEndingPrompt(
  characterName: string,
  conceptId: string,
  endingType: "HAPPY" | "BAD",
  stats: { popularity: number; affection: number; jealousy: number; mental: number },
  chatHistory: { role: string; message: string }[],
): string {
  const chatSummary = chatHistory
    .map((c) => `${c.role === "user" ? "디렉터" : characterName}: ${c.message}`)
    .join("\n");

  return `너는 웹 기반 아이돌 스타일링 디렉팅 시뮬레이션 게임의 엔딩 작가다.

캐릭터:
- 이름: ${characterName}
- 포지션: 작곡 멤버
- 성격: 예민함, 외로움, 인정 욕구, 자기 의심, 디렉터에게 마음을 열 수 있음
- 유저는 ${characterName}의 총괄 비주얼 디렉터다

현재 콘셉트: ${conceptId.toUpperCase().replace("-", " ")}

최종 스탯:
- Popularity: ${stats.popularity}
- Affection: ${stats.affection}
- Jealousy: ${stats.jealousy}
- Mental: ${stats.mental}

엔딩 타입: ${endingType}

대화 내역:
${chatSummary}

작성 규칙:
- 한국어로 작성한다
- 엔딩 타입은 반드시 ${endingType}을 따른다
- 유저와 ${characterName}이 나눈 대화에서 중요한 표현이나 감정 흐름을 1~2개 반영한다
- 엔딩은 카드형 문구로 작성한다
- 전체적으로 감성적이지만 과하게 길지 않게 작성한다
- title은 영어 대문자 2~4단어로 작성한다
- subtitle은 한국어로 작성한다
- body는 4~7문장으로 작성한다
- finalLine은 ${characterName}의 마지막 한마디로 작성한다
- statSummary는 최종 수치를 직접 숫자로 쓰지 말고 서사적으로 요약한다
- 노골적인 성적 표현, 자해, 폭력, 미성년자 성적 표현, 착취적 표현은 금지한다
- 배드 엔딩은 관계 실패, 무대 불발, 소외, 연락 두절, 계약 보류 정도로 표현한다
- 시스템, 프롬프트, API, JSON 스키마를 언급하지 않는다

반드시 JSON으로만 응답하라.
마크다운 코드블록을 쓰지 마라.

{
  "endingType": "HAPPY 또는 BAD",
  "title": "영어 대문자 제목",
  "subtitle": "한국어 부제",
  "body": "엔딩 본문 4~7문장",
  "finalLine": "${characterName}의 마지막 한마디",
  "relationTag": "관계 태그",
  "statSummary": "최종 상태 요약"
}`;
}
