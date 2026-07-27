"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "egov-theme";

/**
 * Runs before first paint (injected into <head>) so a returning dark-mode
 * visitor never sees a white flash. Light is the default: the brand lockup was
 * drawn for a light surface, so we don't follow prefers-color-scheme unless the
 * visitor has actually chosen dark here.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`;

interface ThemeContextValue {
  /** Null until the client has resolved the stored preference. */
  theme: Theme | null;
  /** Safe to render with — falls back to the light default. */
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Resolve once on mount. The pre-paint script has already applied the class,
  // so we read from it rather than fighting it.
  useEffect(() => {
    let initial: Theme = "light";
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "dark" || stored === "light") initial = stored;
      else if (document.documentElement.classList.contains("dark")) initial = "dark";
    } catch {
      // Storage blocked (private mode, embedded webview) — light it is.
    }
    setTheme(initial);
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Preference just won't persist; the toggle still works this session.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => ((current ?? "light") === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme: theme ?? "light", setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
