"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { MEMORY_FACTS } from "@/lib/data";

export function MemoryGraph() {
  return (
    <section className="eg-panel rounded-2xl p-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[13px] font-bold text-lp-ink dark:text-lp-dark-text">
          <BrainCircuit className="h-3.5 w-3.5 text-lp-primary" />
          Naalala ko
        </h2>
        <span className="text-[10px] uppercase tracking-[0.12em] text-lp-body/50 dark:text-lp-dark-muted/70">
          Memory graph
        </span>
      </header>

      <ul className="mt-3 space-y-2.5">
        {MEMORY_FACTS.map((fact, i) => (
          <motion.li
            key={fact.label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * i }}
            className="relative pl-4"
          >
            {/* Node + connector: the graph edge running down the rail. */}
            <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-lp-primary" />
            {i < MEMORY_FACTS.length - 1 ? (
              <span className="absolute left-[2.5px] top-3.5 h-[calc(100%+2px)] w-px bg-gradient-to-b from-lp-primary/45 to-transparent" />
            ) : null}
            <p className="text-[12.5px] leading-tight">
              <span className="text-lp-body/70 dark:text-lp-dark-muted/80">{fact.label}: </span>
              <span className="font-semibold text-lp-ink dark:text-lp-dark-text">{fact.value}</span>
            </p>
            <p className="mt-0.5 text-[10.5px] text-lp-body/60 dark:text-lp-dark-muted/70">
              {fact.detail}
            </p>
          </motion.li>
        ))}
      </ul>

      <p className="mt-3.5 border-t border-lp-line pt-2.5 text-[10.5px] leading-snug text-lp-body/60 dark:border-lp-dark-line dark:text-lp-dark-muted/70">
        Hindi na kita tatanungin ulit — natatandaan ko na.
      </p>
    </section>
  );
}
