import { NextRequest } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getSchemeHelperPrompt } from "@/lib/prompts/scheme-helper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = getSchemeHelperPrompt({
      state: body.state || "",
      category: body.category || "",
      additionalInfo: body.additionalInfo || "",
      language: body.language || "english",
    });
    const stream = await generateWithGemini("pro", prompt, "Find eligible government schemes.");
    return streamResponse(stream);
  } catch {
    return new Response("Failed to find schemes", { status: 500 });
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
