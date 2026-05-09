import { NextRequest } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getScheduleMakerPrompt } from "@/lib/prompts/schedule-maker";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.refine) {
      const stream = await generateWithGemini("flash", "You are a schedule editor.", `Instruction: ${body.instruction}\n\nCurrent schedule:\n${body.currentOutput}`);
      return streamResponse(stream);
    }

    const prompt = getScheduleMakerPrompt({
      type: body.type || "daily",
      wakeTime: body.wakeTime || "7:00 AM",
      sleepTime: body.sleepTime || "11:00 PM",
      commitments: body.commitments || [],
      priority: body.priority || "balanced",
      breakStyle: body.breakStyle || "no-preference",
      language: body.language || "english",
    });

    const stream = await generateWithGemini("flash", prompt, "Create the schedule.");
    return streamResponse(stream);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create schedule";
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
