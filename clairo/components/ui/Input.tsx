"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, icon, rightElement, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full h-10 px-3 ${icon ? "pl-10" : ""} ${
              rightElement ? "pr-10" : ""
            } bg-[var(--bg-surface)] border ${
              error ? "border-[var(--danger)]" : "border-[var(--border)]"
            } rounded-[var(--radius-md)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors ${className}`}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </span>
          )}
        </div>
        {helperText && !error && (
          <span className="text-[12px] text-[var(--text-tertiary)]">{helperText}</span>
        )}
        {error && (
          <span className="text-[12px] text-[var(--danger)]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
