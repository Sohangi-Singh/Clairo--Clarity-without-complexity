"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import HelpMeDecide from "@/components/wizard/HelpMeDecide";
import OptionCard from "@/components/ui/OptionCard";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import VoiceInput from "@/components/voice/VoiceInput";
import OutputCard from "@/components/output/OutputCard";
import ActionChips from "@/components/output/ActionChips";
import TrustIndicator from "@/components/output/TrustIndicator";
import DownloadBar from "@/components/output/DownloadBar";
import { useAI } from "@/hooks/useAI";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId, ActionChip } from "@/types";

const docTypes = [
  { id: "letter", emoji: "✉️", label: "Letter" },
  { id: "application", emoji: "📝", label: "Application" },
  { id: "agreement", emoji: "🤝", label: "Agreement" },
  { id: "notice", emoji: "📢", label: "Notice" },
  { id: "noc", emoji: "🔖", label: "NOC" },
  { id: "affidavit", emoji: "📜", label: "Affidavit" },
  { id: "rent-agreement", emoji: "🏠", label: "Rent agreement" },
  { id: "loan-request", emoji: "💰", label: "Loan request" },
  { id: "scholarship", emoji: "🎓", label: "Scholarship application" },
  { id: "medical-leave", emoji: "🏥", label: "Medical leave" },
  { id: "legal-complaint", emoji: "⚖️", label: "Legal complaint" },
  { id: "rc-insurance", emoji: "🚗", label: "RC/Insurance related" },
  { id: "delivery-complaint", emoji: "📦", label: "Delivery complaint" },
  { id: "other", emoji: "❓", label: "Something else" },
];

const tones = [
  { id: "formal", emoji: "🎩", label: "Formal" },
  { id: "friendly", emoji: "🤝", label: "Friendly" },
  { id: "firm", emoji: "✊", label: "Firm" },
  { id: "apologetic", emoji: "🙏", label: "Apologetic" },
  { id: "grateful", emoji: "💛", label: "Grateful" },
];

const defaultChips: ActionChip[] = [
  { label: "Make shorter", instruction: "Make this document shorter and more concise." },
  { label: "Make more formal", instruction: "Make the tone more formal and professional." },
  { label: "Make simpler", instruction: "Simplify the language to be easier to understand." },
  { label: "Translate to Hindi", instruction: "Translate this document to Hindi." },
  { label: "Add more detail", instruction: "Add more detail and supporting information." },
];

export default function DocumentWizardPage() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("office-assistant");
  const [documentType, setDocumentType] = useState("");
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState<string[]>([""]);
  const [tone, setTone] = useState("");
  const [language, setLanguage] = useState("english");

  const { output, loading, error, generate, refine } = useAI({ endpoint: "/api/ai/document-wizard" });
  const { addToHistory } = useHistory();

  const handleGenerate = async () => {
    const result = await generate({ documentType, recipient, purpose, points: points.filter(Boolean), tone, language, persona });
    if (result) {
      addToHistory({ tool_name: "document-wizard", tool_display_name: "Document Wizard", inputs: { documentType, recipient, purpose, tone }, output_text: result, language: language as never, persona });
    }
  };

  const totalSteps = 5;

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step} totalSteps={totalSteps} title={
        step === 1 ? "What kind of document do you need?" :
        step === 2 ? "Who is this for?" :
        step === 3 ? "What's the main purpose?" :
        step === 4 ? "Anything specific to include?" :
        "How should it sound?"
      } subtitle={
        step === 1 ? "Or describe it using your voice" :
        step === 2 ? "This could be a bank, school, or government office." :
        step === 3 ? "Tell us in your own words what this document needs to say." :
        step === 4 ? "Optional — add any key points you want mentioned." :
        "Choose the tone and language for your document."
      }>
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {docTypes.map((d) => (
                <OptionCard key={d.id} emoji={d.emoji} label={d.label} selected={documentType === d.id} onClick={() => setDocumentType(d.id)} />
              ))}
            </div>
            <div className="mt-4">
              <VoiceInput size="lg" onResult={(t) => { setDocumentType("other"); setPurpose(t); setStep(3); }} label="Or just tell us what you need 🎙️" />
            </div>
            <HelpMeDecide onDecided={setDocumentType} suggestions={[
              { label: "Letter", value: "letter", reason: "Best for formal communication to a person or organization" },
              { label: "Application", value: "application", reason: "For requesting something — leave, admission, job, etc." },
              { label: "Notice", value: "notice", reason: "For informing someone about a change or decision" },
            ]} />
          </>
        )}
        {step === 2 && (
          <>
            <Input placeholder="e.g., Bank manager, College principal, Landlord" value={recipient} onChange={(e) => setRecipient(e.target.value)} rightElement={<VoiceInput onResult={setRecipient} />} />
            <HelpMeDecide onDecided={setRecipient} suggestions={[
              { label: "A company or organization", value: "the concerned authority", reason: "When you don't know the specific person" },
              { label: "A government office", value: "the office of the concerned department", reason: "For government-related documents" },
            ]} />
          </>
        )}
        {step === 3 && (
          <Textarea placeholder="e.g., I need to inform them that I will be absent for 3 days due to a family emergency" value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={4} />
        )}
        {step === 4 && (
          <div className="flex flex-col gap-2">
            {points.map((p, i) => (
              <Input key={i} placeholder={`Point ${i + 1}`} value={p} onChange={(e) => { const next = [...points]; next[i] = e.target.value; setPoints(next); }} />
            ))}
            <button onClick={() => setPoints([...points, ""])} className="text-[13px] text-[var(--accent)] hover:underline self-start">+ Add another point</button>
          </div>
        )}
        {step === 5 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tones.map((t) => (
                <OptionCard key={t.id} emoji={t.emoji} label={t.label} selected={tone === t.id} onClick={() => setTone(t.id)} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {["english", "hindi", "hinglish"].map((l) => (
                <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 text-[13px] rounded-[var(--radius-full)] border ${language === l ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}
        <StepNav
          showBack={step > 1}
          onBack={() => setStep(step - 1)}
          onNext={() => { if (step < totalSteps) setStep(step + 1); else handleGenerate(); }}
          nextLabel={step === totalSteps ? "Create my document →" : "Continue"}
          nextDisabled={step === 1 && !documentType}
          loading={loading}
        />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} error={error} toolEmoji="📄" />
      {output && (
        <>
          <TrustIndicator level="green" message="Looks complete — ready to use" />
          <ActionChips chips={defaultChips} onChipClick={(instruction) => refine(instruction, output)} output={output} />
          <DownloadBar output={output} toolName="Document Wizard" />
        </>
      )}
    </div>
  );

  return (
    <ToolLayout
      toolName="Document Wizard"
      toolEmoji="📄"
      toolDescription="Write letters, applications, and official documents"
      persona={persona}
      onPersonaChange={setPersona}
      leftPanel={leftPanel}
      rightPanel={rightPanel}
    />
  );
}
