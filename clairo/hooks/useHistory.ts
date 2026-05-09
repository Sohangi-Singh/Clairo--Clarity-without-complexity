"use client";

import { useState, useCallback } from "react";
import type { HistoryItem, ToolId, Language, PersonaId } from "@/types";

const STORAGE_KEY = "clairo-history";

function getStoredHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(getStoredHistory);

  const addToHistory = useCallback(
    (params: {
      tool_name: ToolId;
      tool_display_name: string;
      inputs: Record<string, unknown>;
      output_text: string;
      language?: Language;
      persona?: PersonaId;
      confidence_score?: number;
    }) => {
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        user_id: "guest",
        tool_name: params.tool_name,
        tool_display_name: params.tool_display_name,
        inputs: params.inputs,
        output_text: params.output_text,
        language: params.language ?? "english",
        persona: params.persona,
        confidence_score: params.confidence_score,
        created_at: new Date().toISOString(),
      };

      setHistory((prev) => {
        const next = [item, ...prev].slice(0, 100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      return item;
    },
    []
  );

  const deleteItem = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { history, addToHistory, deleteItem };
}
