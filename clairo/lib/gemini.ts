import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const flashModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const proModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

export async function generateWithGemini(
  model: "flash" | "pro",
  systemPrompt: string,
  userContent: string
) {
  const selectedModel = model === "pro" ? proModel : flashModel;
  const result = await selectedModel.generateContentStream([
    { text: systemPrompt },
    { text: userContent },
  ]);
  return result.stream;
}

export async function generateWithVision(
  model: "flash" | "pro",
  systemPrompt: string,
  imageParts: Array<{ inlineData: { data: string; mimeType: string } }>,
  textPrompt: string
) {
  const selectedModel = model === "pro" ? proModel : flashModel;
  const result = await selectedModel.generateContentStream([
    { text: systemPrompt },
    ...imageParts,
    { text: textPrompt },
  ]);
  return result.stream;
}
