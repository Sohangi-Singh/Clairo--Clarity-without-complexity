"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import DropZone from "@/components/upload/DropZone";
import VoiceInput from "@/components/voice/VoiceInput";
import OutputCard from "@/components/output/OutputCard";
import ActionChips from "@/components/output/ActionChips";
import TrustIndicator from "@/components/output/TrustIndicator";
import DownloadBar from "@/components/output/DownloadBar";
import Button from "@/components/ui/Button";
import { useAI } from "@/hooks/useAI";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId, ActionChip } from "@/types";

type Mode = "" | "resume" | "interview";

const actions = [
  { id: "improve", emoji: "✨", label: "Improve my resume" },
  { id: "cover-letter", emoji: "📝", label: "Write a cover letter" },
  { id: "linkedin-bio", emoji: "💼", label: "LinkedIn bio" },
  { id: "tailor", emoji: "🎯", label: "Tailor for a job" },
  { id: "ats-check", emoji: "🔍", label: "ATS check" },
];

const levels = [
  { id: "entry", emoji: "🌱", label: "Entry level" },
  { id: "mid", emoji: "📈", label: "2-5 years" },
  { id: "senior", emoji: "⭐", label: "Senior" },
  { id: "career-change", emoji: "🔄", label: "Career change" },
];

const tones = [
  { id: "professional", emoji: "👔", label: "Professional" },
  { id: "creative", emoji: "🎨", label: "Creative" },
  { id: "confident", emoji: "💪", label: "Confident" },
  { id: "humble", emoji: "🤲", label: "Humble" },
];

const resumeChips: ActionChip[] = [
  { label: "More concise", instruction: "Make it more concise." },
  { label: "More achievements", instruction: "Add more quantifiable achievements." },
  { label: "Simpler language", instruction: "Use simpler language." },
];

const interviewChips: ActionChip[] = [
  { label: "Harder questions", instruction: "Generate harder, more challenging questions." },
  { label: "Behavioral questions", instruction: "Focus on behavioral/STAR questions." },
  { label: "Technical questions", instruction: "Add more technical questions." },
];

export default function ResumeAssistantPage() {
  const [mode, setMode] = useState<Mode>("");
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<PersonaId>("office-assistant");

  // Resume state
  const [resumeSource, setResumeSource] = useState<"upload" | "scratch">("upload");
  const [resumeContent, setResumeContent] = useState("");
  const [action, setAction] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [tone, setTone] = useState("");

  // Interview prep state
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const { output, loading, error, generate, refine } = useAI({ endpoint: "/api/ai/resume-assistant" });
  const { addToHistory } = useHistory();

  const selectMode = (m: Mode) => {
    setMode(m);
    setStep(1);
  };

  const handleGenerate = async () => {
    if (mode === "resume") {
      const result = await generate({ mode: "resume", action, resumeContent, targetRole, industry, experienceLevel, tone, language: "english" });
      if (result) addToHistory({ tool_name: "resume-assistant", tool_display_name: "Resume Assistant", inputs: { action, targetRole }, output_text: result });
    } else {
      const result = await generate({ mode: "interview", targetRole, industry, experienceLevel, language: "english" });
      if (result) addToHistory({ tool_name: "resume-assistant", tool_display_name: "Resume Assistant", inputs: { mode: "interview", targetRole }, output_text: result });
    }
  };

  const handlePracticeAnswer = async (question: string, answer: string) => {
    setFeedbackLoading(true);
    setAnswerFeedback("");
    try {
      const res = await fetch("/api/ai/resume-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "interview-feedback", question, answer, targetRole }),
      });
      if (res.ok) {
        const reader = res.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          let text = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            text += decoder.decode(value, { stream: true });
            setAnswerFeedback(text);
          }
        }
      }
    } catch {
      setAnswerFeedback("Could not generate feedback. Please try again.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const totalSteps = mode === "resume" ? 4 : 2;

  const getTitle = () => {
    if (step === 0) return "What would you like to do?";
    if (mode === "resume") {
      return ["", "Do you have an existing resume?", "What do you need?", "Target role details", "How should it sound?"][step];
    }
    return ["", "What role are you preparing for?", "Your experience level"][step];
  };

  const getSubtitle = () => {
    if (step === 0) return "Choose whether to work on your resume or practice for an interview.";
    if (mode === "resume") {
      return ["", "Upload it or start fresh.", "Choose what kind of help you need.", "Tell us about the role.", "Choose the tone."][step];
    }
    return ["", "We'll generate 10 likely interview questions for this role.", "This helps us tailor the difficulty."][step];
  };

  const questions = output
    ? output.split(/\d+[\.\)]\s+/).filter(Boolean).map((q) => q.trim())
    : [];

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step || 1} totalSteps={step === 0 ? 1 : totalSteps} title={getTitle()} subtitle={getSubtitle()}>
        {/* Mode selection */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OptionCard emoji="📄" label="Work on my resume" selected={false} onClick={() => selectMode("resume")} />
            <OptionCard emoji="🎤" label="Interview prep mode" selected={false} onClick={() => selectMode("interview")} />
          </div>
        )}

        {/* RESUME MODE */}
        {mode === "resume" && step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <OptionCard emoji="📎" label="Upload my resume" selected={resumeSource === "upload"} onClick={() => setResumeSource("upload")} />
              <OptionCard emoji="✏️" label="Start from scratch" selected={resumeSource === "scratch"} onClick={() => setResumeSource("scratch")} />
            </div>
            {resumeSource === "upload" && <DropZone accept=".pdf,.docx" onFiles={() => {}} label="Upload your resume" sublabel="PDF or DOCX" />}
            {resumeSource === "scratch" && <Textarea placeholder="Paste your work experience, skills, education..." value={resumeContent} onChange={(e) => setResumeContent(e.target.value)} rows={6} />}
          </div>
        )}
        {mode === "resume" && step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {actions.map((a) => <OptionCard key={a.id} emoji={a.emoji} label={a.label} selected={action === a.id} onClick={() => setAction(a.id)} />)}
          </div>
        )}
        {mode === "resume" && step === 3 && (
          <div className="flex flex-col gap-3">
            <Input label="Target role" placeholder="e.g., Marketing Manager" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            <Input label="Industry" placeholder="e.g., Technology, Healthcare" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              {levels.map((l) => <OptionCard key={l.id} emoji={l.emoji} label={l.label} selected={experienceLevel === l.id} onClick={() => setExperienceLevel(l.id)} />)}
            </div>
          </div>
        )}
        {mode === "resume" && step === 4 && (
          <div className="grid grid-cols-2 gap-3">
            {tones.map((t) => <OptionCard key={t.id} emoji={t.emoji} label={t.label} selected={tone === t.id} onClick={() => setTone(t.id)} />)}
          </div>
        )}

        {/* INTERVIEW PREP MODE */}
        {mode === "interview" && step === 1 && (
          <div className="flex flex-col gap-3">
            <Input label="Target role" placeholder="e.g., Frontend Developer, Marketing Manager" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            <Input label="Industry (optional)" placeholder="e.g., Technology, Finance" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
        )}
        {mode === "interview" && step === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {levels.map((l) => <OptionCard key={l.id} emoji={l.emoji} label={l.label} selected={experienceLevel === l.id} onClick={() => setExperienceLevel(l.id)} />)}
          </div>
        )}

        {step > 0 && (
          <StepNav
            showBack
            onBack={() => { if (step === 1) { setStep(0); setMode(""); } else setStep(step - 1); }}
            onNext={() => { if (step < totalSteps) setStep(step + 1); else handleGenerate(); }}
            nextLabel={step === totalSteps ? (mode === "interview" ? "Generate questions →" : "Create →") : "Continue"}
            loading={loading}
          />
        )}
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      {mode === "interview" && output ? (
        <div className="flex flex-col gap-3">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-xl)] p-5">
            <h3 className="text-[16px] font-medium text-[var(--text-primary)] mb-4">Interview Questions for {targetRole || "your role"}</h3>
            <div className="flex flex-col gap-2">
              {questions.map((q, i) => (
                <div key={i} className="border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden">
                  <button
                    onClick={() => { setExpandedQuestion(expandedQuestion === i ? null : i); setPracticeAnswer(""); setAnswerFeedback(""); }}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[var(--bg-surface)] transition-colors"
                  >
                    <span className="text-[var(--accent)] font-medium text-[14px] flex-shrink-0">{i + 1}.</span>
                    <span className="text-[14px] text-[var(--text-primary)]">{q}</span>
                  </button>
                  <AnimatePresence>
                    {expandedQuestion === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[var(--border)] pt-3">
                          <Textarea
                            placeholder="Type or speak your answer..."
                            value={practiceAnswer}
                            onChange={(e) => setPracticeAnswer(e.target.value)}
                            rows={4}
                          />
                          <div className="flex items-center gap-2">
                            <VoiceInput onResult={(t) => setPracticeAnswer((prev) => prev ? prev + " " + t : t)} size="sm" />
                            <Button
                              variant="primary"
                              size="sm"
                              loading={feedbackLoading}
                              disabled={!practiceAnswer.trim()}
                              onClick={() => handlePracticeAnswer(q, practiceAnswer)}
                            >
                              Get feedback
                            </Button>
                          </div>
                          {answerFeedback && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-[var(--radius-md)] p-3"
                            >
                              <p className="text-[13px] text-[var(--text-primary)] whitespace-pre-wrap">{answerFeedback}</p>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          <TrustIndicator level="green" message="Questions generated — tap any to practice" />
          <ActionChips chips={interviewChips} onChipClick={(i) => refine(i, output)} output={output} />
        </div>
      ) : (
        <div>
          <OutputCard output={output} loading={loading} error={error} toolEmoji="💼" />
          {output && (
            <>
              <TrustIndicator level="green" message="Ready to use" />
              <ActionChips chips={resumeChips} onChipClick={(i) => refine(i, output)} output={output} />
              <DownloadBar output={output} toolName="Resume" />
            </>
          )}
        </div>
      )}
    </div>
  );

  return <ToolLayout toolName="Resume Assistant" toolEmoji="💼" toolDescription="Build and improve your resume and cover letters" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
