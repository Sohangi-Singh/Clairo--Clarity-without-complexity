import { NextRequest } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getResumeAssistantPrompt } from "@/lib/prompts/resume-assistant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.refine) {
      const stream = await generateWithGemini("flash", "You are a resume editor.", `Instruction: ${body.instruction}\n\nCurrent content:\n${body.currentOutput}`);
      return streamResponse(stream);
    }

    const prompt = getResumeAssistantPrompt({
      action: body.action || "improve",
      resumeContent: body.resumeContent || "",
      targetRole: body.targetRole || "",
      industry: body.industry || "",
      experienceLevel: body.experienceLevel || "entry",
      tone: body.tone || "professional",
      language: body.language || "english",
    });
    const stream = await generateWithGemini("flash", prompt, "Create the content.");
    return streamResponse(stream);
  } catch {
    return new Response("Failed to generate", { status: 500 });
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
