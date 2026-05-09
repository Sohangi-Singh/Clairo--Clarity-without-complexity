"use client";

import { motion } from "framer-motion";

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
}

export default function Progress({
  value,
  max = 100,
  label,
  showPercent = false,
}: ProgressProps) {
  const percent = Math.round((value / max) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-[13px] text-[var(--text-secondary)]">{label}</span>
          )}
          {showPercent && (
            <span className="text-[13px] font-medium text-[var(--text-primary)]">
              {percent}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="h-full bg-[var(--accent)] rounded-full"
        />
      </div>
    </div>
  );
}
