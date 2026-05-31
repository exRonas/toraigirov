"use client";

import { useCallback, useEffect, useState } from "react";

export type FontSize = "sm" | "md" | "lg";

const STORAGE_KEY = "article-font-size";

/** Reading font-size preference for article content, persisted to localStorage. */
export function useFontSize() {
  const [size, setSizeState] = useState<FontSize>("md");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as FontSize | null;
      if (saved === "sm" || saved === "md" || saved === "lg") {
        setSizeState(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setSize = useCallback((next: FontSize) => {
    setSizeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const className =
    size === "sm" ? "content-sm" : size === "lg" ? "content-lg" : "content-md";

  return { size, setSize, className };
}
