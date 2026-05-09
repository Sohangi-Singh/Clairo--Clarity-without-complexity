"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("clairo-theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("clairo-theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      <span className="text-[13px]">{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
