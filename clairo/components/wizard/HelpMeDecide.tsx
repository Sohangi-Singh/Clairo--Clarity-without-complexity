"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface HelpMeDecideProps {
  onDecided: (value: string) => void;
  suggestions: Array<{ label: string; value: string; reason: string }>;
}

export default function HelpMeDecide({ onDecided, suggestions }: HelpMeDecideProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
      >
        <HelpCircle size={14} />
        I&apos;m not sure — help me decide
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-[var(--bg-elevated)] rounded-[var(--radius-lg)] border border-[var(--border)]">
              <p className="text-[14px] text-[var(--text-secondary)] mb-3">
                No problem! Here are our suggestions:
              </p>
              <div className="flex flex-col gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      onDecided(s.value);
                      setOpen(false);
                    }}
                    className="flex flex-col gap-0.5 p-3 bg-[var(--bg-surface)] rounded-[var(--radius-md)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-sm transition-all text-left"
                  >
                    <span className="text-[14px] font-medium text-[var(--text-primary)]">
                      {s.label}
                    </span>
                    <span className="text-[12px] text-[var(--text-tertiary)]">
                      {s.reason}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
