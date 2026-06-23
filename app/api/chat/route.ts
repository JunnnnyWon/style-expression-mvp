import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildChatPrompt } from "@/lib/buildChatPrompt";
import { clampStatDelta, applyStatDelta } from "@/lib/applyStatDelta";
import { concepts } from "@/data/concepts";
import { dohaFallbackReplies } from "@/data/doha";

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
    const { memberId, userMessage, selectedMissionId, currentStats, chatHistory, characterName } = body;

    if (!memberId || !userMessage) {
      const fallback = dohaFallbackReplies.neutral;
      return NextResponse.json({ reply: fallback.reply, emotion: fallback.emotion, statDelta: fallback.statDelta, endingHint: fallback.endingHint }, { status: 200 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = dohaFallbackReplies.neutral;
      return NextResponse.json({ reply: fallback.reply, emotion: fallback.emotion, statDelta: fallback.statDelta, endingHint: fallback.endingHint }, { status: 200 });
    }

    const conceptId = selectedMissionId ?? "soft-savior";
    const prompt = buildChatPrompt(characterName ?? "멤버 A", conceptId, currentStats);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.8,
      },
    });

    const history = (chatHistory ?? []).slice(-6).map((c: { role: string; message: string }) => ({
      role: c.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: c.message }],
    }));

    const chat = model.startChat({
      history: [{ role: "user" as const, parts: [{ text: prompt }] }, ...history],
    });

    const result = await chat.sendMessage(userMessage);
    const raw = result.response.text();

    let parsed: any;
    try {
      const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const fallback = dohaFallbackReplies.neutral;
      return NextResponse.json({ reply: fallback.reply, emotion: fallback.emotion, statDelta: fallback.statDelta, endingHint: fallback.endingHint }, { status: 200 });
    }

    const reply = typeof parsed.reply === "string" ? parsed.reply : dohaFallbackReplies.neutral.reply;
    const emotion = typeof parsed.emotion === "string" ? parsed.emotion : "neutral";
    const rawDelta = parsed.statDelta ?? {};
    const statDelta = clampStatDelta(rawDelta);
    const endingHint = typeof parsed.endingHint === "string" ? parsed.endingHint : "none";

    return NextResponse.json({ reply, emotion, statDelta, endingHint });
  } catch (error) {
    console.error("Chat API error:", error);
    const fallback = dohaFallbackReplies.neutral;
    return NextResponse.json({ reply: fallback.reply, emotion: fallback.emotion, statDelta: fallback.statDelta, endingHint: fallback.endingHint }, { status: 200 });
  }
}
