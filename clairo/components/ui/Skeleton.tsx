"use client";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export default function Skeleton({ className = "", lines = 1 }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton-shimmer rounded-[var(--radius-sm)] h-4 ${
              i === lines - 1 ? "w-3/4" : "w-full"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`skeleton-shimmer rounded-[var(--radius-sm)] ${className}`} />
  );
}
