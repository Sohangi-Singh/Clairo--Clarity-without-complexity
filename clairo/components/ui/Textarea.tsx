"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full min-h-[100px] px-3 py-2.5 bg-[var(--bg-surface)] border ${
            error ? "border-[var(--danger)]" : "border-[var(--border)]"
          } rounded-[var(--radius-md)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors resize-y ${className}`}
          {...props}
        />
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

Textarea.displayName = "Textarea";
export default Textarea;
