import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, MEMBER_PROMPTS, FALLBACK_RESPONSES } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
    const { memberId, userMessage, selectedMissionId, currentStats, chatHistory } = body;

    if (!memberId || !userMessage) {
      return NextResponse.json({ reply: getFallback(memberId ?? "A") }, { status: 200 });
    }

    const memberPrompt = MEMBER_PROMPTS[memberId] ?? MEMBER_PROMPTS["A"];
    const statsText = `현재 스탯 — 인기: ${currentStats.popularity}, 애정: ${currentStats.affection}, 질투: ${currentStats.jealousy}, 멘탈: ${currentStats.mental}`;
    const missionText = `선택한 콘셉트: ${selectedMissionId ?? "없음"}`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ reply: getFallback(memberId) }, { status: 200 });
    }

    const messages = [
      { role: "system", content: `${SYSTEM_PROMPT}\n\n${memberPrompt}\n\n${statsText}\n${missionText}` },
      ...(chatHistory ?? []).slice(-6).map((c: { role: string; message: string }) => ({
        role: c.role,
        content: c.message,
      })),
      { role: "user", content: userMessage },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 200,
        temperature: 0.8,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("Empty response from OpenAI");
    }

    return NextResponse.json({
      reply,
      emotion: detectEmotion(reply),
      statDelta: { affection: 1, jealousy: 1 },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const memberId = body?.memberId ?? "A";
    return NextResponse.json({
      reply: getFallback(memberId),
      emotion: "neutral",
      statDelta: {},
    });
  }
}

function getFallback(memberId: string): string {
  const fallbacks = FALLBACK_RESPONSES[memberId] ?? FALLBACK_RESPONSES["A"];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function detectEmotion(text: string): string {
  if (text.includes("질투") || text.includes("웃기") || text.includes("비교")) return "jealous";
  if (text.includes("좋아") || text.includes("마음") || text.includes("감사")) return "happy";
  if (text.includes("속상") || text.includes("외로") || text.includes("슬프")) return "sad";
  return "neutral";
}
