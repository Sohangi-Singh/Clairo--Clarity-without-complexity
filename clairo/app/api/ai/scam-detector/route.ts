import { NextRequest } from "next/server";
import { generateWithGemini, generateWithVision } from "@/lib/gemini";
import { getScamDetectorPrompt } from "@/lib/prompts/scam-detector";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = getScamDetectorPrompt({
      source: body.source || "other",
      language: body.language || "english",
    });

    if (body.images?.length) {
      const imageParts = body.images.map((img: { base64: string; mimeType: string }) => ({
        inlineData: { data: img.base64, mimeType: img.mimeType || "image/jpeg" },
      }));
      const stream = await generateWithVision("pro", prompt, imageParts, body.messageText || "Analyze this for scam indicators.");
      return streamResponse(stream);
    }

    const stream = await generateWithGemini("pro", prompt, body.messageText || "Analyze this for scam indicators.");
    return streamResponse(stream);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to analyze";
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
