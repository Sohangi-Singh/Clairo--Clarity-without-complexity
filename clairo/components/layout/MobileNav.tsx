"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Clock, Settings, Users } from "lucide-react";
import { TOOLS } from "@/types";
import ThemeToggle from "./ThemeToggle";
import Toggle from "../ui/Toggle";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  familyMode: boolean;
  onFamilyModeChange: (v: boolean) => void;
}

export default function MobileNav({ open, onClose, familyMode, onFamilyModeChange }: MobileNavProps) {
  const pathname = usePathname();

  const navLink = (href: string, icon: React.ReactNode, label: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[15px] ${
          active
            ? "bg-[var(--accent-light)] text-[var(--text-primary)] font-medium"
            : "text-[var(--text-secondary)]"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-[var(--bg-surface)] z-50 lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Image src="/clairo-logo.png" alt="Clairo" width={24} height={24} />
                <span className="logo-wordmark font-display text-[22px] font-semibold">
                  <span className="text-[var(--text-primary)]">Cl</span>
                  <span className="text-[var(--accent)]">ai</span>
                  <span className="text-[var(--text-primary)]">ro</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="p-3 flex flex-col gap-1">
              {navLink("/dashboard", <LayoutDashboard size={18} />, "Dashboard")}
              {navLink("/history", <Clock size={18} />, "My History")}

              <p className="label-caps px-4 mt-4 mb-1">Tools</p>
              {TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] text-[14px] ${
                    pathname === tool.href
                      ? "bg-[var(--accent-light)] text-[var(--text-primary)] font-medium"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  <span className="text-[18px]">{tool.emoji}</span>
                  {tool.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-[var(--border)] p-4 mt-2 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[var(--text-secondary)]" />
                <Toggle checked={familyMode} onChange={onFamilyModeChange} label="Family Mode" size="sm" />
              </div>
              {navLink("/settings", <Settings size={18} />, "Settings")}
              <ThemeToggle />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
