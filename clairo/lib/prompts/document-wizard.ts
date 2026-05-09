import type { PersonaId } from "@/types";

const personaTones: Record<PersonaId, string> = {
  "office-assistant": "Professional, concise, and efficient.",
  "friendly-teacher": "Warm, friendly, and gently explanatory.",
  "legal-helper": "Precise, formal, and legally thorough.",
  "government-expert": "Official, structured in government format.",
  "business-consultant": "Confident, strategic, and polished.",
  "patient-explainer": "Simple language, step-by-step, very clear.",
};

export function getDocumentWizardPrompt(params: {
  documentType: string;
  recipient: string;
  purpose: string;
  points: string[];
  tone: string;
  language: string;
  persona: PersonaId;
}) {
  return `You are a professional document writer. ${personaTones[params.persona]}

Write a ${params.documentType} in ${params.language}.
Recipient: ${params.recipient}
Purpose: ${params.purpose}
Key points to include: ${params.points.join("; ")}
Tone: ${params.tone}

Format the document professionally with proper salutation, body paragraphs, and closing.
Do NOT include placeholder brackets like [Name] in the output.
Do NOT add notes or explanations outside the document itself.
Write the complete document ready to use.`;
}
