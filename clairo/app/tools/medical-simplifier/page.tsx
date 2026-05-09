"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import DropZone from "@/components/upload/DropZone";
import FilePreview from "@/components/upload/FilePreview";
import OutputCard from "@/components/output/OutputCard";
import TrustIndicator from "@/components/output/TrustIndicator";
import FollowUpChips from "@/components/output/FollowUpChips";
import { useAI } from "@/hooks/useAI";
import { useUpload } from "@/hooks/useUpload";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId } from "@/types";

const reportTypes = [
  { id: "blood", emoji: "🩸", label: "Blood test" },
  { id: "scan", emoji: "📷", label: "Scan / X-Ray" },
  { id: "ecg", emoji: "❤️", label: "ECG" },
  { id: "mri", emoji: "🧠", label: "MRI / CT" },
  { id: "prescription", emoji: "💊", label: "Prescription" },
  { id: "other", emoji: "📋", label: "Other" },
];

const styles = [
  { id: "simple", emoji: "🧒", label: "Very simply" },
  { id: "key-findings", emoji: "📌", label: "Key findings only" },
  { id: "flag-abnormal", emoji: "⚠️", label: "Flag anything abnormal" },
  { id: "full", emoji: "📖", label: "Full explanation" },
];

const followUps = [
  "What does this mean for me?",
  "Is this urgent?",
  "What should I ask my doctor?",
  "What if I ignore this?",
  "Explain even simpler",
];

export default function MedicalSimplifierPage() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("patient-explainer");
  const [reportType, setReportType] = useState("");
  const [explanationStyle, setExplanationStyle] = useState("");

  const { output, loading, error, generate } = useAI({ endpoint: "/api/ai/medical-simplifier" });
  const { files, addFiles, removeFile } = useUpload();
  const { addToHistory } = useHistory();

  const handleExplain = async () => {
    const images = files.map((f) => ({ base64: f.base64, mimeType: f.file.type }));
    const result = await generate({ images, reportType, explanationStyle, language: "english" });
    if (result) addToHistory({ tool_name: "medical-simplifier", tool_display_name: "Medical Simplifier", inputs: { reportType, explanationStyle }, output_text: result });
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step} totalSteps={3} title={
        step === 1 ? "Upload your medical report" : step === 2 ? "What type of report is this?" : "How do you want this explained?"
      } subtitle={
        step === 1 ? "We'll read it and explain it in simple words." : step === 2 ? "This helps us explain it better." : "Choose how detailed you want the explanation."
      }>
        {step === 1 && (
          <>
            <DropZone accept="image/*,.pdf" onFiles={addFiles} label="Upload your medical report" sublabel="Photo or PDF of your report" />
            <FilePreview files={files} onRemove={removeFile} />
          </>
        )}
        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reportTypes.map((r) => <OptionCard key={r.id} emoji={r.emoji} label={r.label} selected={reportType === r.id} onClick={() => setReportType(r.id)} />)}
          </div>
        )}
        {step === 3 && (
          <div className="grid grid-cols-2 gap-3">
            {styles.map((s) => <OptionCard key={s.id} emoji={s.emoji} label={s.label} selected={explanationStyle === s.id} onClick={() => setExplanationStyle(s.id)} />)}
          </div>
        )}
        <StepNav showBack={step > 1} onBack={() => setStep(step - 1)} onNext={() => { if (step < 3) setStep(step + 1); else handleExplain(); }} nextLabel={step === 3 ? "Explain my report →" : "Continue"} nextDisabled={step === 1 && files.length === 0} loading={loading} />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} error={error} toolEmoji="🏥" />
      {output && (
        <>
          <TrustIndicator level="yellow" message="This is for understanding only" disclaimer="Always consult your doctor for medical advice." />
          <FollowUpChips chips={followUps} onChipClick={(q) => generate({ followUp: q, currentOutput: output } as never)} />
        </>
      )}
    </div>
  );

  return <ToolLayout toolName="Medical Simplifier" toolEmoji="🏥" toolDescription="Understand your medical reports in plain language" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
