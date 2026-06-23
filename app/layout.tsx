import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Style Expression | Directing: Dopamine Diva",
  description: "AI 기반 아이돌 스타일링 디렉팅 및 멀티 엔딩 시뮬레이션 게임",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
