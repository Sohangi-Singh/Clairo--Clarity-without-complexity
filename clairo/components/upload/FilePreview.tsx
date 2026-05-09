"use client";

/* eslint-disable @next/next/no-img-element */
import { X, FileText } from "lucide-react";

interface FilePreviewProps {
  files: Array<{ file: File; preview: string }>;
  onRemove: (index: number) => void;
}

export default function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (!files.length) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {files.map((f, i) => (
        <div
          key={i}
          className="relative group flex items-center gap-2 px-3 py-2 bg-[var(--bg-elevated)] rounded-[var(--radius-md)] border border-[var(--border)]"
        >
          {f.preview ? (
            <img
              src={f.preview}
              alt=""
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            <FileText size={16} className="text-[var(--text-tertiary)]" />
          )}
          <span className="text-[13px] text-[var(--text-secondary)] max-w-[120px] truncate">
            {f.file.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(i);
            }}
            className="ml-1 p-0.5 rounded-full text-[var(--text-tertiary)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
