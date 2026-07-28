"use client";

import { motion } from "framer-motion";
import { BrainCircuit, IdCard } from "lucide-react";
import { memoryFactsFor } from "@/lib/data";
import { useUser } from "@/lib/user";

export function MemoryGraph({ onConnectId }: { onConnectId?: () => void }) {
  const user = useUser();
  const facts = memoryFactsFor(user);

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

      {facts.length === 0 ? (
        // Nothing is known about a guest, and the panel says so rather than
        // showing someone else's record.
        <div className="mt-3 rounded-xl border border-dashed border-lp-line p-4 text-center dark:border-lp-dark-line">
          <p className="text-[12.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
            No memory yet — upload an ID to the Vault to auto-fill.
          </p>
          {onConnectId ? (
            <button
              type="button"
              onClick={onConnectId}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-lp-primary px-3 py-1.5 text-[12px] font-semibold text-white transition hover:scale-[1.02]"
            >
              <IdCard className="h-3.5 w-3.5" />
              Connect ID
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {facts.map((fact, i) => (
            <motion.li
              key={fact.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
              className="relative pl-4"
            >
              {/* Node + connector: the graph edge running down the rail. */}
              <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-lp-primary" />
              {i < facts.length - 1 ? (
                <span className="absolute left-[2.5px] top-3.5 h-[calc(100%+2px)] w-px bg-gradient-to-b from-lp-primary/45 to-transparent" />
              ) : null}
              <p className="text-[12.5px] leading-tight">
                <span className="text-lp-body/70 dark:text-lp-dark-muted/80">{fact.label}: </span>
                <span className="font-semibold text-lp-ink dark:text-lp-dark-text">
                  {fact.value}
                </span>
              </p>
              <p className="mt-0.5 text-[10.5px] text-lp-body/60 dark:text-lp-dark-muted/70">
                {fact.detail}
              </p>
            </motion.li>
          ))}
        </ul>
      )}

      <p className="mt-3.5 border-t border-lp-line pt-2.5 text-[10.5px] leading-snug text-lp-body/60 dark:border-lp-dark-line dark:text-lp-dark-muted/70">
        {facts.length
          ? "Hindi na kita tatanungin ulit — natatandaan ko na."
          : "Walang itinatago sa server — lahat ng matututunan ko ay nasa device mo lang."}
      </p>
    </section>
  );
}
