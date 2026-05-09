"use client";

import { PERSONAS, PersonaId } from "@/types";

interface PersonaPickerProps {
  selected: PersonaId;
  onChange: (id: PersonaId) => void;
}

export default function PersonaPicker({ selected, onChange }: PersonaPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PERSONAS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-full)] text-[12px] font-medium border transition-all ${
            selected === p.id
              ? "bg-[var(--accent-light)] text-[var(--accent-text)] border-[var(--accent)]"
              : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]"
          }`}
          title={p.description}
        >
          <span>{p.emoji}</span>
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  );
}
