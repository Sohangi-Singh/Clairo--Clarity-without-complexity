"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import WizardShell from "@/components/wizard/WizardShell";
import StepNav from "@/components/wizard/StepNav";
import OptionCard from "@/components/ui/OptionCard";
import Input from "@/components/ui/Input";
import OutputCard from "@/components/output/OutputCard";
import ActionChips from "@/components/output/ActionChips";
import TrustIndicator from "@/components/output/TrustIndicator";
import DownloadBar from "@/components/output/DownloadBar";
import { useAI } from "@/hooks/useAI";
import { useHistory } from "@/hooks/useHistory";
import type { PersonaId, ActionChip } from "@/types";

type Mode = "" | "general" | "exam";

const scheduleTypes = [
  { id: "daily", emoji: "☀️", label: "Daily" },
  { id: "weekly", emoji: "📅", label: "Weekly" },
  { id: "work-shifts", emoji: "🏢", label: "Work shifts" },
  { id: "study-plan", emoji: "📚", label: "Study plan" },
  { id: "event", emoji: "🎉", label: "Event planning" },
];

const priorities = [
  { id: "work-first", emoji: "💼", label: "Work first" },
  { id: "balanced", emoji: "⚖️", label: "Balanced" },
  { id: "personal-first", emoji: "🏠", label: "Personal first" },
];

const breakStyles = [
  { id: "frequent-short", emoji: "⏱️", label: "Frequent short" },
  { id: "few-long", emoji: "🛋️", label: "Few long" },
  { id: "no-preference", emoji: "✨", label: "No preference" },
];

const generalChips: ActionChip[] = [
  { label: "Add more breaks", instruction: "Add more break time." },
  { label: "Tighter schedule", instruction: "Make the schedule more compact." },
  { label: "Add exercise", instruction: "Include exercise time." },
];

const examChips: ActionChip[] = [
  { label: "More revision days", instruction: "Add more revision and review days." },
  { label: "Add breaks", instruction: "Add more break time between study sessions." },
  { label: "Focus on weak subjects", instruction: "Allocate more time to the harder subjects." },
  { label: "Add practice tests", instruction: "Include time for practice tests and mock exams." },
];

export default function ScheduleMakerPage() {
  const [mode, setMode] = useState<Mode>("");
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<PersonaId>("office-assistant");

  // General schedule state
  const [type, setType] = useState("");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [commitments, setCommitments] = useState<string[]>([""]);
  const [priority, setPriority] = useState("");
  const [breakStyle, setBreakStyle] = useState("");

  // Exam planner state
  const [examDate, setExamDate] = useState("");
  const [subjects, setSubjects] = useState<string[]>(["", ""]);
  const [hoursPerDay, setHoursPerDay] = useState("6");

  const { output, loading, generate, refine } = useAI({ endpoint: "/api/ai/schedule-maker" });
  const { addToHistory } = useHistory();

  const selectMode = (m: Mode) => {
    setMode(m);
    setStep(1);
  };

  const handleGenerate = async () => {
    let payload;
    if (mode === "general") {
      payload = { mode: "general", type, wakeTime, sleepTime, commitments: commitments.filter(Boolean), priority, breakStyle, language: "english" };
    } else {
      payload = { mode: "exam", examDate, subjects: subjects.filter(Boolean), hoursPerDay, language: "english" };
    }
    const result = await generate(payload);
    if (result) addToHistory({ tool_name: "schedule-maker", tool_display_name: "Schedule Maker", inputs: { mode, type: mode === "exam" ? "exam" : type }, output_text: result });
  };

  const totalSteps = mode === "general" ? 3 : 2;

  const getTitle = () => {
    if (step === 0) return "What kind of schedule?";
    if (mode === "general") {
      return ["", "Pick the schedule type", "Your time constraints", "Break preferences"][step];
    }
    return ["", "Exam details", "Study hours"][step];
  };

  const getSubtitle = () => {
    if (step === 0) return "Choose a general schedule or an exam-specific study planner.";
    if (mode === "general") {
      return ["", "Choose the type of schedule you need.", "Tell us your available hours and commitments.", "How do you like to take breaks?"][step];
    }
    return ["", "Tell us when your exam is and what subjects you need to cover.", "We'll create a day-by-day study plan with revision days built in."][step];
  };

  const leftPanel = (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
      <WizardShell currentStep={step || 1} totalSteps={step === 0 ? 1 : totalSteps} title={getTitle()} subtitle={getSubtitle()}>
        {/* Mode selection */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OptionCard emoji="📅" label="General schedule" selected={false} onClick={() => selectMode("general")} />
            <OptionCard emoji="📚" label="Exam study planner" selected={false} onClick={() => selectMode("exam")} />
          </div>
        )}

        {/* GENERAL MODE */}
        {mode === "general" && step === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {scheduleTypes.map((s) => <OptionCard key={s.id} emoji={s.emoji} label={s.label} selected={type === s.id} onClick={() => setType(s.id)} />)}
          </div>
        )}
        {mode === "general" && step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Wake time" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
              <Input label="Sleep time" type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-medium">Fixed commitments</span>
              {commitments.map((c, i) => (
                <Input key={i} placeholder="e.g., Work 9-5, Gym 6 PM" value={c} onChange={(e) => { const n = [...commitments]; n[i] = e.target.value; setCommitments(n); }} />
              ))}
              <button onClick={() => setCommitments([...commitments, ""])} className="text-[13px] text-[var(--accent)] hover:underline self-start">+ Add another</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {priorities.map((p) => <OptionCard key={p.id} emoji={p.emoji} label={p.label} selected={priority === p.id} onClick={() => setPriority(p.id)} />)}
            </div>
          </div>
        )}
        {mode === "general" && step === 3 && (
          <div className="grid grid-cols-3 gap-3">
            {breakStyles.map((b) => <OptionCard key={b.id} emoji={b.emoji} label={b.label} selected={breakStyle === b.id} onClick={() => setBreakStyle(b.id)} />)}
          </div>
        )}

        {/* EXAM PLANNER MODE */}
        {mode === "exam" && step === 1 && (
          <div className="flex flex-col gap-4">
            <Input label="Exam date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-medium">Subjects to cover</span>
              {subjects.map((s, i) => (
                <Input key={i} placeholder={`Subject ${i + 1}`} value={s} onChange={(e) => { const n = [...subjects]; n[i] = e.target.value; setSubjects(n); }} />
              ))}
              <button onClick={() => setSubjects([...subjects, ""])} className="text-[13px] text-[var(--accent)] hover:underline self-start">+ Add another subject</button>
            </div>
          </div>
        )}
        {mode === "exam" && step === 2 && (
          <div className="flex flex-col gap-4">
            <Input label="Hours available per day" type="number" placeholder="e.g., 6" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Wake time" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
              <Input label="Sleep time" type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
            </div>
          </div>
        )}

        {step > 0 && (
          <StepNav
            showBack
            onBack={() => { if (step === 1) { setStep(0); setMode(""); } else setStep(step - 1); }}
            onNext={() => { if (step < totalSteps) setStep(step + 1); else handleGenerate(); }}
            nextLabel={step === totalSteps ? (mode === "exam" ? "Create study plan →" : "Create my schedule →") : "Continue"}
            loading={loading}
          />
        )}
      </WizardShell>
    </div>
  );

  const rightPanel = (
    <div>
      <OutputCard output={output} loading={loading} toolEmoji="📅" />
      {output && (
        <>
          <TrustIndicator level="green" message={mode === "exam" ? "Your study plan is ready" : "Your schedule is ready"} />
          <ActionChips chips={mode === "exam" ? examChips : generalChips} onChipClick={(i) => refine(i, output)} output={output} />
          <DownloadBar output={output} toolName={mode === "exam" ? "Study Plan" : "Schedule"} />
        </>
      )}
    </div>
  );

  return <ToolLayout toolName="Schedule Maker" toolEmoji="📅" toolDescription="Plan your day, week, or study schedule" persona={persona} onPersonaChange={setPersona} leftPanel={leftPanel} rightPanel={rightPanel} />;
}
