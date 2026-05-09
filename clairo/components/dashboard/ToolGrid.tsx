"use client";

import { motion } from "framer-motion";
import { TOOLS } from "@/types";
import ToolCard from "./ToolCard";

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function ToolGrid() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {TOOLS.map((tool) => (
        <motion.div key={tool.id} variants={fadeUp}>
          <ToolCard tool={tool} />
        </motion.div>
      ))}
    </motion.div>
  );
}
