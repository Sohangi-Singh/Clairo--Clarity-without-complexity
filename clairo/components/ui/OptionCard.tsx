"use client";

import { motion } from "framer-motion";

interface OptionCardProps {
  emoji: string;
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
}

export default function OptionCard({
  emoji,
  label,
  description,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-[var(--radius-lg)] border-2 transition-all text-center cursor-pointer ${
        selected
          ? "border-[var(--accent)] bg-[var(--accent-light)] shadow-accent"
          : "border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:shadow-sm"
      }`}
    >
      <span className="text-[32px]">{emoji}</span>
      <span className="text-[15px] font-medium text-[var(--text-primary)]">
        {label}
      </span>
      {description && (
        <span className="text-[12px] text-[var(--text-secondary)] leading-snug">
          {description}
        </span>
      )}
    </motion.button>
  );
}
