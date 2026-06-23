"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

const SHOP_ITEMS = [
  {
    title: "AI 채팅권",
    description: "멤버와의 추가 대화를 위한 채팅권. 1회 충전으로 5회 대화 가능.",
    price: "₩3,900",
    emoji: "💬",
  },
  {
    title: "한정 룩북",
    description: "시즌 한정 스타일링 콘셉트. 매월 업데이트되는 익스클루시브 디자인.",
    price: "₩6,900",
    emoji: "📖",
  },
  {
    title: "멤버 슬롯 확장",
    description: "VIP 멤버 전용 콘텐츠. 특별 엔딩과 히든 반응 해금.",
    price: "₩12,900",
    emoji: "⭐",
  },
];

export default function ShopPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge>STYLE SHOP</Badge>
          <h2 className="text-[2rem] font-extrabold tracking-[-0.03em]">확장 가능한 BM</h2>
          <p className="text-text-secondary">출시 준비 중</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SHOP_ITEMS.map((item, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl p-6 space-y-4 hover:border-border-strong transition-all"
            >
              <div className="text-4xl">{item.emoji}</div>
              <div className="space-y-2">
                <h3 className="font-bold text-text-primary">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-lg font-bold text-primary">{item.price}</span>
                <span className="text-xs px-3 py-1 bg-surface-soft text-text-muted rounded-full">준비 중</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface/40 border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-text-muted">
            * 본 화면은 BM 확장 가능성을 보여주기 위한 목업입니다. 실제 결제 기능은 포함되어 있지 않습니다.
          </p>
        </div>

        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => router.push("/")}>
            처음으로 돌아가기
          </Button>
        </div>
      </div>
    </main>
  );
}
