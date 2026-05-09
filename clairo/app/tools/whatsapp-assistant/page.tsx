"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import OutputCard from "@/components/output/OutputCard";
import ActionChips from "@/components/output/ActionChips";
import TrustIndicator from "@/components/output/TrustIndicator";
import { useAI } from "@/hooks/useAI";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId, ActionChip } from "@/types";

type Mode = "" | "single" | "templates" | "bulk";

const modeOptions = [
  { id: "single" as const, emoji: "💬", label: "Write a single message" },
  { id: "templates" as const, emoji: "📋", label: "Create a template library" },
  { id: "bulk" as const, emoji: "🔁", label: "Bulk reply suggestions" },
];

const messageTypes = [
  { id: "reply", emoji: "💬", label: "Reply to customer" },
  { id: "price", emoji: "💰", label: "Price explanation" },
  { id: "apology", emoji: "😞", label: "Apology message" },
  { id: "festival", emoji: "🎉", label: "Festival offer" },
  { id: "order-update", emoji: "📦", label: "Order update" },
  { id: "promotion", emoji: "📣", label: "Promotion" },
  { id: "faq", emoji: "📋", label: "FAQ template" },
  { id: "follow-up", emoji: "🔁", label: "Follow-up" },
];

const tones = [
  { id: "friendly", emoji: "😊", label: "Friendly" },
  { id: "professional", emoji: "👔", label: "Professional" },
  { id: "warm", emoji: "💛", label: "Warm" },
  { id: "urgent", emoji: "⚡", label: "Urgent" },
];

const templateCategories = [
  { id: "greeting", emoji: "👋", label: "Greeting" },
  { id: "order-confirm", emoji: "✅", label: "Order confirmed" },
  { id: "shipping", emoji: "🚚", label: "Shipping update" },
  { id: "delay", emoji: "⏳", label: "Delay apology" },
  { id: "thank-you", emoji: "🙏", label: "Thank you" },
  { id: "refund", emoji: "💸", label: "Refund" },
  { id: "follow-up", emoji: "🔁", label: "Follow-up" },
  { id: "closing", emoji: "👋", label: "Closing" },
  { id: "feedback", emoji: "⭐", label: "Ask for feedback" },
  { id: "custom", emoji: "✏️", label: "Custom" },
];

const chips: ActionChip[] = [
  { label: "Add more emojis", instruction: "Add more relevant emojis." },
  { label: "Make shorter", instruction: "Make it shorter." },
  { label: "More formal", instruction: "Make it more formal." },
  { label: "Add Hindi", instruction: "Add Hindi version below." },
];

export default function WhatsAppAssistantPage() {
  const [mode, setMode] = useState<Mode>("");
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<PersonaId>("business-consultant");

  // Single message state
  const [messageType, setMessageType] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const [situation, setSituation] = useState("");
  const [tone, setTone] = useState("");

  // Template library state
  const [businessName, setBusinessName] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  // Bulk reply state
  const [bulkMessages, setBulkMessages] = useState<string[]>(["", "", ""]);

  const { output, loading, generate, refine } = useAI({ endpoint: "/api/ai/whatsapp-assistant" });
  const { addToHistory } = useHistory();

  const handleGenerate = async () => {
    let payload;
    if (mode === "single") {
      payload = { mode, messageType, customerMessage, situation, tone, language: "english" };
    } else if (mode === "templates") {
      payload = { mode, businessName, templateCategories: selectedTemplates, language: "english" };
    } else {
      payload = { mode, bulkMessages: bulkMessages.filter(Boolean), tone, language: "english" };
    }
    const result = await generate(payload);
    if (result) addToHistory({ tool_name: "whatsapp-assistant", tool_display_name: "WhatsApp Assistant", inputs: { mode, messageType, tone }, output_text: result });
  };

  const selectMode = (m: Mode) => {
    setMode(m);
    setStep(1);
  };

  const toggleTemplate = (id: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const totalSteps = mode === "single" ? 3 : 2;

  const getTitle = () => {
    if (step === 0) return "What would you like to do?";
    if (mode === "single") {
      return ["", "What do you need to send?", "Tell us more", "How should it sound?"][step];
    }
    if (mode === "templates") {
      return ["", "Your business details", "Pick template types"][step];
    }
    return ["", "Paste customer messages", "Choose reply tone"][step];
  };

  const getSubtitle = () => {
    if (step === 0) return "Choose a mode to get started.";
    if (mode === "single") {
      return ["", "Pick the type of message.", "Paste the customer's message or describe the situation.", "Choose the tone."][step];
    }
    if (mode === "templates") {
      return ["", "We'll create templates personalized to your business.", "Select 5-10 template types you'd like — we'll write them all."][step];
    }
    return ["", "Paste 3-5 customer messages and we'll suggest a reply for each.", "Pick the tone for all replies."][step];
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step || 1} totalSteps={step === 0 ? 1 : totalSteps} title={getTitle()} subtitle={getSubtitle()}>
        {/* Mode selection */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {modeOptions.map((m) => (
              <OptionCard key={m.id} emoji={m.emoji} label={m.label} selected={false} onClick={() => selectMode(m.id)} />
            ))}
          </div>
        )}

        {/* SINGLE MESSAGE MODE */}
        {mode === "single" && step === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {messageTypes.map((m) => <OptionCard key={m.id} emoji={m.emoji} label={m.label} selected={messageType === m.id} onClick={() => setMessageType(m.id)} />)}
          </div>
        )}
        {mode === "single" && step === 2 && (
          <div className="flex flex-col gap-3">
            <Textarea label="Customer's message (if replying)" placeholder="Paste the customer's message..." value={customerMessage} onChange={(e) => setCustomerMessage(e.target.value)} rows={4} />
            <Textarea label="Or describe the situation" placeholder="e.g., Customer ordered shoes but received wrong size" value={situation} onChange={(e) => setSituation(e.target.value)} rows={3} />
          </div>
        )}
        {mode === "single" && step === 3 && (
          <div className="grid grid-cols-2 gap-3">
            {tones.map((t) => <OptionCard key={t.id} emoji={t.emoji} label={t.label} selected={tone === t.id} onClick={() => setTone(t.id)} />)}
          </div>
        )}

        {/* TEMPLATE LIBRARY MODE */}
        {mode === "templates" && step === 1 && (
          <div className="flex flex-col gap-3">
            <Input label="Business name" placeholder="e.g., Sharma Electronics" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            <Input label="What you sell/offer" placeholder="e.g., Mobile accessories and repair" value={situation} onChange={(e) => setSituation(e.target.value)} />
          </div>
        )}
        {mode === "templates" && step === 2 && (
          <div className="flex flex-col gap-3">
            <p className="text-[13px] text-[var(--text-secondary)]">Selected: {selectedTemplates.length}/10</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {templateCategories.map((t) => (
                <OptionCard key={t.id} emoji={t.emoji} label={t.label} selected={selectedTemplates.includes(t.id)} onClick={() => toggleTemplate(t.id)} />
              ))}
            </div>
          </div>
        )}

        {/* BULK REPLY MODE */}
        {mode === "bulk" && step === 1 && (
          <div className="flex flex-col gap-3">
            {bulkMessages.map((msg, i) => (
              <Textarea key={i} label={`Customer message ${i + 1}`} placeholder={`Paste message ${i + 1}...`} value={msg} onChange={(e) => { const n = [...bulkMessages]; n[i] = e.target.value; setBulkMessages(n); }} rows={3} />
            ))}
            {bulkMessages.length < 5 && (
              <button onClick={() => setBulkMessages([...bulkMessages, ""])} className="text-[13px] text-[var(--accent)] hover:underline self-start">+ Add another message</button>
            )}
          </div>
        )}
        {mode === "bulk" && step === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {tones.map((t) => <OptionCard key={t.id} emoji={t.emoji} label={t.label} selected={tone === t.id} onClick={() => setTone(t.id)} />)}
          </div>
        )}

        {step > 0 && (
          <StepNav
            showBack
            onBack={() => { if (step === 1) { setStep(0); setMode(""); } else setStep(step - 1); }}
            onNext={() => { if (step < totalSteps) setStep(step + 1); else handleGenerate(); }}
            nextLabel={step === totalSteps ? (mode === "templates" ? "Create my templates →" : mode === "bulk" ? "Generate replies →" : "Write my message →") : "Continue"}
            loading={loading}
          />
        )}
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} toolEmoji="💬" />
      {output && (
        <>
          <TrustIndicator level="green" message="Ready to send" />
          <ActionChips chips={chips} onChipClick={(i) => refine(i, output)} output={output} />
        </>
      )}
    </div>
  );

  return <ToolLayout toolName="WhatsApp Assistant" toolEmoji="💬" toolDescription="Craft perfect WhatsApp messages for business" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
