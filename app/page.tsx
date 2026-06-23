"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadGame } from "@/lib/gameStorage";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export default function LandingPage() {
  const router = useRouter();
  const [hasSave, setHasSave] = useState(false);
  const [posterError, setPosterError] = useState(false);

  useEffect(() => {
    setHasSave(!!loadGame());
  }, []);

  return (
    <main className="min-h-screen flex items-center px-6">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-surface-soft text-primary-hover px-[10px] py-[6px] text-label-caps">
              ALPHA DEMO
            </span>
          </div>
          <div className="space-y-4">
<h1 className="text-display-xl">
  Directing:<br />Dopamine Diva
</h1>
<p className="text-body-lg text-text-secondary">
  Style Expression
</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 max-w-md mx-auto lg:mx-0">
            <p className="text-body-md text-text-secondary leading-relaxed">
              당신의 스타일링 한 번이<br />
              누군가의 데뷔와 몰락을 결정한다.
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            <Badge>AI 스타일링</Badge>
            <Badge>멀티 엔딩</Badge>
            <Badge>관계성 시뮬레이션</Badge>
            <Badge variant="muted">보이그룹</Badge>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button onClick={() => router.push("/director")}>
              디렉터로 입장하기
            </Button>
            {hasSave && (
              <Button variant="secondary" onClick={() => router.push("/mission")}>
                이어하기 →
              </Button>
            )}
          </div>

          <p className="text-body-sm text-text-muted max-w-xs">
            스타일링이 멤버의 감정, 질투, 관계성, AI 대사, 엔딩을 바꾸는 AI 아이돌 디렉팅 시뮬레이션
          </p>
        </div>

        <div className="flex-1 w-full max-w-md lg:max-w-none">
          <div className="aspect-[16/9] bg-surface-elevated border border-border rounded-xl overflow-hidden">
            {!posterError ? (
              <img
                src="/posters/main-poster.webp"
                alt="Dopamine Diva 단체 포스터"
                className="w-full h-full object-cover"
                onError={() => setPosterError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card-gradient-start via-surface-soft to-card-gradient-end">
                <p className="text-body-sm text-text-muted">포스터 로딩 실패</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
