import { NextRequest } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getBusinessHelperPrompt } from "@/lib/prompts/business-helper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.refine) {
      const stream = await generateWithGemini("flash", "You are a business content editor.", `Instruction: ${body.instruction}\n\nCurrent content:\n${body.currentOutput}`);
      return streamResponse(stream);
    }

    const prompt = getBusinessHelperPrompt({
      contentType: body.contentType || "whatsapp-post",
      businessName: body.businessName || "",
      productService: body.productService || "",
      price: body.price || "",
      offer: body.offer || "",
      extras: body.extras || "",
      platform: body.platform || "whatsapp",
      language: body.language || "english",
    });

    const stream = await generateWithGemini("flash", prompt, "Create the content.");
    return streamResponse(stream);
  } catch {
    return new Response("Failed to generate content", { status: 500 });
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
