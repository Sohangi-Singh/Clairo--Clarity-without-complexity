import { NextRequest } from "next/server";
import { generateWithVision } from "@/lib/gemini";
import { getMedicalSimplifierPrompt } from "@/lib/prompts/medical-simplifier";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = getMedicalSimplifierPrompt({
      reportType: body.reportType || "other",
      explanationStyle: body.explanationStyle || "simple",
      language: body.language || "english",
    });

    const imageParts = (body.images || []).map((img: { base64: string; mimeType: string }) => ({
      inlineData: { data: img.base64, mimeType: img.mimeType || "image/jpeg" },
    }));

    const stream = await generateWithVision("pro", prompt, imageParts, "Explain this medical report in simple terms.");
    return streamResponse(stream);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to simplify report";
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
