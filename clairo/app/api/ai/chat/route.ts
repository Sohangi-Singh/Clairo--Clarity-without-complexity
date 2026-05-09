import { NextRequest } from "next/server";
import { generateWithGemini, generateWithVision } from "@/lib/gemini";
import { getChatSystemPrompt } from "@/lib/prompts/chat";

export async function POST(req: NextRequest) {
  try {
    const { query, files, history } = await req.json();
    const systemPrompt = getChatSystemPrompt();

    const conversationContext = history?.length
      ? history.map((m: { role: string; text: string }) => `${m.role}: ${m.text}`).join("\n") + "\n"
      : "";

    const userMessage = `${conversationContext}user: ${query}`;

    let stream;
    if (files?.length) {
      const imageParts = files.map((f: { base64: string; mimeType: string }) => ({
        inlineData: { data: f.base64, mimeType: f.mimeType },
      }));
      stream = await generateWithVision("pro", systemPrompt, imageParts, userMessage);
    } else {
      stream = await generateWithGemini("flash", systemPrompt, userMessage);
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk.text()));
          }
        } catch {
          controller.enqueue(encoder.encode("\n\nSorry, something went wrong. Please try again."));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sorry, something went wrong. Please try again.";
    return new Response(message, {
      status: 500,
    });
  }
}
