"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import PersonaPicker from "../persona/PersonaPicker";
import { useFamilyMode } from "@/hooks/useFamilyMode";
import type { PersonaId } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ToolLayoutProps {
  toolName: string;
  toolEmoji: string;
  toolDescription: string;
  persona: PersonaId;
  onPersonaChange: (p: PersonaId) => void;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export default function ToolLayout({
  toolName,
  toolEmoji,
  toolDescription,
  persona,
  onPersonaChange,
  leftPanel,
  rightPanel,
}: ToolLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { familyMode, toggleFamilyMode } = useFamilyMode();

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar familyMode={familyMode} onFamilyModeChange={toggleFamilyMode} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} familyMode={familyMode} onFamilyModeChange={toggleFamilyMode} />
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <main className="lg:ml-[256px] p-4 md:p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)] mb-4">
          <Link href="/dashboard" className="hover:text-[var(--text-secondary)]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--text-primary)]">{toolName}</span>
        </div>

        {/* Tool header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-[var(--accent-light)] flex items-center justify-center text-[32px] flex-shrink-0">
              {toolEmoji}
            </div>
            <div>
              <h1 className="font-display text-[28px] md:text-[32px] font-semibold text-[var(--text-primary)]">
                {toolName}
              </h1>
              <p className="text-[15px] text-[var(--text-secondary)] mt-0.5">{toolDescription}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <PersonaPicker selected={persona} onChange={onPersonaChange} />
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-[55%_45%] gap-6">
          <div>{leftPanel}</div>
          <div>{rightPanel}</div>
        </div>
      </main>
    </div>
  );
}
