"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "warning" | "error" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
};

const styles = {
  success: "bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]",
  warning: "bg-[var(--warning-light)] text-[var(--warning)] border-[var(--warning)]",
  error: "bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]",
  info: "bg-[var(--info-light)] text-[var(--info)] border-[var(--info)]",
};

export default function Toast({
  type,
  message,
  visible,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border rounded-[var(--radius-md)] shadow-md ${styles[type]}`}
        >
          {icons[type]}
          <span className="text-[14px] font-medium">{message}</span>
          <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
