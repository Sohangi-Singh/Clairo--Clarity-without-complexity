import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const flashModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const proModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateWithGemini(
  model: "flash" | "pro",
  systemPrompt: string,
  userContent: string
) {
  try {
    const selectedModel = model === "pro" ? proModel : flashModel;
    const result = await selectedModel.generateContentStream([
      { text: systemPrompt },
      { text: userContent },
    ]);
    return result.stream;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown AI error";
    if (message.includes("429") || message.includes("quota")) {
      throw new Error("AI quota exceeded — please wait a few minutes and try again.");
    }
    if (message.includes("404")) {
      throw new Error("AI model unavailable — please try again later.");
    }
    throw new Error(`AI generation failed: ${message}`);
  }
}

export async function generateWithVision(
  model: "flash" | "pro",
  systemPrompt: string,
  imageParts: Array<{ inlineData: { data: string; mimeType: string } }>,
  textPrompt: string
) {
  try {
    const selectedModel = model === "pro" ? proModel : flashModel;
    const result = await selectedModel.generateContentStream([
      { text: systemPrompt },
      ...imageParts,
      { text: textPrompt },
    ]);
    return result.stream;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown AI error";
    if (message.includes("429") || message.includes("quota")) {
      throw new Error("AI quota exceeded — please wait a few minutes and try again.");
    }
    if (message.includes("404")) {
      throw new Error("AI model unavailable — please try again later.");
    }
    throw new Error(`AI generation failed: ${message}`);
  }
}
