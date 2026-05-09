"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  loading,
  fullWidth,
  children,
  disabled,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all rounded-[var(--radius-md)] focus-visible:outline-2 focus-visible:outline-accent select-none active:scale-[0.97]";

  const variants = {
    primary:
      "bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)] hover:shadow-accent",
    secondary:
      "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-overlay)]",
    ghost:
      "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
    danger:
      "bg-[var(--danger)] text-white hover:bg-[#a93226]",
  };

  const sizes = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-10 px-5 text-[15px]",
    lg: "h-12 px-7 text-[15px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${disabled || loading ? "opacity-50 pointer-events-none" : ""} ${className}`}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="spinner" style={{ width: 16, height: 16 }} />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
