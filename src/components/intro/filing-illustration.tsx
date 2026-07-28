"use client";

import { motion } from "framer-motion";
import { Check, Clock, FileCheck2, Users } from "lucide-react";

/**
 * Slide 2 — the queue you skip, and the filing that happens for you.
 *
 * Light-only: the intro is always white, matching the government apps it sits
 * beside on a first-time visitor's phone.
 */
export function FilingIllustration() {
  return (
    <div className="relative flex h-[260px] w-full items-center justify-center sm:h-[300px]" aria-hidden>
      <div
        className="pointer-events-none absolute inset-0 rounded-[36px] opacity-70 blur-2xl"
        style={{ background: "radial-gradient(closest-side, rgba(15,70,243,0.14), transparent 75%)" }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-3">
        {/* The pila, crossed out. */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-2.5 shadow-sm"
        >
          <Users className="h-4 w-4 text-slate-400" />
          <span className="text-[13px] font-medium text-slate-400">Pila • 3 hours</span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute inset-x-4 top-1/2 h-[2px] origin-left rounded-full bg-[#E7000B]"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400"
        >
          Kami na bahala
        </motion.span>

        {/* The filing, done. */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-[260px] rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_22px_50px_-30px_rgba(10,25,49,0.55)]"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F46F3]/10 text-[#0F46F3]">
              <FileCheck2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] font-bold text-[#0A1931]">Filed officially</p>
              <p className="text-[10.5px] text-slate-500">By your AXLA operator</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
              <Check className="h-3 w-3" />
              Done
            </span>
          </div>

          <div className="mt-3 border-t border-[#E2E8F0] pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Receipt
            </p>
            <p className="mt-0.5 font-mono text-[13px] font-bold text-[#0A1931]">EGOV-2026-8891</p>
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11.5px] font-semibold text-slate-500 shadow-sm"
        >
          <Clock className="h-3 w-3 text-[#0F46F3]" />
          9.4s vs 3 hours
        </motion.span>
      </div>
    </div>
  );
}
