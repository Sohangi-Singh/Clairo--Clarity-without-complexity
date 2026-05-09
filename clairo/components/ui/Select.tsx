"use client";

import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full h-10 px-3 bg-[var(--bg-surface)] border ${
            error ? "border-[var(--danger)]" : "border-[var(--border)]"
          } rounded-[var(--radius-md)] text-[15px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors appearance-none cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

Select.displayName = "Select";
export default Select;
