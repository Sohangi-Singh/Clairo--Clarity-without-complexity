"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  onClick,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: "var(--shadow-md)" } : undefined}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-xs ${paddings[padding]} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
