"use client";

import { motion } from "framer-motion";
import { Copy, Download } from "lucide-react";
import type { ActionChip } from "@/types";

interface ActionChipsProps {
  chips: ActionChip[];
  onChipClick: (instruction: string) => void;
  onCopy?: () => void;
  onDownload?: () => void;
  output: string;
}

export default function ActionChips({
  chips,
  onChipClick,
  onCopy,
  onDownload,
  output,
}: ActionChipsProps) {
  if (!output) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    onCopy?.();
  };

  return (
    <div className="flex flex-wrap gap-2 px-5 py-3 border-t border-[var(--border)]">
      {chips.map((chip) => (
        <motion.button
          key={chip.label}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChipClick(chip.instruction)}
          className="px-3 py-1.5 text-[12px] font-medium bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-[var(--radius-full)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent-text)] hover:bg-[var(--accent-light)] transition-all"
        >
          {chip.label}
        </motion.button>
      ))}
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 text-[12px] font-medium bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-[var(--radius-full)] border border-[var(--border)] hover:border-[var(--accent)] transition-all flex items-center gap-1"
      >
        <Copy size={12} />
        Copy
      </button>
      {onDownload && (
        <button
          onClick={onDownload}
          className="px-3 py-1.5 text-[12px] font-medium bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-[var(--radius-full)] border border-[var(--border)] hover:border-[var(--accent)] transition-all flex items-center gap-1"
        >
          <Download size={12} />
          Download
        </button>
      )}
    </div>
  );
}
