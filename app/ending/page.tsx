"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadGame, resetGame } from "@/lib/gameStorage";
import { calculateEnding } from "@/lib/calculateEnding";
import { endings } from "@/data/endings";
import { GameState, Ending } from "@/data/members";
import EndingCard from "@/components/EndingCard";
import Button from "@/components/Button";

export default function EndingPage() {
  const router = useRouter();
  const [ending, setEnding] = useState<Ending | null>(null);

  useEffect(() => {
    const saved = loadGame();
    if (!saved) {
      router.replace("/director");
      return;
    }
    const endingId = calculateEnding(saved);
    const found = endings.find(e => e.id === endingId);
    if (found) setEnding(found);
    saved.endingId = endingId;
    if (typeof window !== "undefined") {
      localStorage.setItem("style-expression-mvp-state", JSON.stringify(saved));
    }
  }, [router]);

  const handleReset = () => {
    resetGame();
    router.push("/");
  };

  if (!ending) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <EndingCard ending={ending} />

        <div className="bg-surface/40 border border-border rounded-xl p-6 text-center space-y-3">
          <p className="text-sm text-text-muted">
            스타일링 선택이 만든 당신만의 이야기입니다.
            <br />
            다른 선택으로 또 다른 엔딩을 경험해보세요.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={handleReset}>
            다시 디렉팅하기
          </Button>
          <Button variant="secondary" onClick={() => router.push("/shop")}>
            BM 목업 보기
          </Button>
        </div>
      </div>
    </main>
  );
}
