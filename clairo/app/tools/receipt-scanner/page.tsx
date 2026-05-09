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

const categories = [
  { id: "food", emoji: "🍔", label: "Food" },
  { id: "travel", emoji: "✈️", label: "Travel" },
  { id: "medical", emoji: "💊", label: "Medical" },
  { id: "utilities", emoji: "💡", label: "Utilities" },
  { id: "shopping", emoji: "🛍️", label: "Shopping" },
  { id: "business", emoji: "💼", label: "Business" },
  { id: "auto", emoji: "✨", label: "Let Clairo decide" },
];

const formats = [
  { id: "summary", emoji: "📊", label: "Summary report" },
  { id: "itemized", emoji: "📋", label: "Itemized list" },
  { id: "gst", emoji: "🧾", label: "GST-ready format" },
];

const chips: ActionChip[] = [
  { label: "More detail", instruction: "Add more detail to the breakdown." },
  { label: "Add GST", instruction: "Add GST calculation." },
  { label: "Translate to Hindi", instruction: "Translate to Hindi." },
];

export default function ReceiptScannerPage() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("office-assistant");
  const [category, setCategory] = useState("auto");
  const [outputFormat, setOutputFormat] = useState("summary");

  const { output, loading, error, generate, refine } = useAI({ endpoint: "/api/ai/receipt-scanner" });
  const { files, addFiles, removeFile } = useUpload();
  const { addToHistory } = useHistory();

  const handleScan = async () => {
    const images = files.map((f) => ({ base64: f.base64, mimeType: f.file.type }));
    const result = await generate({ images, category, outputFormat });
    if (result) addToHistory({ tool_name: "receipt-scanner", tool_display_name: "Receipt Scanner", inputs: { category, outputFormat }, output_text: result });
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step} totalSteps={3} title={
        step === 1 ? "Upload your receipts" : step === 2 ? "What are these receipts for?" : "How should we show the results?"
      } subtitle={
        step === 1 ? "Drop your receipt photos or PDFs here." : step === 2 ? "Optional — helps us categorize better." : "Choose your preferred format."
      }>
        {step === 1 && (
          <>
            <DropZone accept="image/*,.pdf" onFiles={addFiles} label="Drop your receipts here" sublabel="JPG, PNG, or PDF" />
            <FilePreview files={files} onRemove={removeFile} />
          </>
        )}
        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((c) => <OptionCard key={c.id} emoji={c.emoji} label={c.label} selected={category === c.id} onClick={() => setCategory(c.id)} />)}
          </div>
        )}
        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {formats.map((f) => <OptionCard key={f.id} emoji={f.emoji} label={f.label} selected={outputFormat === f.id} onClick={() => setOutputFormat(f.id)} />)}
          </div>
        )}
        <StepNav showBack={step > 1} onBack={() => setStep(step - 1)} onNext={() => { if (step < 3) setStep(step + 1); else handleScan(); }} nextLabel={step === 3 ? "Scan my receipts →" : "Continue"} nextDisabled={step === 1 && files.length === 0} loading={loading} />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} error={error} toolEmoji="🧾" />
      {output && (
        <>
          <TrustIndicator level="green" message="Looks complete — ready to use" />
          <ActionChips chips={chips} onChipClick={(i) => refine(i, output)} output={output} />
          <DownloadBar output={output} toolName="Receipt Report" />
        </>
      )}
    </div>
  );

  return <ToolLayout toolName="Receipt Scanner" toolEmoji="🧾" toolDescription="Scan receipts and organize your expenses" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
