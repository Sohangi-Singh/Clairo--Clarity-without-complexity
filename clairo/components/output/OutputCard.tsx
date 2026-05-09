"use client";

import { motion } from "framer-motion";
import Skeleton from "../ui/Skeleton";
import { FileText } from "lucide-react";

interface OutputCardProps {
  output: string;
  loading: boolean;
  toolEmoji?: string;
}

export default function OutputCard({
  output,
  loading,
  toolEmoji = "📄",
}: OutputCardProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-sm sticky top-6">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)]">
        <span className="text-[18px]">{toolEmoji}</span>
        <span className="text-[14px] font-medium text-[var(--text-primary)]">
          Your result
        </span>
      </div>

      <div className="px-5 py-4 min-h-[200px]">
        {loading && !output && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <span className="spinner" />
              <span className="text-[14px]">Working on it...</span>
            </div>
            <Skeleton lines={6} />
          </div>
        )}

        {!loading && !output && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
              <FileText size={20} className="text-[var(--text-tertiary)]" />
            </div>
            <p className="text-[14px] text-[var(--text-tertiary)]">
              Your result will appear here
            </p>
          </div>
        )}

        {output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-sm max-w-none"
          >
            <div
              className="text-[14px] leading-relaxed text-[var(--text-primary)] font-mono whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatOutput(output) }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function formatOutput(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}
