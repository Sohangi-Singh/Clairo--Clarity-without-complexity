"use client";

import { Mic, MicOff } from "lucide-react";
import { useVoice } from "@/hooks/useVoice";
import { motion } from "framer-motion";

interface VoiceInputProps {
  onResult: (text: string) => void;
  size?: "sm" | "lg";
  label?: string;
  lang?: string;
}

export default function VoiceInput({
  onResult,
  size = "sm",
  label,
  lang = "en-US",
}: VoiceInputProps) {
  const { listening, transcript, supported, start, stop } = useVoice({
    lang,
    onResult,
  });

  if (!supported) return null;

  if (size === "lg") {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-[var(--bg-elevated)] rounded-[var(--radius-xl)] border border-[var(--border)]">
        {label && (
          <p className="text-[15px] text-[var(--text-secondary)]">{label}</p>
        )}
        <div className="relative">
          {listening && (
            <motion.div
              className="absolute inset-0 rounded-full bg-[var(--accent)] pulse-ring"
              style={{ width: 72, height: 72, top: -4, left: -4 }}
            />
          )}
          <button
            onClick={listening ? stop : start}
            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              listening
                ? "bg-[var(--accent)] text-white shadow-accent"
                : "bg-[var(--bg-surface)] text-[var(--accent)] border-2 border-[var(--accent)] hover:bg-[var(--accent-light)]"
            }`}
          >
            {listening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
        </div>
        {listening && transcript && (
          <p className="text-[14px] text-[var(--text-primary)] text-center max-w-sm">
            &ldquo;{transcript}&rdquo;
          </p>
        )}
        {listening && !transcript && (
          <p className="text-[13px] text-[var(--text-tertiary)]">Listening...</p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={listening ? stop : start}
      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        listening
          ? "bg-[var(--accent)] text-white"
          : "text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]"
      }`}
      title="Voice input"
    >
      {listening ? <MicOff size={14} /> : <Mic size={14} />}
    </button>
  );
}
