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
import DownloadBar from "@/components/output/DownloadBar";
import { useAI } from "@/hooks/useAI";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId, ActionChip } from "@/types";

const contentTypes = [
  { id: "invoice", emoji: "🧾", label: "Invoice" },
  { id: "whatsapp-post", emoji: "💬", label: "WhatsApp post" },
  { id: "product-description", emoji: "📝", label: "Product description" },
  { id: "price-list", emoji: "🏷️", label: "Price list" },
  { id: "festival-offer", emoji: "🎉", label: "Festival offer" },
  { id: "announcement", emoji: "📢", label: "Announcement" },
  { id: "instagram-caption", emoji: "📱", label: "Instagram caption" },
  { id: "review-reply", emoji: "⭐", label: "Review reply" },
  { id: "business-report", emoji: "📊", label: "Simple business report" },
];

const chips: ActionChip[] = [
  { label: "Add emojis", instruction: "Add more relevant emojis." },
  { label: "Make festive", instruction: "Make it more festive and celebratory." },
  { label: "Shorten", instruction: "Make it shorter." },
  { label: "Translate to Hindi", instruction: "Translate to Hindi." },
  { label: "More professional", instruction: "Make it more professional." },
];

export default function BusinessHelperPage() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaId>("business-consultant");
  const [contentType, setContentType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [productService, setProductService] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [extras, setExtras] = useState("");
  const [platform, setPlatform] = useState("whatsapp");

  // Review reply state
  const [customerReview, setCustomerReview] = useState("");

  // Business report state
  const [reportData, setReportData] = useState("");

  const { output, loading, error, generate, refine } = useAI({ endpoint: "/api/ai/business-helper" });
  const { addToHistory } = useHistory();

  const handleGenerate = async () => {
    const result = await generate({
      contentType,
      businessName,
      productService,
      price,
      offer,
      extras,
      platform,
      customerReview,
      reportData,
      language: "english",
    });
    if (result) addToHistory({ tool_name: "business-helper", tool_display_name: "Business Helper", inputs: { contentType, businessName }, output_text: result });
  };

  const isSpecialMode = contentType === "review-reply" || contentType === "business-report";
  const totalSteps = isSpecialMode ? 2 : 3;

  const getTitle = () => {
    if (step === 1) return "What do you need?";
    if (contentType === "review-reply") return "Paste the customer review";
    if (contentType === "business-report") return "Enter your numbers";
    if (step === 2) return "Tell us about your business";
    return "Where will this be shared?";
  };

  const getSubtitle = () => {
    if (step === 1) return "Pick the type of content you need.";
    if (contentType === "review-reply") return "We'll write a professional, thoughtful response.";
    if (contentType === "business-report") return "Enter weekly sales, expenses, or any numbers — we'll summarize them.";
    if (step === 2) return "Fill in the details for your content.";
    return "Choose the platform.";
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step} totalSteps={totalSteps} title={getTitle()} subtitle={getSubtitle()}>
        {step === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {contentTypes.map((c) => <OptionCard key={c.id} emoji={c.emoji} label={c.label} selected={contentType === c.id} onClick={() => setContentType(c.id)} />)}
          </div>
        )}

        {/* Review reply mode */}
        {step === 2 && contentType === "review-reply" && (
          <div className="flex flex-col gap-3">
            <Input label="Business name" placeholder="e.g., Sharma Electronics" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            <Textarea label="Customer review" placeholder="Paste the customer's review here..." value={customerReview} onChange={(e) => setCustomerReview(e.target.value)} rows={5} />
          </div>
        )}

        {/* Business report mode */}
        {step === 2 && contentType === "business-report" && (
          <div className="flex flex-col gap-3">
            <Input label="Business name" placeholder="e.g., Sharma Electronics" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            <Textarea
              label="Sales / expense data"
              placeholder={"e.g.,\nMonday: ₹5,000 sales, ₹1,200 expenses\nTuesday: ₹7,500 sales, ₹900 expenses\nWednesday: ₹3,200 sales, ₹1,500 expenses"}
              value={reportData}
              onChange={(e) => setReportData(e.target.value)}
              rows={7}
              helperText="Enter numbers in any format — we'll make sense of them"
            />
          </div>
        )}

        {/* Standard flow step 2 */}
        {step === 2 && !isSpecialMode && (
          <div className="flex flex-col gap-3">
            <Input label="Business name" placeholder="e.g., Sharma Electronics" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            <Input label="Product or service" placeholder="e.g., Mobile phone repair" value={productService} onChange={(e) => setProductService(e.target.value)} />
            <Input label="Price (optional)" placeholder="e.g., ₹500" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Input label="Current offer (optional)" placeholder="e.g., 20% off this week" value={offer} onChange={(e) => setOffer(e.target.value)} />
            <Textarea label="Any extras?" placeholder="Additional details..." value={extras} onChange={(e) => setExtras(e.target.value)} rows={2} />
          </div>
        )}

        {/* Standard flow step 3 — platform */}
        {step === 3 && !isSpecialMode && (
          <div className="grid grid-cols-3 gap-3">
            <OptionCard emoji="💬" label="WhatsApp" selected={platform === "whatsapp"} onClick={() => setPlatform("whatsapp")} />
            <OptionCard emoji="📸" label="Instagram" selected={platform === "instagram"} onClick={() => setPlatform("instagram")} />
            <OptionCard emoji="🌐" label="Both" selected={platform === "both"} onClick={() => setPlatform("both")} />
          </div>
        )}

        <StepNav showBack={step > 1} onBack={() => setStep(step - 1)} onNext={() => { if (step < totalSteps) setStep(step + 1); else handleGenerate(); }} nextLabel={step === totalSteps ? "Create my content →" : "Continue"} loading={loading} />
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} error={error} toolEmoji="🏪" />
      {output && (
        <>
          <TrustIndicator level="green" message="Ready to share" />
          <ActionChips chips={chips} onChipClick={(i) => refine(i, output)} output={output} />
          <DownloadBar output={output} toolName="Business Content" />
        </>
      )}
    </div>
  );

  return <ToolLayout toolName="Business Helper" toolEmoji="🏪" toolDescription="Create invoices, posts, and business content" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
