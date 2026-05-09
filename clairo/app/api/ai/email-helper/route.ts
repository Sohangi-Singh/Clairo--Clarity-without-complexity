import { NextRequest } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getEmailHelperPrompt } from "@/lib/prompts/email-helper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.refine) {
      const stream = await generateWithGemini(
        "flash",
        "You are an email editor. Apply the following instruction to improve the email.",
        `Instruction: ${body.instruction}\n\nCurrent email:\n${body.currentOutput}`
      );
      return streamResponse(stream);
    }

    const mode = body.mode || "reply";
    const prompt = getEmailHelperPrompt({
      mode,
      originalEmail: body.originalEmail || "",
      action: body.action || "reply",
      formalityLevel: body.formalityLevel ?? 50,
      lengthLevel: body.lengthLevel ?? 50,
      extraNotes: body.extraNotes || "",
      recipient: body.recipient || "",
      purpose: body.purpose || "",
      points: body.points || [],
      language: body.language || "english",
      persona: body.persona || "office-assistant",
    });

    const userMessage = mode === "write" ? "Write the email." : "Write the email reply.";
    const stream = await generateWithGemini("flash", prompt, userMessage);
    return streamResponse(stream);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate email";
    return new Response(message, { status: 500 });
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
