"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import DropZone from "@/components/upload/DropZone";
import FilePreview from "@/components/upload/FilePreview";
import OutputCard from "@/components/output/OutputCard";
import ActionChips from "@/components/output/ActionChips";
import TrustIndicator from "@/components/output/TrustIndicator";
import DownloadBar from "@/components/output/DownloadBar";
import { useAI } from "@/hooks/useAI";
import { useUpload } from "@/hooks/useUpload";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId, ActionChip } from "@/types";

const reportTypes = [
  { id: "blood", emoji: "🩸", label: "Blood test" },
  { id: "scan", emoji: "📷", label: "Scan / X-Ray" },
  { id: "ecg", emoji: "❤️", label: "ECG" },
  { id: "mri", emoji: "🧠", label: "MRI / CT" },
  { id: "prescription", emoji: "💊", label: "Prescription" },
  { id: "other", emoji: "📋", label: "Other" },
];

const explanationModes = [
  { id: "simple", emoji: "🧒", label: "Very simply", description: "Plain language, no medical terms" },
  { id: "keyFindings", emoji: "📌", label: "Key findings only", description: "Just what matters, nothing extra" },
  { id: "flagAbnormal", emoji: "⚠️", label: "Flag anything abnormal", description: "Only show issues + what to do about them" },
  { id: "fullExplanation", emoji: "📖", label: "Full explanation", description: "Every value explained in detail" },
];

const actionChips: ActionChip[] = [
  { label: "⚠️ Show only abnormal values", instruction: "Rewrite this to show ONLY the abnormal values. Remove all normal values completely. For each abnormal value, explain what it means and what doctors commonly recommend." },
  { label: "💊 What do doctors prescribe for this?", instruction: "For each abnormal or borderline value in this report, explain what doctors commonly prescribe or recommend (general medicine categories and lifestyle changes). Never suggest specific dosages." },
  { label: "❓ What should I ask my doctor?", instruction: "Based on this report, generate 5 specific, practical questions I should ask my doctor at my next appointment." },
  { label: "🧒 Explain even simpler", instruction: "Rewrite this entire explanation in even simpler language — like explaining to a 10-year-old. Use short sentences, no medical terms at all." },
  { label: "🌐 Translate to Hindi", instruction: "Translate this entire explanation to Hindi. Keep the same structure and formatting." },
];

export default function MedicalSimplifierPage() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("patient-explainer");
  const [reportType, setReportType] = useState("");
  const [explanationMode, setExplanationMode] = useState("");

  const { output, loading, error, generate, refine } = useAI({ endpoint: "/api/ai/medical-simplifier" });
  const { files, addFiles, removeFile } = useUpload();
  const { addToHistory } = useHistory();

  const handleExplain = async () => {
    const images = files.map((f) => ({ base64: f.base64, mimeType: f.file.type }));
    const result = await generate({
      images,
      reportType,
      explanationMode: explanationMode || "simple",
      outputLanguage: "english",
    });
    if (result) {
      addToHistory({
        tool_name: "medical-simplifier",
        tool_display_name: "Medical Simplifier",
        inputs: { reportType, explanationMode },
        output_text: result,
      });
    }
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell
        currentStep={step}
        totalSteps={3}
        title={
          step === 1
            ? "Upload your medical report"
            : step === 2
            ? "What type of report is this?"
            : "How do you want this explained?"
        }
        subtitle={
          step === 1
            ? "We'll read it and explain it in simple words."
            : step === 2
            ? "This helps us explain it better."
            : "Each option gives a completely different output."
        }
      >
        {step === 1 && (
          <>
            <DropZone
              accept="image/*,.pdf"
              onFiles={addFiles}
              label="Upload your medical report"
              sublabel="Photo or PDF of your report"
            />
            <FilePreview files={files} onRemove={removeFile} />
          </>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reportTypes.map((r) => (
              <OptionCard
                key={r.id}
                emoji={r.emoji}
                label={r.label}
                selected={reportType === r.id}
                onClick={() => setReportType(r.id)}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-3">
            {explanationModes.map((m) => (
              <OptionCard
                key={m.id}
                emoji={m.emoji}
                label={m.label}
                description={m.description}
                selected={explanationMode === m.id}
                onClick={() => setExplanationMode(m.id)}
              />
            ))}
          </div>
        )}

        <StepNav
          showBack={step > 1}
          onBack={() => setStep(step - 1)}
          onNext={() => {
            if (step < 3) setStep(step + 1);
            else handleExplain();
          }}
          nextLabel={step === 3 ? "Explain my report →" : "Continue"}
          nextDisabled={
            (step === 1 && files.length === 0) ||
            (step === 2 && !reportType) ||
            (step === 3 && !explanationMode)
          }
          loading={loading}
        />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} error={error} toolEmoji="🏥" />
      {output && (
        <>
          <TrustIndicator
            level="yellow"
            message="This is for understanding only"
            disclaimer="Always consult your doctor for medical advice."
          />
          <ActionChips
            chips={actionChips}
            onChipClick={(instruction) => refine(instruction, output)}
            output={output}
          />
          <DownloadBar output={output} toolName="Medical Report" />
        </>
      )}
    </div>
  );

  return (
    <ToolLayout
      toolName="Medical Simplifier"
      toolEmoji="🏥"
      toolDescription="Understand your medical reports in plain language"
      persona={persona}
      onPersonaChange={setPersona}
      leftPanel={leftPanel}
      rightPanel={rightPanel}
    />
  );
}
