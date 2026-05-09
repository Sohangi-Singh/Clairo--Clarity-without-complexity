"use client";

interface StepIndicatorProps {
  current: number;
  total: number;
}

export default function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] text-[var(--text-secondary)]">
        Step {current} of {total}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < current
                ? "bg-[var(--accent)]"
                : "bg-[var(--bg-overlay)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
