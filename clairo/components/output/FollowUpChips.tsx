"use client";

import { motion } from "framer-motion";

interface FollowUpChipsProps {
  chips: string[];
  onChipClick: (question: string) => void;
}

export default function FollowUpChips({ chips, onChipClick }: FollowUpChipsProps) {
  if (!chips.length) return null;

  return (
    <div className="px-5 py-3 border-t border-[var(--border)]">
      <p className="text-[12px] text-[var(--text-tertiary)] mb-2">Want to know more?</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <motion.button
            key={chip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChipClick(chip)}
            className="px-3 py-1.5 text-[12px] font-medium bg-[var(--accent-light)] text-[var(--accent-text)] rounded-[var(--radius-full)] border border-[var(--border-accent)] hover:shadow-sm transition-all"
          >
            {chip}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
