"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
  userName?: string;
}

export default function TopBar({ onMenuClick, userName }: TopBarProps) {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-[var(--border)] bg-[var(--bg-surface)] sticky top-0 z-40">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
      >
        <Menu size={22} />
      </button>

      <Link href="/dashboard" className="flex items-baseline">
        <span className="logo-wordmark font-display text-[20px] font-semibold">
          <span className="text-[var(--text-primary)]">Cl</span>
          <span className="text-[var(--accent)]">ai</span>
          <span className="text-[var(--text-primary)]">ro</span>
        </span>
      </Link>

      <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-[13px] font-medium">
        {userName ? userName.charAt(0).toUpperCase() : "G"}
      </div>
    </header>
  );
}
