"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ToolDefinition } from "@/types";

interface ToolCardProps {
  tool: ToolDefinition;
  usageCount?: number;
}

export default function ToolCard({ tool, usageCount = 0 }: ToolCardProps) {
  return (
    <Link href={tool.href}>
      <motion.div
        whileHover={{ y: -2, boxShadow: "var(--shadow-md)" }}
        transition={{ duration: 0.15 }}
        className="group flex flex-col gap-3 p-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-lg)] hover:border-l-[3px] hover:border-l-[var(--accent)] cursor-pointer transition-all"
      >
        <span className="text-[32px]">{tool.emoji}</span>
        <div className="flex-1">
          <h3 className="text-[16px] font-medium text-[var(--text-primary)]">
            {tool.name}
          </h3>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            {tool.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          {usageCount > 0 && (
            <span className="text-[11px] text-[var(--text-tertiary)]">
              Used {usageCount} times
            </span>
          )}
          <ArrowRight
            size={16}
            className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all ml-auto"
          />
        </div>
      </motion.div>
    </Link>
  );
}
