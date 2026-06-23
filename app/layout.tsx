import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Directing: Dopamine Diva",
  description: "AI 기반 아이돌 스타일링 디렉팅 및 멀티 엔딩 시뮬레이션 게임",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
