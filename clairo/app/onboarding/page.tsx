"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OptionCard from "@/components/ui/OptionCard";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { LANGUAGES } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

const userTypes = [
  { id: "personal", emoji: "👤", label: "Just me" },
  { id: "family", emoji: "👨‍👩‍👧", label: "My family" },
  { id: "business", emoji: "🏪", label: "My small business" },
  { id: "student", emoji: "🎓", label: "My studies" },
  { id: "elderly", emoji: "👴", label: "Someone older in my family" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [language, setLanguage] = useState("english");

  const handleFinish = () => {
    localStorage.setItem("clairo-onboarding", "complete");
    localStorage.setItem("clairo-user-type", userType);
    localStorage.setItem("clairo-language", language);
    if (userType === "elderly" || userType === "family") {
      localStorage.setItem("clairo-family-mode", "true");
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...fadeUp} className="text-center flex flex-col items-center gap-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="logo-wordmark font-display text-[48px] font-semibold">
                  <span className="text-[var(--text-primary)]">Cl</span>
                  <span className="text-[var(--accent)]">ai</span>
                  <span className="text-[var(--text-primary)]">ro</span>
                </span>
              </motion.div>
              <h1 className="font-display text-[36px] md:text-[48px] font-semibold text-[var(--text-primary)]">
                Welcome to Clairo.
              </h1>
              <p className="text-[17px] text-[var(--text-secondary)] max-w-md">
                We help normal people do things that used to require an expert. No confusing steps. No technical knowledge.
              </p>
              <Button size="lg" onClick={() => setStep(2)}>
                Let&apos;s get started <ArrowRight size={16} />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...fadeUp} className="flex flex-col gap-6">
              <h2 className="font-display text-[28px] font-semibold text-[var(--text-primary)] text-center">
                Who will be using Clairo?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {userTypes.map((t) => (
                  <OptionCard
                    key={t.id}
                    emoji={t.emoji}
                    label={t.label}
                    selected={userType === t.id}
                    onClick={() => setUserType(t.id)}
                  />
                ))}
              </div>
              {(userType === "elderly" || userType === "family") && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-[var(--accent-light)] rounded-[var(--radius-lg)] border border-[var(--border-accent)]">
                  <p className="text-[14px] text-[var(--accent-text)]">
                    👨‍👩‍👧 We&apos;ll enable Family Mode for a simpler experience — bigger buttons, larger text, and voice-first interactions.
                  </p>
                </motion.div>
              )}
              <Button size="lg" onClick={() => setStep(3)} disabled={!userType}>
                Continue <ArrowRight size={16} />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...fadeUp} className="flex flex-col gap-6">
              <h2 className="font-display text-[28px] font-semibold text-[var(--text-primary)] text-center">
                Which language do you prefer?
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`px-4 py-2.5 text-[14px] font-medium rounded-[var(--radius-full)] border transition-all ${
                      language === lang.id
                        ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-accent"
                        : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <p className="text-[13px] text-[var(--text-tertiary)] text-center">
                You can change this anytime in settings.
              </p>
              <Button size="lg" onClick={handleFinish}>
                Take me to Clairo <ArrowRight size={16} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
