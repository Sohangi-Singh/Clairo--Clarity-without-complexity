"use client";

import { useState, useCallback } from "react";

interface UploadedFile {
  file: File;
  preview: string;
  base64?: string;
}

export function useUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    setUploading(true);
    const fileArray = Array.from(newFiles);

    const processed = await Promise.all(
      fileArray.map(async (file) => {
        const preview = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "";

        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.readAsDataURL(file);
        });

        return { file, preview, base64 };
      })
    );

    setFiles((prev) => [...prev, ...processed]);
    setUploading(false);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const next = [...prev];
      if (next[index]?.preview) {
        URL.revokeObjectURL(next[index].preview);
      }
      next.splice(index, 1);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
  }, [files]);

  return { files, uploading, addFiles, removeFile, clear };
}
