import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Directing: Dopamine Diva",
  description: "AI 기반 아이돌 스타일링 디렉팅 및 멀티 엔딩 시뮬레이션 게임",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={spaceGrotesk.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
