"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";
import VoiceInput from "@/components/voice/VoiceInput";
import DropZone from "@/components/upload/DropZone";
import FilePreview from "@/components/upload/FilePreview";
import Button from "@/components/ui/Button";
import { useFamilyMode } from "@/hooks/useFamilyMode";
import { useUpload } from "@/hooks/useUpload";
import { TOOLS } from "@/types";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "clairo";
  text: string;
  suggestedTool?: string;
}

const followUpChips = [
  { label: "Tell me more", action: "followup" },
  { label: "Upload a document", action: "upload" },
  { label: "Take me to the right tool", action: "tool" },
  { label: "Start over", action: "reset" },
] as const;

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageInner />
    </Suspense>
  );
}

function ChatPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [mobileOpen, setMobileOpen] = useState(false);
  const { familyMode, toggleFamilyMode } = useFamilyMode();
  const { files, addFiles, removeFile, clear: clearFiles } = useUpload();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (initialQuery && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      submitQuery(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const submitQuery = async (text: string) => {
    if (!text.trim() && !files.length) return;

    const userText = text.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setQuery("");
    setStreaming(true);

    const filePayload = files.length
      ? files.map((f) => ({
          base64: f.base64 || "",
          mimeType: f.file.type,
        }))
      : undefined;

    if (files.length) clearFiles();

    try {
      const history = messages.map((m) => ({
        role: m.role === "clairo" ? "assistant" : "user",
        text: m.text,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, files: filePayload, history }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";

      setMessages((prev) => [...prev, { role: "clairo", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });

        const displayText = fullText.replace(/\[TOOL_SUGGEST:[^\]]*\]/, "").trimEnd();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "clairo", text: displayText };
          return updated;
        });
      }

      const toolMatch = fullText.match(/\[TOOL_SUGGEST:([^\]]+)\]/);
      if (toolMatch) {
        const toolId = toolMatch[1].trim();
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            text: last.text.replace(/\[TOOL_SUGGEST:[^\]]*\]/, "").trimEnd(),
            suggestedTool: toolId,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1).filter((m) => m.text),
        {
          role: "clairo",
          text: "I'm having a little trouble right now. Could you try saying that again?",
        },
      ]);
    } finally {
      setStreaming(false);
      setShowUpload(false);
    }
  };

  const handleChip = (action: string) => {
    if (action === "reset") {
      setMessages([]);
      setQuery("");
      clearFiles();
      setShowUpload(false);
      inputRef.current?.focus();
    } else if (action === "upload") {
      setShowUpload(true);
    } else if (action === "tool") {
      const lastMsg = [...messages].reverse().find((m) => m.suggestedTool);
      if (lastMsg?.suggestedTool) {
        window.location.href = `/tools/${lastMsg.suggestedTool}`;
      }
    } else if (action === "followup") {
      submitQuery("Tell me more about this");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(query);
  };

  const suggestedTool = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (!tool) return null;
    return tool;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar familyMode={familyMode} onFamilyModeChange={toggleFamilyMode} />
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        familyMode={familyMode}
        onFamilyModeChange={toggleFamilyMode}
      />
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <main className="lg:ml-[256px] p-4 md:p-8 max-w-3xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="text-center pt-4">
            <h1 className="font-display text-[28px] md:text-[36px] font-semibold text-[var(--text-primary)]">
              Ask Clairo Anything
            </h1>
            <p className="text-[15px] text-[var(--text-secondary)] mt-2">
              Describe what you need — we&apos;ll help you figure out the rest.
            </p>
          </div>

          {/* Voice + Text input area */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <VoiceInput
                onResult={(text) => submitQuery(text)}
                size="lg"
                label="Tap and tell us what you need"
              />

              <div className="flex items-center gap-3 w-full max-w-lg">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-[13px] text-[var(--text-tertiary)]">
                  Or type what you need instead
                </span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Help me understand my blood test report"
                    className="flex-1 h-12 px-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                  <Button type="submit" variant="primary" size="md" disabled={!query.trim()} icon={<Send size={16} />}>
                    Ask
                  </Button>
                </div>
              </form>

              <div className="w-full max-w-lg">
                <DropZone
                  onFiles={addFiles}
                  accept="image/jpeg,image/png,application/pdf"
                  label="Upload a document, image, or PDF if relevant"
                  sublabel="JPG, PNG, or PDF"
                />
                <FilePreview files={files} onRemove={removeFile} />
              </div>
            </motion.div>
          )}

          {/* Chat messages */}
          {messages.length > 0 && (
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[var(--radius-lg)] px-5 py-4 ${
                        msg.role === "user"
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)]"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {msg.text || (streaming && i === messages.length - 1 ? "" : "")}
                      </p>
                      {streaming && i === messages.length - 1 && msg.role === "clairo" && (
                        <span className="inline-block w-2 h-4 bg-[var(--accent)] rounded-sm animate-pulse ml-0.5" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Tool suggestion card */}
              {!streaming &&
                messages.length > 0 &&
                messages[messages.length - 1].suggestedTool && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-[var(--radius-lg)] p-4 flex items-center justify-between gap-4"
                  >
                    {(() => {
                      const tool = suggestedTool(messages[messages.length - 1].suggestedTool!);
                      if (!tool) return null;
                      return (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="text-[24px]">{tool.emoji}</span>
                            <div>
                              <p className="text-[15px] font-medium text-[var(--text-primary)]">
                                This sounds like {tool.name} can help you further
                              </p>
                              <p className="text-[13px] text-[var(--text-secondary)]">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                          <Link href={tool.href}>
                            <Button variant="primary" size="sm">
                              Open {tool.name} →
                            </Button>
                          </Link>
                        </>
                      );
                    })()}
                  </motion.div>
                )}

              {/* Follow-up chips */}
              {!streaming && messages.length > 0 && messages[messages.length - 1].role === "clairo" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2"
                >
                  {followUpChips.map((chip) => (
                    <button
                      key={chip.action}
                      onClick={() => handleChip(chip.action)}
                      className="px-4 py-2 text-[13px] font-medium rounded-[var(--radius-full)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-all"
                    >
                      {chip.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Upload zone (shown on chip click) */}
              <AnimatePresence>
                {showUpload && !streaming && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <DropZone
                      onFiles={addFiles}
                      accept="image/jpeg,image/png,application/pdf"
                      label="Upload a document, image, or PDF"
                      sublabel="JPG, PNG, or PDF"
                    />
                    <FilePreview files={files} onRemove={removeFile} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inline input for follow-up */}
              <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
                <VoiceInput
                  onResult={(text) => submitQuery(text)}
                  size="sm"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a follow-up..."
                  className="flex-1 h-10 px-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!query.trim() && !files.length}
                  icon={<Send size={14} />}
                >
                  Send
                </Button>
              </form>

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
