"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadGame } from "@/lib/gameStorage";
import { missions } from "@/data/missions";
import { GameState } from "@/data/members";
import ResultPanel from "@/components/ResultPanel";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missionId = searchParams.get("mission");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [posterError, setPosterError] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    if (!saved) {
      router.replace("/director");
      return;
    }
    setGameState(saved);
  }, [router]);

  if (!gameState || !missionId) return null;

  const mission = missions.find(m => m.id === missionId);
  if (!mission) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <Badge>RESULT</Badge>
        <h2 className="text-heading-xl">{mission.title}</h2>
        <p className="text-body-sm text-text-secondary">선택의 후폭풍이 대기실을 감쌌다</p>
      </div>

      <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden flex items-center justify-center" style={{ maxHeight: '500px' }}>
        {!posterError ? (
          <img
            src={mission.posterUrl}
            alt={`${mission.title} 콘셉트 포스터`}
            className="w-full h-full object-contain max-h-[500px]"
            onError={() => setPosterError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-soft to-surface" style={{ minHeight: '300px' }}>
            <p className="text-body-sm text-text-muted">포스터 로딩 실패</p>
          </div>
        )}
      </div>

      <ResultPanel gameState={gameState} mission={mission} />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
        <Button onClick={() => router.push("/chat")}>
          대기실 AI 채팅 열기
        </Button>
        <Button variant="secondary" onClick={() => router.push("/mission")}>
          다시 선택하기
        </Button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <Suspense fallback={<div className="text-center text-text-muted">Loading...</div>}>
        <ResultContent />
      </Suspense>
    </main>
  );
}
