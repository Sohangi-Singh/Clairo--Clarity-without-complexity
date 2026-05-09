"use client";

import { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "accent" | "success" | "warning" | "danger";
  children: ReactNode;
  className?: string;
}

const variants = {
  default: "bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
  accent: "bg-[var(--accent-light)] text-[var(--accent-text)]",
  success: "bg-[var(--success-light)] text-[var(--success)]",
  warning: "bg-[var(--warning-light)] text-[var(--warning)]",
  danger: "bg-[var(--danger-light)] text-[var(--danger)]",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-full)] text-[12px] font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
