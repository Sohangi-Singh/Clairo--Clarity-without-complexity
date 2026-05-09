"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "./StepIndicator";

interface WizardShellProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function WizardShell({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
}: WizardShellProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepIndicator current={currentStep} total={totalSteps} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col gap-4"
        >
          <div>
            <h2 className="text-[20px] font-medium text-[var(--text-primary)]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[14px] text-[var(--text-secondary)] mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
