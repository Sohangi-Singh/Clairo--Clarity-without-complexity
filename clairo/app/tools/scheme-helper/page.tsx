"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import Select from "@/components/ui/Select";
import DropZone from "@/components/upload/DropZone";
import OutputCard from "@/components/output/OutputCard";
import TrustIndicator from "@/components/output/TrustIndicator";
import DownloadBar from "@/components/output/DownloadBar";
import { useAI } from "@/hooks/useAI";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId } from "@/types";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
].map((s) => ({ value: s.toLowerCase().replace(/\s+/g, "-"), label: s }));

const categories = [
  { id: "farmer", emoji: "👨‍🌾", label: "Farmer" },
  { id: "women", emoji: "👩", label: "Women" },
  { id: "senior", emoji: "🧓", label: "Senior citizen" },
  { id: "student", emoji: "🎓", label: "Student" },
  { id: "job-seeker", emoji: "💼", label: "Job seeker" },
  { id: "bpl", emoji: "🏠", label: "Below poverty line" },
  { id: "small-business", emoji: "🏗️", label: "Small business" },
  { id: "new-parent", emoji: "👶", label: "New parent" },
];

export default function SchemeHelperPage() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("government-expert");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");

  const { output, loading, error, generate } = useAI({ endpoint: "/api/ai/scheme-helper" });
  const { addToHistory } = useHistory();

  const handleFind = async () => {
    const result = await generate({ state, category, language: "english" });
    if (result) addToHistory({ tool_name: "scheme-helper", tool_display_name: "Government Schemes", inputs: { state, category }, output_text: result });
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step} totalSteps={3} title={
        step === 1 ? "Which state are you in?" : step === 2 ? "Tell us about yourself" : "Upload any ID (optional)"
      } subtitle={
        step === 1 ? "This helps us find state-specific schemes." : step === 2 ? "This helps us find schemes you may qualify for." : "Upload any ID or document to help us find more schemes."
      }>
        {step === 1 && <Select options={[{ value: "", label: "Select your state" }, ...states]} value={state} onChange={(e) => setState(e.target.value)} />}
        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((c) => <OptionCard key={c.id} emoji={c.emoji} label={c.label} selected={category === c.id} onClick={() => setCategory(c.id)} />)}
          </div>
        )}
        {step === 3 && <DropZone accept="image/*,.pdf" onFiles={() => {}} label="Upload any ID document (optional)" sublabel="Aadhaar, income certificate, ration card, etc." />}
        <StepNav showBack={step > 1} onBack={() => setStep(step - 1)} onNext={() => { if (step < 3) setStep(step + 1); else handleFind(); }} nextLabel={step === 3 ? "Find schemes for me →" : "Continue"} loading={loading} />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} error={error} toolEmoji="🏛️" />
      {output && (
        <>
          <TrustIndicator level="yellow" message="Recommended to verify eligibility" disclaimer="Always verify at the official government portal before applying." />
          <DownloadBar output={output} toolName="Government Schemes" />
        </>
      )}
    </div>
  );

  return <ToolLayout toolName="Government Schemes" toolEmoji="🏛️" toolDescription="Find government schemes you qualify for" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
