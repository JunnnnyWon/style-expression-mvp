"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadGame } from "@/lib/gameStorage";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export default function LandingPage() {
  const router = useRouter();
  const [hasSave, setHasSave] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isExiting, setIsExiting] = useState<string | null>(null);

  useEffect(() => {
    setHasSave(!!loadGame());
  }, []);

  const navigate = (path: string) => {
    if (isExiting) return;
    setIsExiting(path);
    setTimeout(() => router.push(path), 1500);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-6">
      {!imgError ? (
        <img
          src="/posters/front-cover.webp"
          alt="Dopamine Diva 배경"
          className="absolute inset-0 z-0 w-full h-full object-cover"
          style={{
            filter: isExiting ? "blur(0px)" : "blur(20px)",
            transform: isExiting ? "scale(1)" : "scale(1.1)",
            transition: "all 1.5s ease-in-out",
          }}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-background" />
      )}

      <div
        className="absolute inset-0 z-10"
        style={{
          opacity: isExiting ? 0 : 1,
          transition: "opacity 1.5s ease-in-out",
        }}
      >
        <div className="absolute inset-0 bg-background/50" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(242,65,143,0.12), transparent 60%), radial-gradient(ellipse at center, rgba(34,211,238,0.06), transparent 60%)'
          }}
        />
      </div>

      <div
        className="relative z-20 max-w-lg w-full text-center space-y-8"
        style={{
          opacity: isExiting ? 0 : 1,
          transition: "opacity 1.5s ease-in-out",
        }}
      >
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-surface-soft/80 text-primary-hover px-[10px] py-[6px] text-label-caps backdrop-blur-sm">
            ALPHA DEMO
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-display-xl text-white drop-shadow-lg">
            Directing:<br />Dopamine Diva
          </h1>
          <p className="text-body-lg text-text-secondary">
            Style Expression
          </p>
        </div>

        <div className="bg-surface/60 backdrop-blur-sm border border-border/50 rounded-xl p-6">
          <p className="text-body-md text-text-secondary leading-relaxed">
            당신의 스타일링 한 번이<br />
            누군가의 데뷔와 몰락을 결정한다.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Badge>AI 스타일링</Badge>
          <Badge>멀티 엔딩</Badge>
          <Badge>관계성 시뮬레이션</Badge>
          <Badge variant="muted">보이그룹</Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={() => navigate("/director")}>
            디렉터로 입장하기
          </Button>
          {hasSave && (
            <Button variant="secondary" onClick={() => navigate("/mission")}>
              이어하기 →
            </Button>
          )}
        </div>

        <p className="text-body-sm text-text-muted">
          스타일링이 멤버의 감정, 질투, 관계성, AI 대사, 엔딩을 바꾸는 AI 아이돌 디렉팅 시뮬레이션
        </p>
      </div>
    </main>
  );
}
