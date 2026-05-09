"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

interface DropZoneProps {
  onFiles: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
}

export default function DropZone({
  onFiles,
  accept = "image/*,.pdf,.docx",
  multiple = true,
  label = "Drop your files here",
  sublabel = "or click to browse",
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) {
        onFiles(e.dataTransfer.files);
      }
    },
    [onFiles]
  );

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-[var(--radius-xl)] cursor-pointer transition-all ${
        dragging
          ? "border-[var(--accent)] bg-[var(--accent-light)]"
          : "border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] flex items-center justify-center border border-[var(--border)]">
        <Upload size={20} className="text-[var(--accent)]" />
      </div>
      <div className="text-center">
        <p className="text-[15px] font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-0.5">{sublabel}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && onFiles(e.target.files)}
        className="hidden"
      />
    </motion.div>
  );
}
