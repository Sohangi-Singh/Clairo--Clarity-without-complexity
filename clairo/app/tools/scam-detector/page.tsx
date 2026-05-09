"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import Textarea from "@/components/ui/Textarea";
import DropZone from "@/components/upload/DropZone";
import VoiceInput from "@/components/voice/VoiceInput";
import OutputCard from "@/components/output/OutputCard";
import TrustIndicator from "@/components/output/TrustIndicator";
import { useAI } from "@/hooks/useAI";
import { useUpload } from "@/hooks/useUpload";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId } from "@/types";

const inputMethods = [
  { id: "screenshot", emoji: "📸", label: "Upload screenshot" },
  { id: "paste-sms", emoji: "💬", label: "Paste SMS/message" },
  { id: "paste-email", emoji: "📧", label: "Paste email" },
  { id: "describe", emoji: "🎙️", label: "Describe the message" },
];

const sources = [
  { id: "whatsapp", emoji: "💬", label: "WhatsApp" },
  { id: "sms", emoji: "📱", label: "SMS" },
  { id: "email", emoji: "📧", label: "Email" },
  { id: "phone-call", emoji: "📞", label: "Phone call" },
  { id: "social-media", emoji: "🌐", label: "Social media" },
  { id: "other", emoji: "❓", label: "Other" },
];

export default function ScamDetectorPage() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("patient-explainer");
  const [inputMethod, setInputMethod] = useState("");
  const [messageText, setMessageText] = useState("");
  const [source, setSource] = useState("");

  const { output, loading, error, generate } = useAI({ endpoint: "/api/ai/scam-detector" });
  const { files, addFiles } = useUpload();
  const { addToHistory } = useHistory();

  const handleAnalyze = async () => {
    const images = files.map((f) => ({ base64: f.base64, mimeType: f.file.type }));
    const result = await generate({ images: images.length ? images : undefined, messageText, source, language: "english" });
    if (result) addToHistory({ tool_name: "scam-detector", tool_display_name: "Scam Detector", inputs: { source, inputMethod }, output_text: result });
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step} totalSteps={2} title={
        step === 1 ? "What do you want to check?" : "Where did you receive this?"
      } subtitle={
        step === 1 ? "Share the suspicious message so we can take a look." : "This helps us check for common scam patterns."
      }>
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {inputMethods.map((m) => <OptionCard key={m.id} emoji={m.emoji} label={m.label} selected={inputMethod === m.id} onClick={() => setInputMethod(m.id)} />)}
            </div>
            {inputMethod === "screenshot" && <DropZone accept="image/*" onFiles={addFiles} label="Upload the screenshot" />}
            {(inputMethod === "paste-sms" || inputMethod === "paste-email") && (
              <Textarea placeholder="Paste the message here..." value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={6} />
            )}
            {inputMethod === "describe" && (
              <div className="flex flex-col gap-3">
                <Textarea placeholder="Describe what the message said..." value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={4} />
                <VoiceInput size="lg" onResult={setMessageText} label="Or describe it by voice" />
              </div>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sources.map((s) => <OptionCard key={s.id} emoji={s.emoji} label={s.label} selected={source === s.id} onClick={() => setSource(s.id)} />)}
          </div>
        )}
        <StepNav showBack={step > 1} onBack={() => setStep(step - 1)} onNext={() => { if (step < 2) setStep(step + 1); else handleAnalyze(); }} nextLabel={step === 2 ? "Check this message →" : "Continue"} loading={loading} />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} error={error} toolEmoji="🔍" />
      {output && (
        <TrustIndicator level={output.includes("LIKELY A SCAM") ? "red" : output.includes("BE CAREFUL") ? "yellow" : "green"} message={output.includes("LIKELY A SCAM") ? "This looks suspicious — be very careful" : output.includes("BE CAREFUL") ? "Some concerning signs found — proceed with caution" : "This appears to be safe"} disclaimer="If in doubt, do not share personal information or click any links." />
      )}
    </div>
  );

  return <ToolLayout toolName="Scam Detector" toolEmoji="🔍" toolDescription="Check if a message or link might be a scam" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
