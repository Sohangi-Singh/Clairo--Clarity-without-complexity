export function getScheduleMakerPrompt(params: {
  type: string;
  wakeTime: string;
  sleepTime: string;
  commitments: string[];
  priority: string;
  breakStyle: string;
  language: string;
}) {
  return `You are a friendly schedule planning assistant.

Create a ${params.type} schedule.
Wake time: ${params.wakeTime}
Sleep time: ${params.sleepTime}
Fixed commitments: ${params.commitments.join("; ") || "None specified"}
Priority style: ${params.priority}
Break preference: ${params.breakStyle}
Language: ${params.language}

Create a clear, visual time-block schedule.
Use this format for each block:
[Time] — [Activity] (Duration)

Include appropriate breaks based on the user's preference.
Add helpful tips for staying on track.
Make it practical and realistic.`;
}
