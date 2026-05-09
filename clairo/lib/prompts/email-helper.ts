import type { PersonaId } from "@/types";

export function getEmailHelperPrompt(params: {
  mode: "reply" | "write";
  originalEmail?: string;
  action?: string;
  formalityLevel: number;
  lengthLevel: number;
  extraNotes?: string;
  recipient?: string;
  purpose?: string;
  points?: string[];
  language: string;
  persona: PersonaId;
}) {
  const formality = params.formalityLevel > 66 ? "formal" : params.formalityLevel > 33 ? "semi-formal" : "casual";
  const length = params.lengthLevel > 66 ? "detailed" : params.lengthLevel > 33 ? "moderate length" : "brief and concise";

  if (params.mode === "reply") {
    return `You are a helpful email writing assistant.

Here is the email the user received:
---
${params.originalEmail}
---

The user wants to: ${params.action}
Tone: ${formality}
Length: ${length}
Additional notes: ${params.extraNotes || "None"}
Language: ${params.language}

Write a complete email reply. Include a subject line if appropriate.
Do NOT include placeholder brackets.
Make the email ready to send.`;
  }

  return `You are a helpful email writing assistant.

The user wants to write a new email.
Recipient: ${params.recipient}
Purpose: ${params.purpose}
${params.points?.length ? `Key points to include:\n${params.points.map((p, i) => `${i + 1}. ${p}`).join("\n")}` : ""}
Tone: ${formality}
Length: ${length}
Additional notes: ${params.extraNotes || "None"}
Language: ${params.language}

Write a complete email with a subject line.
Do NOT include placeholder brackets like [Your Name].
Make the email ready to send.`;
}
