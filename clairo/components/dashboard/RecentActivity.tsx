"use client";

import { motion } from "framer-motion";
import { TOOLS } from "@/types";
import type { HistoryItem } from "@/types";

interface RecentActivityProps {
  items: HistoryItem[];
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function RecentActivity({ items }: RecentActivityProps) {
  if (!items.length) {
    return (
      <div className="text-center py-8">
        <p className="text-[14px] text-[var(--text-tertiary)]">
          No activity yet. Try a tool to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.slice(0, 5).map((item) => {
        const tool = TOOLS.find((t) => t.id === item.tool_name);
        return (
          <motion.div
            key={item.id}
            whileHover={{ backgroundColor: "var(--bg-elevated)" }}
            className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] transition-colors"
          >
            <span className="text-[20px] flex-shrink-0">{tool?.emoji ?? "📄"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                {item.tool_display_name}
              </p>
              <p className="text-[12px] text-[var(--text-tertiary)] truncate">
                {item.output_text.slice(0, 80)}...
              </p>
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)] flex-shrink-0">
              {timeAgo(item.created_at)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
