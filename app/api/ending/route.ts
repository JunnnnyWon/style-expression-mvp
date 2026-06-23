import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildEndingPrompt } from "@/lib/buildEndingPrompt";
import { happyEndingFallback, badEndingFallback } from "@/data/doha";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedMissionId, endingType, finalStats, chatHistory, characterName } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(endingType === "HAPPY" ? happyEndingFallback : badEndingFallback, { status: 200 });
    }

    const prompt = buildEndingPrompt(characterName ?? "멤버 A", selectedMissionId ?? "soft-savior", endingType ?? "HAPPY", finalStats, chatHistory ?? []);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      generationConfig: { maxOutputTokens: 500, temperature: 0.9 },
    });

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let parsed: any;
    try {
      const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(endingType === "HAPPY" ? happyEndingFallback : badEndingFallback, { status: 200 });
    }

    return NextResponse.json({
      endingType: typeof parsed.endingType === "string" ? parsed.endingType : endingType,
      title: typeof parsed.title === "string" ? parsed.title : (endingType === "HAPPY" ? happyEndingFallback.title : badEndingFallback.title),
      subtitle: typeof parsed.subtitle === "string" ? parsed.subtitle : (endingType === "HAPPY" ? happyEndingFallback.subtitle : badEndingFallback.subtitle),
      body: typeof parsed.body === "string" ? parsed.body : (endingType === "HAPPY" ? happyEndingFallback.body : badEndingFallback.body),
      finalLine: typeof parsed.finalLine === "string" ? parsed.finalLine : (endingType === "HAPPY" ? happyEndingFallback.finalLine : badEndingFallback.finalLine),
      relationTag: typeof parsed.relationTag === "string" ? parsed.relationTag : (endingType === "HAPPY" ? happyEndingFallback.relationTag : badEndingFallback.relationTag),
      statSummary: typeof parsed.statSummary === "string" ? parsed.statSummary : (endingType === "HAPPY" ? happyEndingFallback.statSummary : badEndingFallback.statSummary),
    });
  } catch {
    return NextResponse.json(badEndingFallback, { status: 200 });
  }
}
