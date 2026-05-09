"use client";

import type { TrustLevel } from "@/types";
import { CheckCircle, AlertTriangle, ClipboardList, AlertCircle } from "lucide-react";

interface TrustIndicatorProps {
  level: TrustLevel;
  message: string;
  disclaimer?: string;
}

const config = {
  green: {
    icon: <CheckCircle size={16} />,
    bg: "bg-[var(--success-light)]",
    text: "text-[var(--success)]",
    border: "border-[var(--success)]",
  },
  yellow: {
    icon: <AlertTriangle size={16} />,
    bg: "bg-[var(--warning-light)]",
    text: "text-[var(--warning)]",
    border: "border-[var(--warning)]",
  },
  orange: {
    icon: <ClipboardList size={16} />,
    bg: "bg-[var(--warning-light)]",
    text: "text-[var(--warning)]",
    border: "border-[var(--warning)]",
  },
  red: {
    icon: <AlertCircle size={16} />,
    bg: "bg-[var(--danger-light)]",
    text: "text-[var(--danger)]",
    border: "border-[var(--danger)]",
  },
};

export default function TrustIndicator({
  level,
  message,
  disclaimer,
}: TrustIndicatorProps) {
  const c = config[level];

  return (
    <div className={`mx-5 mb-3 p-3 rounded-[var(--radius-md)] ${c.bg} border ${c.border} border-opacity-20`}>
      <div className={`flex items-center gap-2 ${c.text}`}>
        {c.icon}
        <span className="text-[13px] font-medium">{message}</span>
      </div>
      {disclaimer && (
        <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5 ml-6">
          {disclaimer}
        </p>
      )}
    </div>
  );
}
