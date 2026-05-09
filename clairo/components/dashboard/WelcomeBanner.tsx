"use client";

import { motion } from "framer-motion";

interface WelcomeBannerProps {
  name?: string;
}

export default function WelcomeBanner({ name }: WelcomeBannerProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative overflow-hidden rounded-[var(--radius-xl)] p-6 md:p-8"
      style={{
        background:
          "linear-gradient(135deg, var(--accent-light) 0%, var(--bg-surface) 100%)",
      }}
    >
      <h1 className="text-[24px] md:text-[32px] font-display font-semibold text-[var(--text-primary)]">
        {greeting}{name ? `, ${name}` : ""}. 👋
      </h1>
      <p className="text-[15px] text-[var(--text-secondary)] mt-1">
        What would you like help with today?
      </p>
    </motion.div>
  );
}
