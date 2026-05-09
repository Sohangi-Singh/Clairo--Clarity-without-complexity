export function getResumeAssistantPrompt(params: {
  action: string;
  resumeContent: string;
  targetRole: string;
  industry: string;
  experienceLevel: string;
  tone: string;
  language: string;
}) {
  const actionInstructions: Record<string, string> = {
    improve: "Improve and polish the existing resume. Fix formatting, strengthen bullet points, and add impact metrics.",
    "cover-letter": "Write a tailored cover letter based on the resume and target role.",
    "linkedin-bio": "Create a compelling LinkedIn bio/summary.",
    tailor: "Tailor the resume specifically for the target role. Highlight relevant experience.",
    interview: "Generate likely interview questions and suggested answers based on the resume.",
    "ats-check": "Analyze the resume for ATS compatibility. Suggest keyword improvements.",
  };

  return `You are a professional resume and career consultant.

Action: ${actionInstructions[params.action] || params.action}

${params.resumeContent ? `Current resume content:\n---\n${params.resumeContent}\n---` : "No existing resume provided — create from scratch."}

Target role: ${params.targetRole || "General"}
Industry: ${params.industry || "Not specified"}
Experience level: ${params.experienceLevel}
Tone: ${params.tone}
Language: ${params.language}

Make the output professional and ready to use.
Use strong action verbs and quantifiable achievements.`;
}
