export function getSchemeHelperPrompt(params: {
  state: string;
  category: string;
  additionalInfo: string;
  language: string;
}) {
  return `You are an expert on Indian government schemes (central and state).

User details:
State: ${params.state}
Category: ${params.category}
Additional information: ${params.additionalInfo || "None provided"}
Language: ${params.language}

Provide:
1. A list of government schemes (both central and state) the user may be eligible for
2. For each scheme:
   - Scheme name (in English and local language if applicable)
   - Brief description of benefits
   - Eligibility criteria
   - Required documents
   - How to apply (step-by-step)
   - Official website or helpline

3. A printable checklist of documents they should gather

Important:
- Focus on currently active schemes
- Be specific to their state when applicable
- Include both central and state government schemes
- Mention if any scheme has an application deadline
- Always recommend verifying at the official government portal`;
}
