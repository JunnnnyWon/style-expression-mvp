"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFreshState, saveGame } from "@/lib/gameStorage";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Badge from "@/components/Badge";

export default function DirectorPage() {
  const router = useRouter();
  const [showNameModal, setShowNameModal] = useState(false);
  const [memberAName, setMemberAName] = useState("");

  const handleStart = () => {
    setShowNameModal(true);
  };

  const handleConfirmName = () => {
    const fresh = getFreshState();
    const memberA = fresh.members.find(m => m.id === "A");
    if (memberA) {
      memberA.name = memberAName.trim() || "(이름 미정)";
    }
    saveGame(fresh);
    setShowNameModal(false);
    router.push("/members");
  };

  const handleSkip = () => {
    const fresh = getFreshState();
    saveGame(fresh);
    setShowNameModal(false);
    router.push("/members");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-8">
        <div className="space-y-4">
          <Badge>DIRECTOR BRIEFING</Badge>
          <h2 className="text-[2rem] font-extrabold tracking-[-0.03em]">당신은 총괄 비주얼 디렉터입니다</h2>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8 space-y-4 text-left">
          <p className="text-text-secondary leading-relaxed">
            <span className="text-primary font-semibold">Dopamine Diva</span>는
            데뷔 2년차, 아직 확실한 히트곡이 없다.
          </p>
          <p className="text-text-secondary leading-relaxed">
            기획사는 마지막 기회를 걸었다. 망하기 직전의 프로젝트.
            당신은 새로 투입된 <span className="text-primary font-semibold">총괄 비주얼 디렉터</span>다.
          </p>
          <p className="text-text-secondary leading-relaxed">
            이번 컴백의 콘셉트와 스타일링을 총괄하고,
            멤버들의 감정과 관계성을 관리해야 한다.
          </p>
          <div className="bg-surface-elevated rounded-xl p-4 mt-4">
            <p className="text-sm text-text-muted">
              인기 · 애정 · 질투 · 멘탈 — 모든 스탯은 당신의 선택에 반응한다.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="muted">인기 — 성과 지표</Badge>
          <Badge variant="muted">애정 — 디렉터 호감도</Badge>
          <Badge variant="muted">질투 — 관계성 긴장도</Badge>
          <Badge variant="muted">멘탈 — 안정도</Badge>
        </div>

        <Button onClick={handleStart}>
          프로젝트 시작하기
        </Button>
      </div>

      <Modal open={showNameModal} onClose={handleSkip} title="멤버 A의 이름을 정해주세요">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            작곡 멤버의 이름을 직접 지어주세요.
          </p>
          <input
            type="text"
            value={memberAName}
            onChange={e => setMemberAName(e.target.value)}
            placeholder="이름을 입력하세요..."
            maxLength={10}
            className="w-full h-12 px-4 bg-surface-elevated border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-focus text-center text-lg"
            autoFocus
            onKeyDown={e => e.key === "Enter" && handleConfirmName()}
          />
          <div className="flex gap-3">
            <Button onClick={handleConfirmName} className="flex-1">
              {memberAName.trim() ? `"${memberAName.trim()}"로 정하기` : "시작하기"}
            </Button>
            <Button variant="secondary" onClick={handleSkip}>
              건너뛰기
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
