"use client";

import { Download } from "lucide-react";
import Button from "../ui/Button";

interface DownloadBarProps {
  output: string;
  toolName: string;
  onDownloadDocx?: () => void;
  onDownloadPdf?: () => void;
  onDownloadTxt?: () => void;
}

export default function DownloadBar({
  output,
  toolName,
  onDownloadDocx,
  onDownloadPdf,
  onDownloadTxt,
}: DownloadBarProps) {
  if (!output) return null;

  const downloadTxt = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2 px-5 py-3 border-t border-[var(--border)]">
      {onDownloadDocx && (
        <Button variant="primary" size="sm" icon={<Download size={14} />} onClick={onDownloadDocx}>
          Download .docx
        </Button>
      )}
      {onDownloadPdf && (
        <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={onDownloadPdf}>
          Download PDF
        </Button>
      )}
      <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={onDownloadTxt ?? downloadTxt}>
        Download .txt
      </Button>
    </div>
  );
}
