"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import VoiceInput from "@/components/voice/VoiceInput";
import DropZone from "@/components/upload/DropZone";
import OutputCard from "@/components/output/OutputCard";
import TrustIndicator from "@/components/output/TrustIndicator";
import FollowUpChips from "@/components/output/FollowUpChips";
import { useAI } from "@/hooks/useAI";
import { useUpload } from "@/hooks/useUpload";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId } from "@/types";

const inputMethods = [
  { id: "upload", emoji: "📎", label: "Upload document" },
  { id: "paste", emoji: "📋", label: "Paste text" },
  { id: "url", emoji: "🌐", label: "Paste a website URL" },
  { id: "voice", emoji: "🎙️", label: "Describe your confusion by voice" },
];

const styles = [
  { id: "like-10", emoji: "🧒", label: "Like I'm 10" },
  { id: "key-points", emoji: "📌", label: "Key points only" },
  { id: "action-items", emoji: "⚡", label: "What do I need to do?" },
  { id: "full-summary", emoji: "📖", label: "Full summary" },
];

const followUps = [
  "What does this mean?",
  "Is this urgent?",
  "What action do I take?",
  "What if I ignore this?",
  "Explain even simpler",
];

export default function LearnAnythingPage() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("friendly-teacher");
  const [inputMethod, setInputMethod] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [explanationStyle, setExplanationStyle] = useState("");

  const { output, loading, error, generate } = useAI({ endpoint: "/api/ai/learn-anything" });
  const { addFiles } = useUpload();
  const { addToHistory } = useHistory();

  const fetchUrl = async () => {
    if (!url.trim()) return;
    setUrlLoading(true);
    try {
      const res = await fetch("/api/ai/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data.text || "Could not extract content from this URL.");
      }
    } catch {
      setContent("Could not fetch this URL. Please try pasting the content instead.");
    } finally {
      setUrlLoading(false);
    }
  };

  const handleExplain = async () => {
    const result = await generate({ content, explanationStyle, language: "english" });
    if (result) addToHistory({ tool_name: "learn-anything", tool_display_name: "Learn Anything", inputs: { explanationStyle, inputMethod }, output_text: result });
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step} totalSteps={3} title={
        step === 1 ? "What do you want to understand?" : step === 2 ? "Share the content" : "How should we explain it?"
      } subtitle={
        step === 1 ? "Choose how you want to share the content." : step === 2 ? "Paste, upload, share a link, or speak — however is easiest." : "Pick the style that works best for you."
      }>
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {inputMethods.map((m) => <OptionCard key={m.id} emoji={m.emoji} label={m.label} selected={inputMethod === m.id} onClick={() => setInputMethod(m.id)} />)}
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {inputMethod === "upload" && <DropZone accept="image/*,.pdf,.docx" onFiles={addFiles} label="Upload your document" />}
            {inputMethod === "paste" && <Textarea placeholder="Paste the text here..." value={content} onChange={(e) => setContent(e.target.value)} rows={8} />}
            {inputMethod === "url" && (
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  onClick={fetchUrl}
                  disabled={!url.trim() || urlLoading}
                  className="self-start px-4 py-2 text-[13px] font-medium rounded-[var(--radius-md)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-all"
                >
                  {urlLoading ? "Fetching..." : "Fetch page content"}
                </button>
                {content && (
                  <p className="text-[13px] text-[var(--text-tertiary)]">
                    Content fetched ({content.length} characters)
                  </p>
                )}
              </div>
            )}
            {inputMethod === "voice" && (
              <div className="flex flex-col gap-3">
                <VoiceInput size="lg" onResult={setContent} label="Tell us what you're confused about" />
                {content && (
                  <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] p-3">
                    <p className="text-[14px] text-[var(--text-primary)]">&ldquo;{content}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
            {content && inputMethod !== "voice" && inputMethod !== "url" && (
              <p className="text-[13px] text-[var(--text-tertiary)]">Content captured ({content.length} characters)</p>
            )}
          </div>
        )}
        {step === 3 && (
          <div className="grid grid-cols-2 gap-3">
            {styles.map((s) => <OptionCard key={s.id} emoji={s.emoji} label={s.label} selected={explanationStyle === s.id} onClick={() => setExplanationStyle(s.id)} />)}
          </div>
        )}
        <StepNav showBack={step > 1} onBack={() => setStep(step - 1)} onNext={() => { if (step < 3) setStep(step + 1); else handleExplain(); }} nextLabel={step === 3 ? "Explain this →" : "Continue"} loading={loading} />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} error={error} toolEmoji="🎓" />
      {output && (
        <>
          <TrustIndicator level="green" message="Explanation ready" />
          <FollowUpChips chips={followUps} onChipClick={(q) => generate({ followUp: q, currentOutput: output } as never)} />
        </>
      )}
    </div>
  );

  return <ToolLayout toolName="Learn Anything" toolEmoji="🎓" toolDescription="Understand any document or topic simply" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
