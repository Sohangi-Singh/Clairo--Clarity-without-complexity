import { NextRequest } from "next/server";
import { generateWithVision } from "@/lib/gemini";
import { getReceiptScannerPrompt } from "@/lib/prompts/receipt-scanner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = getReceiptScannerPrompt({
      category: body.category || "auto",
      outputFormat: body.outputFormat || "summary",
    });

    const imageParts = (body.images || []).map((img: { base64: string; mimeType: string }) => ({
      inlineData: { data: img.base64, mimeType: img.mimeType || "image/jpeg" },
    }));

    const stream = await generateWithVision("pro", prompt, imageParts, "Analyze these receipts.");
    return streamResponse(stream);
  } catch {
    return new Response("Failed to scan receipts", { status: 500 });
  }
}

async function streamResponse(stream: AsyncIterable<{ text: () => string }>) {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk.text()));
        }
        controller.close();
      } catch {
        controller.close();
      }
    },
  });
  return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
