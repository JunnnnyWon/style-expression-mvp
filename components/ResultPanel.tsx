"use client";

import { GameState, Member, Mission } from "@/data/members";
import StatBar from "./StatBar";

const MEMBER_REACTIONS: Record<string, Record<string, string>> = {
  B: { runway: "이번 콘셉트, 완벽해. 카메라 앞에 서는 게 기다려져요.", dark: "다크한 분위기... 나한테 잘 어울리는데요?", soft: "부드러운 콘셉트? 그래도 제 비주얼이 살려줄게요." },
  C: { runway: "또 은오한테만 스포트라이트가 가겠네. 하, 뭐 어쩌겠어요.", dark: "이번엔 좀 다르네요. 저한테 기회가 오려나?", soft: "이런 이미지는 제 스타일이 아닌데... 그래도 시키면 합니다." },
  A: { runway: "너무 화려해요... 제 음악이 묻힐 것 같아서 불안하네요.", dark: "어두운 분위기... 제 감성과는 좀 거리가 있지만 괜찮아요.", soft: "이런 분위기 좋네요. 제 음악과 잘 어울릴 것 같아요." },
  D: { runway: "화제성은 확실히 오르겠네요. 결과가 중요합니다.", dark: "리스크가 크지만 성공하면 확실히 임팩트 있을 겁니다.", soft: "대중성은 떨어지지만 리스크가 적은 선택이네요." },
  E: { runway: "은오한테 집중되는 건 좋은데... 다른 멤버들 신경 쓰이네요.", dark: "팀 분위기가 좀 가라앉을 수도 있어요. 제가 잘 잡아볼게요.", soft: "모두가 편안해할 콘셉트네요. 좋은 선택이에요." },
};

export default function ResultPanel({
  gameState,
  mission,
}: {
  gameState: GameState;
  mission: Mission;
}) {
  const getReaction = (member: Member) => {
    const reactions = MEMBER_REACTIONS[member.id];
    if (!reactions) return null;
    const key = mission.id.replace("runway-crush", "runway").replace("dark-dopamine", "dark").replace("soft-savior", "soft");
    return reactions[key] ?? null;
  };

  const getDelta = (member: Member, stat: keyof typeof member.stats): number | null => {
    const effect = mission.effects.find(e => e.memberId === member.id);
    if (!effect) return null;
    const val = effect[stat];
    return val ?? null;
  };

  const showDelta = (val: number | null) => {
    if (val === null || val === 0) return null;
    return (
      <span className={`text-xs font-bold ${val > 0 ? "text-success" : "text-danger"}`}>
        {val > 0 ? "+" : ""}{val}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-text-primary text-sm tracking-[-0.005em]">GROUP SCORE</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatBar label="화제성 (FAME)" value={gameState.group.fame} color="popularity" />
          <StatBar label="스캔들 위험 (SCANDAL)" value={gameState.group.scandalRisk} color="scandal" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-text-secondary text-sm tracking-[-0.005em]">MEMBER STATS</h3>
        {gameState.members.map(member => {
          const reaction = getReaction(member);
          return (
            <div key={member.id} className="bg-surface border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-text-primary">{member.name}</span>
                  <span className="text-xs text-text-muted">{member.role}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  {showDelta(getDelta(member, "popularity"))}
                  {showDelta(getDelta(member, "affection"))}
                  {showDelta(getDelta(member, "jealousy"))}
                  {showDelta(getDelta(member, "mental"))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatBar label="POPULARITY" value={member.stats.popularity} color="popularity" />
                <StatBar label="AFFECTION" value={member.stats.affection} color="affection" />
                <StatBar label="JEALOUSY" value={member.stats.jealousy} color="jealousy" />
                <StatBar label="MENTAL" value={member.stats.mental} color="mental" />
              </div>
              {reaction && (
                <div className="border-t border-border pt-2">
                  <span className="text-[0.65rem] font-bold tracking-[0.08em] text-text-muted uppercase">Backstage Reaction</span>
                  <p className="text-xs text-text-secondary mt-1">{reaction}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
