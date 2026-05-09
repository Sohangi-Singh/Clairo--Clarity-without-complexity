"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useFamilyMode } from "@/hooks/useFamilyMode";
import { useHistory } from "@/hooks/useHistory";
import { TOOLS } from "@/types";
import { Search, Trash2, RotateCcw, Download } from "lucide-react";
import Link from "next/link";

const filterOptions = ["All", "Documents", "Emails", "Receipts", "Medical", "Government", "Resume", "Scam checks"];

const filterMap: Record<string, string[]> = {
  All: [],
  Documents: ["document-wizard", "doc-transcriber"],
  Emails: ["email-helper"],
  Receipts: ["receipt-scanner"],
  Medical: ["medical-simplifier"],
  Government: ["scheme-helper"],
  Resume: ["resume-assistant"],
  "Scam checks": ["scam-detector"],
};

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export default function HistoryPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { familyMode, toggleFamilyMode } = useFamilyMode();
  const { history, deleteItem } = useHistory();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = history.filter((item) => {
    const toolFilter = filterMap[filter];
    if (toolFilter && toolFilter.length > 0 && !toolFilter.includes(item.tool_name)) return false;
    if (search && !item.output_text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar familyMode={familyMode} onFamilyModeChange={toggleFamilyMode} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} familyMode={familyMode} onFamilyModeChange={toggleFamilyMode} />
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <main className="lg:ml-[256px] p-4 md:p-8 max-w-4xl">
        <h1 className="font-display text-[28px] md:text-[32px] font-semibold text-[var(--text-primary)] mb-6">My History</h1>

        <div className="flex flex-col gap-4 mb-6">
          <Input placeholder="Search your history..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={16} />} />
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[13px] font-medium rounded-[var(--radius-full)] border transition-all ${filter === f ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[16px] text-[var(--text-tertiary)]">No history found.</p>
            <p className="text-[13px] text-[var(--text-tertiary)] mt-1">Try a tool to get started!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => {
              const tool = TOOLS.find((t) => t.id === item.tool_name);
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <Card padding="md" className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[24px]">{tool?.emoji ?? "📄"}</span>
                        <div>
                          <p className="text-[15px] font-medium text-[var(--text-primary)]">{item.tool_display_name}</p>
                          <p className="text-[12px] text-[var(--text-tertiary)]">{timeAgo(item.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="accent">{item.language}</Badge>
                      </div>
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2">{item.output_text.slice(0, 200)}...</p>
                    <div className="flex items-center gap-2">
                      <Link href={tool?.href ?? "/dashboard"}>
                        <Button variant="ghost" size="sm" icon={<RotateCcw size={12} />}>Use as template</Button>
                      </Link>
                      <Button variant="ghost" size="sm" icon={<Download size={12} />} onClick={() => {
                        const blob = new Blob([item.output_text], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a"); a.href = url; a.download = `${item.tool_name}.txt`; a.click();
                      }}>Download</Button>
                      <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} onClick={() => deleteItem(item.id)} className="text-[var(--danger)] ml-auto">Delete</Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
