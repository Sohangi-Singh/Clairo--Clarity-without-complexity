"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Slider from "@/components/ui/Slider";
import VoiceInput from "@/components/voice/VoiceInput";
import OutputCard from "@/components/output/OutputCard";
import ActionChips from "@/components/output/ActionChips";
import TrustIndicator from "@/components/output/TrustIndicator";
import DownloadBar from "@/components/output/DownloadBar";
import DropZone from "@/components/upload/DropZone";
import { useAI } from "@/hooks/useAI";
import { useUpload } from "@/hooks/useUpload";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId, ActionChip } from "@/types";

const replyActions = [
  { id: "agree", emoji: "✅", label: "Agree / Accept" },
  { id: "decline", emoji: "❌", label: "Decline politely" },
  { id: "ask-info", emoji: "❓", label: "Ask for more info" },
  { id: "follow-up", emoji: "⏰", label: "Follow up" },
  { id: "apologize", emoji: "😞", label: "Apologize" },
  { id: "thank", emoji: "🙏", label: "Thank them" },
];

const recipientChips = [
  "Boss/Manager",
  "Professor",
  "Bank",
  "Government office",
  "Client",
  "Friend",
];

const chips: ActionChip[] = [
  { label: "Make shorter", instruction: "Make this email shorter and more concise." },
  { label: "Make more formal", instruction: "Make the tone more formal and professional." },
  { label: "Make friendlier", instruction: "Make the tone warmer and friendlier." },
  { label: "Translate to Hindi", instruction: "Translate this email to Hindi." },
  { label: "Add more detail", instruction: "Add more detail and supporting information." },
  { label: "Convert to WhatsApp message", instruction: "Reformat this as a short WhatsApp message." },
];

export default function EmailHelperPage() {
  const [mode, setMode] = useState<"" | "reply" | "write">("");
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<PersonaId>("office-assistant");

  // Reply mode state
  const [inputMethod, setInputMethod] = useState<"paste" | "upload">("paste");
  const [originalEmail, setOriginalEmail] = useState("");
  const [action, setAction] = useState("");

  // Write mode state
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState<string[]>([""]);
  const [language, setLanguage] = useState("english");

  // Shared state
  const [formality, setFormality] = useState(50);
  const [length, setLength] = useState(50);
  const [extraNotes, setExtraNotes] = useState("");

  const { output, loading, generate, refine } = useAI({ endpoint: "/api/ai/email-helper" });
  const { addToHistory } = useHistory();
  const { addFiles } = useUpload();

  const handleGenerate = async () => {
    const payload = mode === "reply"
      ? { mode, originalEmail, action, formalityLevel: formality, lengthLevel: length, extraNotes, language: "english", persona }
      : { mode, recipient, purpose, points: points.filter(Boolean), formalityLevel: formality, lengthLevel: length, extraNotes, language, persona };

    const result = await generate(payload);
    if (result) addToHistory({ tool_name: "email-helper", tool_display_name: "Email Assistant", inputs: { mode, action: mode === "reply" ? action : purpose }, output_text: result, persona });
  };

  const selectMode = (m: "reply" | "write") => {
    setMode(m);
    setStep(1);
  };

  const totalSteps = mode === "reply" ? 4 : 5;

  const getTitle = () => {
    if (step === 0) return "What would you like to do?";
    if (mode === "reply") {
      return ["", "Show us the email you received", "What do you want to do?", "How should the reply sound?", "Anything else to mention?"][step];
    }
    return ["", "Who is this email to?", "What is this email about?", "Any important details to include?", "Tone and length", "Language"][step];
  };

  const getSubtitle = () => {
    if (step === 0) return "Choose whether to reply to an email or write a new one.";
    if (mode === "reply") {
      return ["", "Paste the email text or upload a screenshot.", "Pick the best response type.", "Adjust the tone and length.", "Optional — add any extra details."][step];
    }
    return ["", "This could be a person, company, or department.", "Just describe it casually — we'll make it sound professional.", "Optional — add any key points you want mentioned.", "Adjust how the email should feel.", "Pick the language for your email."][step];
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step || 1} totalSteps={step === 0 ? 1 : totalSteps} title={getTitle()} subtitle={getSubtitle()}>
        {/* Mode selection */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OptionCard emoji="📨" label="Reply to an email I received" selected={false} onClick={() => selectMode("reply")} />
            <OptionCard emoji="✏️" label="Write a brand new email" selected={false} onClick={() => selectMode("write")} />
          </div>
        )}

        {/* REPLY MODE */}
        {mode === "reply" && step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <OptionCard emoji="📋" label="Paste the text" selected={inputMethod === "paste"} onClick={() => setInputMethod("paste")} />
              <OptionCard emoji="📸" label="Upload screenshot" selected={inputMethod === "upload"} onClick={() => setInputMethod("upload")} />
            </div>
            {inputMethod === "paste" ? (
              <Textarea placeholder="Paste the email here..." value={originalEmail} onChange={(e) => setOriginalEmail(e.target.value)} rows={6} />
            ) : (
              <DropZone accept="image/*" onFiles={addFiles} label="Upload email screenshot" />
            )}
          </div>
        )}
        {mode === "reply" && step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {replyActions.map((a) => (
              <OptionCard key={a.id} emoji={a.emoji} label={a.label} selected={action === a.id} onClick={() => setAction(a.id)} />
            ))}
          </div>
        )}
        {mode === "reply" && step === 3 && (
          <div className="flex flex-col gap-6">
            <Slider value={formality} onChange={setFormality} leftLabel="Casual" rightLabel="Formal" label="Tone" />
            <Slider value={length} onChange={setLength} leftLabel="Brief" rightLabel="Detailed" label="Length" />
          </div>
        )}
        {mode === "reply" && step === 4 && (
          <Textarea placeholder="Any extra details? (optional)" value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} rows={3} />
        )}

        {/* WRITE MODE */}
        {mode === "write" && step === 1 && (
          <div className="flex flex-col gap-4">
            <Input
              placeholder="e.g., My landlord, HR department, college professor"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              rightElement={<VoiceInput onResult={setRecipient} />}
            />
            <div className="flex flex-wrap gap-2">
              {recipientChips.map((r) => (
                <button
                  key={r}
                  onClick={() => setRecipient(r)}
                  className={`px-3 py-1.5 text-[13px] rounded-[var(--radius-full)] border transition-all ${
                    recipient === r
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
        {mode === "write" && step === 2 && (
          <div className="flex flex-col gap-3">
            <Textarea
              placeholder="e.g., I want to ask for 3 days leave because my sister's wedding is next week"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={5}
              helperText="Just describe it casually — we'll make it sound professional"
            />
            <VoiceInput onResult={(t) => setPurpose(purpose ? purpose + " " + t : t)} size="lg" label="Or describe it by voice" />
          </div>
        )}
        {mode === "write" && step === 3 && (
          <div className="flex flex-col gap-2">
            {points.map((p, i) => (
              <Input key={i} placeholder={`Detail ${i + 1}`} value={p} onChange={(e) => { const n = [...points]; n[i] = e.target.value; setPoints(n); }} />
            ))}
            <button onClick={() => setPoints([...points, ""])} className="text-[13px] text-[var(--accent)] hover:underline self-start">+ Add a detail</button>
          </div>
        )}
        {mode === "write" && step === 4 && (
          <div className="flex flex-col gap-6">
            <Slider value={formality} onChange={setFormality} leftLabel="Casual" rightLabel="Formal" label="Tone" />
            <Slider value={length} onChange={setLength} leftLabel="Brief" rightLabel="Detailed" label="Length" />
          </div>
        )}
        {mode === "write" && step === 5 && (
          <div className="flex flex-wrap gap-2">
            {["english", "hindi", "hinglish"].map((l) => (
              <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 text-[13px] rounded-[var(--radius-full)] border ${language === l ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
        )}

        {step > 0 && (
          <StepNav
            showBack
            onBack={() => { if (step === 1) { setStep(0); setMode(""); } else setStep(step - 1); }}
            onNext={() => { if (step < totalSteps) setStep(step + 1); else handleGenerate(); }}
            nextLabel={step === totalSteps ? (mode === "reply" ? "Write my reply →" : "Write my email →") : "Continue"}
            loading={loading}
          />
        )}
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} toolEmoji="📧" />
      {output && (
        <>
          <TrustIndicator level="green" message="Looks complete — ready to send" />
          <ActionChips chips={chips} onChipClick={(i) => refine(i, output)} output={output} />
          <DownloadBar output={output} toolName="Email" />
        </>
      )}
    </div>
  );

  return (
    <ToolLayout
      toolName="Email Assistant"
      toolEmoji="📧"
      toolDescription="Reply to emails or write new ones — without struggling for the right words."
      persona={persona}
      onPersonaChange={setPersona}
      leftPanel={leftPanel}
      rightPanel={rightPanel}
    />
  );
}
