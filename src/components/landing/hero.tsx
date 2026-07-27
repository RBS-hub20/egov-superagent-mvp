"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Sparkles } from "lucide-react";

const AGENCIES = ["SSS", "PhilHealth", "Pag-IBIG", "PSA"];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  return (
    <section className="relative px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.div {...rise(0)}>
          <span className="lp-badge-shimmer inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-medium text-lp-body dark:text-lp-dark-muted">
            <Sparkles className="h-3.5 w-3.5 text-lp-yellow" />
            Autonomous agent swarm for Philippine e-government
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-9 flex w-full justify-center"
        >
          {/* Blue backlight. Dialled right down in light mode — on white it
              would read as a grey smudge — and full strength in dark, where it
              lifts the navy half of the wordmark off the near-black canvas. */}
          <div
            className="lp-glow-pulse pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[110px] dark:opacity-100"
            style={{
              background:
                "radial-gradient(closest-side, rgba(59,130,246,0.42) 0%, rgba(15,70,243,0.22) 55%, transparent 100%)",
            }}
            aria-hidden
          />
          {/* Warm pulse behind the Philippine sun inside the mark. */}
          <div
            className="lp-sun-pulse pointer-events-none absolute left-1/2 top-[26%] h-[130px] w-[130px] -translate-x-1/2 rounded-full opacity-50 blur-[42px] dark:opacity-100"
            style={{ background: "radial-gradient(circle, rgba(255,199,0,0.75) 0%, transparent 70%)" }}
            aria-hidden
          />

          <Image
            src="/logo.png"
            alt="eGov SuperAgent"
            width={1040}
            height={513}
            priority
            sizes="(max-width: 768px) 380px, 520px"
            // A neutral drop shadow greys the artwork on white, so the light
            // theme gets a blue-tinted one and dark gets a glow.
            className="lp-float relative w-[380px] max-w-full [filter:drop-shadow(0_16px_26px_rgba(15,70,243,0.16))] dark:[filter:drop-shadow(0_0_30px_rgba(59,130,246,0.32))] md:w-[520px]"
          />
        </motion.div>

        <motion.h1
          {...rise(0.2)}
          className="mt-8 text-balance font-bold tracking-tighter text-lp-ink dark:text-lp-dark-text"
          style={{ fontSize: "clamp(48px, 7vw, 80px)", lineHeight: 1.03 }}
        >
          Super Agent. <span className="lp-gradient-text">All Services.</span>
        </motion.h1>

        <motion.p
          {...rise(0.4)}
          className="mt-6 max-w-2xl text-pretty text-[20px] leading-relaxed text-lp-body dark:text-lp-dark-muted"
        >
          The Autonomous eGov OS for 115M Filipinos.{" "}
          <span className="font-semibold text-lp-ink dark:text-lp-dark-text">Utusan mo lang.</span>
        </motion.p>

        <motion.div
          {...rise(0.55)}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            href="/app"
            className="lp-shimmer group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-lp-primary px-8 py-4 text-lg font-semibold text-white shadow-[0_0_20px_rgba(15,70,243,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(15,70,243,0.6)]"
          >
            <span className="relative z-10">Launch SuperAgent</span>
            <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <span className="lp-card inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-[14px] font-medium text-lp-body dark:text-lp-dark-muted">
            <Lock className="h-4 w-4 text-emerald-500" />
            Vault encrypted on your device
          </span>
        </motion.div>

        <motion.div {...rise(0.7)} className="mt-12 w-full">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lp-body/60 dark:text-lp-dark-muted/70">
            Agencies connected
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {AGENCIES.map((agency) => (
              <li
                key={agency}
                className="lp-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold text-lp-ink dark:text-lp-dark-text"
              >
                <span className="lp-dot-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                {agency}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
