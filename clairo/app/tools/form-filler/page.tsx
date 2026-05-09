"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import DropZone from "@/components/upload/DropZone";
import FilePreview from "@/components/upload/FilePreview";
import OutputCard from "@/components/output/OutputCard";
import TrustIndicator from "@/components/output/TrustIndicator";
import DownloadBar from "@/components/output/DownloadBar";
import { useAI } from "@/hooks/useAI";
import { useUpload } from "@/hooks/useUpload";
import type { PersonaId } from "@/types";

export default function FormFillerPage() {
  const [step] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("patient-explainer");
  const { output, loading, generate } = useAI({ endpoint: "/api/ai/form-filler" });
  const { files, addFiles, removeFile } = useUpload();

  const handleAnalyze = async () => {
    const images = files.map((f) => ({ base64: f.base64, mimeType: f.file.type }));
    await generate({ images });
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step} totalSteps={1} title="Upload the blank form" subtitle="We'll read it and ask you simple questions to fill it out.">
        <DropZone accept="image/*,.pdf" onFiles={addFiles} label="Upload your form (PDF or photo)" sublabel="Aadhaar, PAN, insurance, bank, government forms" />
        <FilePreview files={files} onRemove={removeFile} />
        <StepNav showBack={false} onNext={handleAnalyze} nextLabel="Read my form →" nextDisabled={files.length === 0} loading={loading} />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} toolEmoji="📋" />
      {output && (
        <>
          <TrustIndicator level="yellow" message="Review all answers before submitting the form" disclaimer="Double-check dates and numbers carefully." />
          <DownloadBar output={output} toolName="Filled Form" />
        </>
      )}
    </div>
  );

  return <ToolLayout toolName="Form Filler" toolEmoji="📋" toolDescription="Fill out official forms without the confusion" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
