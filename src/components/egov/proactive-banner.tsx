"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellRing, X } from "lucide-react";

/**
 * Predictive alert. This is the whole thesis of the product in one strip: the
 * agent noticed the deadline first and is asking for permission, not input.
 */
export function ProactiveBanner({
  visible,
  onConfirm,
  onDefer,
}: {
  visible: boolean;
  onConfirm: () => void;
  onDefer: () => void;
}) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden px-4 pt-4 sm:px-6"
        >
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-lp-yellow/35 dark:bg-lp-yellow/[0.08]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-lp-yellow/15 dark:text-lp-yellow">
              <BellRing className="h-4 w-4" />
            </span>
            <p className="min-w-0 flex-1 text-[13.5px] leading-snug text-amber-900 dark:text-lp-dark-text">
              <span className="font-bold">Boss, due ng SSS mo in 3 days.</span> Bayaran ko na?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onConfirm}
                className="h-8 rounded-lg bg-lp-yellow px-4 text-[12.5px] font-bold text-[#3A2E00] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={onDefer}
                className="h-8 rounded-lg border border-amber-300 bg-white px-4 text-[12.5px] font-semibold text-amber-800 transition hover:bg-amber-100 dark:border-lp-yellow/30 dark:bg-transparent dark:text-lp-dark-text dark:hover:bg-lp-yellow/10"
              >
                Later
              </button>
              <button
                type="button"
                onClick={onDefer}
                aria-label="Dismiss alert"
                className="rounded-md p-1 text-amber-700/60 transition hover:text-amber-900 dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
