"use client";

import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md";
}

export default function Toggle({ checked, onChange, label, size = "md" }: ToggleProps) {
  const trackSize = size === "sm" ? "w-9 h-5" : "w-11 h-6";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 cursor-pointer"
    >
      <div
        className={`${trackSize} rounded-full flex items-center transition-colors ${
          checked ? "bg-[var(--accent)]" : "bg-[var(--bg-overlay)]"
        }`}
      >
        <motion.div
          animate={{ x: checked ? (size === "sm" ? 18 : 22) : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`${
            size === "sm" ? "w-3.5 h-3.5" : "w-[18px] h-[18px]"
          } rounded-full bg-white shadow-sm`}
        />
      </div>
      {label && (
        <span className="text-[15px] text-[var(--text-primary)]">{label}</span>
      )}
    </button>
  );
}
