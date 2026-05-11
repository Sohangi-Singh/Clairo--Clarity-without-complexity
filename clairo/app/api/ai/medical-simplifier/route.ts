import { NextRequest } from "next/server";
import { generateWithVision, generateWithGemini } from "@/lib/gemini";
import { buildMedicalPrompt } from "@/lib/prompts/medical-simplifier";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle refine / action chip follow-ups
    if (body.refine) {
      const stream = await generateWithGemini(
        "pro",
        "You are a calm, helpful medical report explainer. Apply the following instruction to the existing explanation. Follow the same safety rules: never diagnose, never prescribe specific dosages, always recommend consulting a doctor.",
        `Instruction: ${body.instruction}\n\nCurrent explanation:\n${body.currentOutput}`
      );
      return streamResponse(stream);
    }

    const prompt = buildMedicalPrompt({
      reportType: body.reportType || "other",
      explanationMode: body.explanationMode || "simple",
      outputLanguage: body.outputLanguage || "english",
    });

    const imageParts = (body.images || []).map(
      (img: { base64: string; mimeType: string }) => ({
        inlineData: {
          data: img.base64,
          mimeType: img.mimeType || "image/jpeg",
        },
      })
    );

    const userMessage =
      body.explanationMode === "simple"
        ? "Explain this medical report in very simple words."
        : body.explanationMode === "keyFindings"
        ? "Show only the key findings from this report."
        : body.explanationMode === "flagAbnormal"
        ? "Flag only the abnormal values in this report."
        : "Give a full detailed explanation of every value in this report.";

    const stream = await generateWithVision(
      "pro",
      prompt,
      imageParts,
      userMessage
    );
    return streamResponse(stream);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to simplify report";
    return new Response(message, { status: 500 });
  }
}

async function streamResponse(
  stream: AsyncIterable<{ text: () => string }>
) {
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
