"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Clock,
  ChevronDown,
  Settings,
  Users,
  Mic,
} from "lucide-react";
import { TOOLS } from "@/types";
import ThemeToggle from "./ThemeToggle";
import Toggle from "../ui/Toggle";

interface SidebarProps {
  familyMode: boolean;
  onFamilyModeChange: (v: boolean) => void;
}

const popularToolIds = ["document-wizard", "email-helper", "receipt-scanner", "scam-detector"];

export default function Sidebar({ familyMode, onFamilyModeChange }: SidebarProps) {
  const pathname = usePathname();
  const [allToolsOpen, setAllToolsOpen] = useState(false);

  const popularTools = TOOLS.filter((t) => popularToolIds.includes(t.id));
  const otherTools = TOOLS.filter((t) => !popularToolIds.includes(t.id));

  const navItem = (href: string, icon: React.ReactNode, label: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-[14px] transition-all ${
          active
            ? "bg-[var(--accent-light)] text-[var(--text-primary)] font-medium border-l-[3px] border-[var(--accent)] pl-[9px]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  const toolItem = (tool: (typeof TOOLS)[0]) => {
    const active = pathname === tool.href;
    return (
      <Link
        key={tool.id}
        href={tool.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-[14px] transition-all ${
          active
            ? "bg-[var(--accent-light)] text-[var(--text-primary)] font-medium border-l-[3px] border-[var(--accent)] pl-[9px]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
        }`}
      >
        <span className="text-[18px] flex-shrink-0">{tool.emoji}</span>
        <span className="truncate">{tool.name}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-[256px] h-screen border-r border-[var(--border)] bg-[var(--bg-surface)] fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <Link href="/dashboard" className="flex items-baseline gap-0">
          <span className="logo-wordmark font-display text-[22px] font-semibold">
            <span className="text-[var(--text-primary)]">Cl</span>
            <span className="text-[var(--accent)]">ai</span>
            <span className="text-[var(--text-primary)]">ro</span>
          </span>
        </Link>
        <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
          Clarity without complexity
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        <span className="label-caps px-3 mb-1">Home</span>
        <Link
          href="/chat"
          className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-[14px] transition-all ${
            pathname === "/chat"
              ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium border-l-[3px] border-[var(--accent)] pl-[9px]"
              : "text-[var(--accent)] hover:bg-[var(--accent-light)]"
          }`}
        >
          <Mic size={18} />
          <span className="font-medium">Ask Anything</span>
        </Link>
        {navItem("/dashboard", <LayoutDashboard size={18} />, "Dashboard")}
        {navItem("/history", <Clock size={18} />, "My History")}

        <span className="label-caps px-3 mt-4 mb-1">Popular Tools</span>
        {popularTools.map(toolItem)}

        <button
          onClick={() => setAllToolsOpen(!allToolsOpen)}
          className="flex items-center justify-between px-3 py-2 mt-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <span className="label-caps">All Tools</span>
          <motion.span animate={{ rotate: allToolsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.span>
        </button>
        <AnimatePresence>
          {allToolsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden flex flex-col gap-0.5"
            >
              {otherTools.map(toolItem)}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--border)] px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-1">
          <Users size={16} className="text-[var(--text-secondary)]" />
          <Toggle
            checked={familyMode}
            onChange={onFamilyModeChange}
            label="Family Mode"
            size="sm"
          />
        </div>
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <ThemeToggle />
      </div>
    </aside>
  );
}
