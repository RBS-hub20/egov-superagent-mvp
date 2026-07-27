"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

/**
 * Pill switch. The knob carries the *active* mode's icon and springs across the
 * track; the destination icon stays faint underneath so the affordance reads
 * without a label.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative inline-flex h-10 w-[72px] shrink-0 items-center rounded-full border border-lp-line bg-slate-100/80 p-1 backdrop-blur transition-colors duration-500 hover:border-lp-primary/40 dark:border-lp-dark-line dark:bg-lp-dark-card/80 ${className ?? ""}`}
    >
      {/* Faint hint of where the knob is headed. */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
        <Sun
          className={`h-3.5 w-3.5 transition-opacity duration-300 ${
            isDark ? "text-lp-yellow opacity-70" : "opacity-0"
          }`}
        />
        <Moon
          className={`h-3.5 w-3.5 transition-opacity duration-300 ${
            isDark ? "opacity-0" : "text-slate-400 opacity-70"
          }`}
        />
      </span>

      <motion.span
        // `initial={false}` so the knob doesn't slide in from 0 on first paint
        // for a visitor whose stored preference is dark.
        initial={false}
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 32 }}
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(10,25,49,0.2)] dark:bg-lp-glow dark:shadow-[0_0_18px_rgba(59,130,246,0.6)]"
        aria-hidden
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
              transition={{ duration: 0.22 }}
            >
              <Moon className="h-4 w-4 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 70, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -70, scale: 0.6 }}
              transition={{ duration: 0.22 }}
            >
              <Sun className="h-4 w-4 text-lp-yellow" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
