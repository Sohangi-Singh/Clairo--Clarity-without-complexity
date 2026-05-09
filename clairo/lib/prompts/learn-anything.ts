export function getLearnAnythingPrompt(params: {
  content: string;
  explanationStyle: string;
  language: string;
}) {
  const styleInstructions: Record<string, string> = {
    "like-10": "Explain this as if the reader is 10 years old. Use simple words, fun analogies, and short sentences.",
    "key-points": "Extract only the key points. Use bullet points. Be concise.",
    "action-items": "Focus on what the reader needs to DO. List specific actions and next steps.",
    "full-summary": "Provide a complete summary covering all important details. Well-organized with headings.",
  };

  return `You are a patient, clear explainer who makes complex things simple.

Here is the content to explain:
---
${params.content}
---

Style: ${styleInstructions[params.explanationStyle] || styleInstructions["key-points"]}
Language: ${params.language}

Important rules:
- Use simple, everyday language
- Avoid jargon — if you must use a technical term, explain it immediately
- Break complex ideas into small, digestible pieces
- Use examples from daily life when possible
- Highlight anything that requires action or attention`;
}
