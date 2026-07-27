"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Layers, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Pillar {
  icon: LucideIcon;
  title: string;
  body: string;
  /** What an ordinary chatbot does instead — the contrast is the argument. */
  before: string;
  after: string;
  tint: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Workflow,
    title: "It finishes the errand",
    body: "A swarm of agents files, pays and follows up across SSS, PhilHealth, Pag-IBIG and PSA — you approve, it does the queueing.",
    before: "Reactive chatbot",
    after: "Autonomous swarm",
    tint: "#0F46F3",
  },
  {
    icon: Layers,
    title: "It shows, not tells",
    body: "Answers arrive as real documents — a contribution table you can download, a tracker you can show at the counter — not paragraphs to decipher.",
    before: "Chat only",
    after: "Generative UI",
    tint: "#FFC700",
  },
  {
    icon: BrainCircuit,
    title: "It remembers you",
    body: "PhilSys ID, employer, contribution rate, home branch. Once told, never asked again — and your IDs stay encrypted on your own device.",
    before: "No memory",
    after: "Memory graph",
    tint: "#E7000B",
  },
];

export function WhySuperAgent() {
  return (
    <section id="why" className="relative px-5 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-lp-primary">
            Why SuperAgent
          </p>
          <h2 className="mt-3 text-balance text-[34px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text sm:text-[42px]">
            An agent answers. A SuperAgent finishes.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
            Hindi lang siya chatbot. It holds your documents, remembers your record, files on your
            behalf, and hands you a receipt for every step.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="lp-card lp-lift flex flex-col rounded-2xl p-7"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: `${pillar.tint}1A`, color: pillar.tint }}
              >
                <pillar.icon className="h-5 w-5" />
              </span>

              <h3 className="mt-5 text-[19px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text">
                {pillar.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
                {pillar.body}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-lp-line pt-4 text-[12.5px] dark:border-lp-dark-line">
                <span className="whitespace-nowrap text-lp-body/60 line-through dark:text-lp-dark-muted/60">
                  {pillar.before}
                </span>
                <span className="text-lp-body/40 dark:text-lp-dark-muted/40">→</span>
                <span className="whitespace-nowrap font-semibold text-lp-ink dark:text-lp-dark-text">
                  {pillar.after}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
