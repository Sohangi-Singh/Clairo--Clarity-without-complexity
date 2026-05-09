import { NextRequest } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getDocumentWizardPrompt } from "@/lib/prompts/document-wizard";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.refine) {
      const stream = await generateWithGemini(
        "flash",
        "You are a document editor. Apply the following instruction to improve the document.",
        `Instruction: ${body.instruction}\n\nCurrent document:\n${body.currentOutput}`
      );
      return streamResponse(stream);
    }

    const prompt = getDocumentWizardPrompt({
      documentType: body.documentType || "letter",
      recipient: body.recipient || "",
      purpose: body.purpose || "",
      points: body.points || [],
      tone: body.tone || "formal",
      language: body.language || "english",
      persona: body.persona || "office-assistant",
    });

    const stream = await generateWithGemini("flash", prompt, body.purpose || "Write the document.");
    return streamResponse(stream);
  } catch {
    return new Response("Failed to generate document", { status: 500 });
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
  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
