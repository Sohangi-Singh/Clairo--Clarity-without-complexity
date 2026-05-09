import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getVoiceIntentPrompt } from "@/lib/prompts/voice-intent";

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();
    const prompt = getVoiceIntentPrompt();

    const stream = await generateWithGemini("flash", prompt, `Voice input (${language || "english"}): "${text}"`);
    let result = "";
    for await (const chunk of stream) {
      result += chunk.text();
    }

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const confidence = parsed.confidence || "medium";

      if (confidence === "high") {
        return NextResponse.json({
          action: "navigate",
          destination: `/tools/${parsed.tool}?intent=${encodeURIComponent(JSON.stringify(parsed.prefill || {}))}`,
          ...parsed,
        });
      }

      return NextResponse.json({
        action: "chat",
        destination: `/chat?q=${encodeURIComponent(text)}`,
        ...parsed,
      });
    }

    return NextResponse.json({
      action: "chat",
      destination: `/chat?q=${encodeURIComponent(text)}`,
      tool: null,
      intent: text,
      confidence: "low",
      prefill: {},
      language: language || "english",
      confirmation_message: `Let me help you with: "${text}"`,
    });
  } catch {
    return NextResponse.json({
      action: "chat",
      destination: `/chat?q=${encodeURIComponent("")}`,
      tool: null,
      intent: "",
      confidence: "low",
      prefill: {},
      language: "english",
      confirmation_message: "Let's figure out what you need together.",
    });
  }
}
