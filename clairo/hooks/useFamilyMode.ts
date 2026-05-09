"use client";

import { useState, useEffect, useCallback } from "react";

export function useFamilyMode() {
  const [familyMode, setFamilyMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("clairo-family-mode");
    if (saved === "true") {
      setFamilyMode(true);
      document.body.setAttribute("data-family-mode", "true");
    }
  }, []);

  const toggleFamilyMode = useCallback((value: boolean) => {
    setFamilyMode(value);
    localStorage.setItem("clairo-family-mode", String(value));
    document.body.setAttribute("data-family-mode", String(value));
  }, []);

  return { familyMode, toggleFamilyMode };
}
