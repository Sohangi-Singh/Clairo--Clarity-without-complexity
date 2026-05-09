"use client";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
  label?: string;
}

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  leftLabel,
  rightLabel,
  label,
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-[13px] font-medium text-[var(--text-primary)]">
          {label}
        </span>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--accent) ${percent}%, var(--bg-elevated) ${percent}%)`,
        }}
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between">
          <span className="text-[12px] text-[var(--text-tertiary)]">{leftLabel}</span>
          <span className="text-[12px] text-[var(--text-tertiary)]">{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
