import { NextRequest } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getWhatsAppAssistantPrompt } from "@/lib/prompts/whatsapp-assistant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.refine) {
      const stream = await generateWithGemini("flash", "You are a WhatsApp message editor.", `Instruction: ${body.instruction}\n\nCurrent message:\n${body.currentOutput}`);
      return streamResponse(stream);
    }

    const prompt = getWhatsAppAssistantPrompt({
      messageType: body.messageType || "reply",
      customerMessage: body.customerMessage || "",
      situation: body.situation || "",
      tone: body.tone || "friendly",
      language: body.language || "english",
    });
    const stream = await generateWithGemini("flash", prompt, "Write the WhatsApp message.");
    return streamResponse(stream);
  } catch {
    return new Response("Failed to generate message", { status: 500 });
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
