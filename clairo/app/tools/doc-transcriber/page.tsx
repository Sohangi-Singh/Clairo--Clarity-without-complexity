"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import Toggle from "@/components/ui/Toggle";
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

const docTypes = [
  { id: "legal", emoji: "⚖️", label: "Legal" },
  { id: "medical", emoji: "🏥", label: "Medical" },
  { id: "financial", emoji: "💰", label: "Financial" },
  { id: "government", emoji: "🏛️", label: "Government" },
  { id: "academic", emoji: "🎓", label: "Academic" },
  { id: "other", emoji: "📄", label: "Other" },
];

const chips: ActionChip[] = [
  { label: "Clean formatting", instruction: "Clean up the formatting." },
  { label: "Add line numbers", instruction: "Add line numbers." },
  { label: "Mark sections", instruction: "Add section headers for clarity." },
];

export default function DocTranscriberPage() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("office-assistant");
  const [documentType, setDocumentType] = useState("");
  const [flagUncertain, setFlagUncertain] = useState(true);
  const [preserveLineBreaks, setPreserveLineBreaks] = useState(true);

  const { output, loading, error, generate, refine } = useAI({ endpoint: "/api/ai/doc-transcriber" });
  const { files, addFiles, removeFile } = useUpload();
  const { addToHistory } = useHistory();

  const handleTranscribe = async () => {
    const images = files.map((f) => ({ base64: f.base64, mimeType: f.file.type }));
    const result = await generate({ images, documentType, flagUncertain, preserveLineBreaks });
    if (result) addToHistory({ tool_name: "doc-transcriber", tool_display_name: "Doc Transcriber", inputs: { documentType }, output_text: result });
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step} totalSteps={3} title={
        step === 1 ? "Upload your document" : step === 2 ? "What type of document is this?" : "Accuracy preferences"
      } subtitle={
        step === 1 ? "We'll convert it to editable text with high accuracy." : step === 2 ? "This helps us transcribe more accurately." : "Fine-tune how we handle the transcription."
      }>
        {step === 1 && (
          <>
            <DropZone accept="image/*,.pdf" onFiles={addFiles} label="Drop document images here" sublabel="JPG, JPEG, or PDF — multi-page supported" />
            <FilePreview files={files} onRemove={removeFile} />
          </>
        )}
        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {docTypes.map((d) => <OptionCard key={d.id} emoji={d.emoji} label={d.label} selected={documentType === d.id} onClick={() => setDocumentType(d.id)} />)}
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <Toggle checked={flagUncertain} onChange={setFlagUncertain} label="Flag uncertain words with [?]" />
            <Toggle checked={preserveLineBreaks} onChange={setPreserveLineBreaks} label="Preserve original line breaks" />
          </div>
        )}
        <StepNav showBack={step > 1} onBack={() => setStep(step - 1)} onNext={() => { if (step < 3) setStep(step + 1); else handleTranscribe(); }} nextLabel={step === 3 ? "Transcribe this document →" : "Continue"} nextDisabled={step === 1 && files.length === 0} loading={loading} />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} error={error} toolEmoji="📑" />
      {output && (
        <>
          <TrustIndicator level="green" message="High accuracy transcription complete" />
          <ActionChips chips={chips} onChipClick={(i) => refine(i, output)} output={output} />
          <DownloadBar output={output} toolName="Transcription" />
        </>
      )}
    </div>
  );

  return <ToolLayout toolName="Doc Transcriber" toolEmoji="📑" toolDescription="Turn paper documents into editable text" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
