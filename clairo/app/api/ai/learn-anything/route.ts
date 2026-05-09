import { NextRequest } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getLearnAnythingPrompt } from "@/lib/prompts/learn-anything";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.followUp) {
      const stream = await generateWithGemini("flash", "You are a patient explainer. Answer this follow-up question based on the previous explanation.", `Previous explanation:\n${body.currentOutput}\n\nFollow-up question: ${body.followUp}`);
      return streamResponse(stream);
    }

    const prompt = getLearnAnythingPrompt({
      content: body.content || "",
      explanationStyle: body.explanationStyle || "key-points",
      language: body.language || "english",
    });
    const stream = await generateWithGemini("flash", prompt, "Explain this content.");
    return streamResponse(stream);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to explain";
    return new Response(message, { status: 500 });
  }
}

async function streamResponse(stream: AsyncIterable<{ text: () => string }>) {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try { for await (const chunk of stream) { controller.enqueue(encoder.encode(chunk.text())); } controller.close(); } catch { controller.close(); }
    },
  });
  return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
