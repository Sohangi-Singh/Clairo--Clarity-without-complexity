"use client";

import { useState, useCallback } from "react";

interface UseAIOptions {
  endpoint: string;
}

export function useAI({ endpoint }: UseAIOptions) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (body: Record<string, unknown>) => {
      setLoading(true);
      setOutput("");
      setError(null);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream available");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setOutput(accumulated);
        }

        setLoading(false);
        return accumulated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        setLoading(false);
        return null;
      }
    },
    [endpoint]
  );

  const refine = useCallback(
    async (instruction: string, currentOutput: string) => {
      return generate({ refine: true, instruction, currentOutput });
    },
    [generate]
  );

  return { output, loading, error, generate, refine, setOutput };
}
