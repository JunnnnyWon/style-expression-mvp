"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resetGame } from "@/lib/gameStorage";
import { happyEndingFallback, badEndingFallback } from "@/data/doha";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export default function EndingPage() {
  const router = useRouter();
  const [ending, setEnding] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("mvp-ending-status");
    if (!raw) {
      router.replace("/director");
      return;
    }

    const status = JSON.parse(raw);
    const { endingType, finalStats, selectedMissionId, chatHistory, userTurnCount, characterName } = status;

    fetch("/api/ending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedMissionId,
        endingType,
        finalStats,
        chatHistory: chatHistory ?? [],
        userTurnCount,
        characterName: characterName ?? "멤버 A",
      }),
    })
      .then(res => res.json())
      .then(data => {
        setEnding(data);
        setLoading(false);
      })
      .catch(() => {
        setEnding(endingType === "HAPPY" ? happyEndingFallback : badEndingFallback);
        setLoading(false);
      });
  }, [router]);

  const handleReset = () => {
    localStorage.removeItem("mvp-ending-status");
    resetGame();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted animate-pulse">엔딩을 생성 중...</p>
      </main>
    );
  }

  if (!ending) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <div className="text-center">
          <Badge variant={ending.endingType === "HAPPY" ? "primary" : "muted"}>
            {ending.endingType === "HAPPY" ? "해피 엔딩" : "배드 엔딩"}
          </Badge>
        </div>

        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className={`aspect-video flex items-center justify-center ${
            ending.endingType === "HAPPY"
              ? "bg-gradient-to-br from-emerald-900/60 via-teal-900/40 to-black/90"
              : "bg-gradient-to-br from-rose-900/60 via-purple-900/40 to-black/90"
          }`}>
            <div className="text-center p-8 space-y-3">
              <p className="text-label-caps text-primary-hover">{ending.endingType === "HAPPY" ? "ENDING" : "ENDING"}</p>
              <h2 className="text-display-lg text-white drop-shadow-lg">{ending.title}</h2>
              <p className="text-body-md text-text-secondary">{ending.subtitle}</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-body-md text-text-secondary leading-relaxed whitespace-pre-line">{ending.body}</p>

            <div className="bg-surface-elevated rounded-xl p-5 text-center space-y-2">
              <p className="text-body-sm text-text-muted italic">&ldquo;{ending.finalLine}&rdquo;</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-label-caps text-text-muted uppercase">관계 태그</span>
              <Badge variant="primary">{ending.relationTag}</Badge>
            </div>

            <div className="bg-surface-elevated/50 rounded-xl p-4 text-center">
              <p className="text-body-sm text-text-muted">{ending.statSummary}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={handleReset}>
            다시 플레이하기
          </Button>
          <Button variant="secondary" onClick={() => router.push("/members")}>
            잠긴 멤버 확인하기
          </Button>
        </div>
      </div>
    </main>
  );
}
