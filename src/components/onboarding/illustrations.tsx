"use client";

import { AppIcon } from "@/components/brand/app-icon";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Check, IdCard, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { RECEIPT, peso } from "@/lib/data";

/** Shared stage: fixed height so the slides don't jump as you page through. */
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-[260px] w-full items-center justify-center sm:h-[300px]" aria-hidden>
      <div
        className="pointer-events-none absolute inset-0 rounded-[36px] opacity-70 blur-2xl"
        style={{ background: "radial-gradient(closest-side, rgba(15,70,243,0.14), transparent 75%)" }}
      />
      {children}
    </div>
  );
}

const AGENCIES = ["SSS", "PhilHealth", "Pag-IBIG", "PSA", "Immigration", "DFA"];

/** Slide 1 — one instruction, four agencies handled. */
export function UtusanIllustration() {
  return (
    <Stage>
      <div className="relative flex w-full max-w-sm flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: 24, y: 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="self-end rounded-2xl rounded-br-sm bg-lp-primary px-4 py-2.5 text-[14px] font-medium text-white shadow-[0_14px_34px_-16px_rgba(15,70,243,0.9)]"
        >
          Bayaran mo SSS ko boss
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5 self-start"
        >
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-lp-line bg-white shadow-sm dark:border-lp-dark-line dark:bg-white/[0.08]">
            <AppIcon size={22} />
          </span>
          <span className="rounded-2xl rounded-tl-sm border border-lp-line border-l-2 border-l-lp-primary bg-white px-4 py-2.5 text-[14px] text-lp-ink shadow-sm dark:border-lp-dark-line dark:bg-lp-dark-card dark:text-lp-dark-text">
            Sige boss, ako na.
          </span>
        </motion.div>

        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {AGENCIES.map((agency, i) => (
            <motion.span
              key={agency}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.45 + i * 0.11, type: "spring", stiffness: 260 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-lp-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-lp-ink shadow-sm dark:border-lp-dark-line dark:bg-white/[0.05] dark:text-lp-dark-text"
            >
              <Check className="h-3 w-3 text-emerald-500" />
              {agency}
            </motion.span>
          ))}
        </div>
      </div>
    </Stage>
  );
}

/** Slide 2 — one ID, sealed on the device, reused forever. */
export function VaultIllustration() {
  return (
    <Stage>
      <div className="relative flex w-full max-w-sm flex-col items-center">
        {/* The card drops into the vault. */}
        <motion.div
          initial={{ y: -34, opacity: 0, rotate: -6 }}
          animate={{ y: 6, opacity: 1, rotate: -3 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="z-10 flex w-[190px] items-center gap-2.5 rounded-xl border border-lp-line bg-white px-3 py-2.5 shadow-[0_16px_36px_-20px_rgba(10,25,49,0.6)] dark:border-lp-dark-line dark:bg-lp-dark-card"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lp-primary/10 text-lp-primary">
            <IdCard className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-bold text-lp-ink dark:text-lp-dark-text">
              Valid_ID.jpg
            </span>
            <span className="block text-[9.5px] text-lp-body/60 dark:text-lp-dark-muted/70">
              PhilSys • 1.2 MB
            </span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="-mt-3 w-[240px] rounded-2xl border border-lp-line bg-white p-4 pt-6 shadow-[0_24px_50px_-30px_rgba(10,25,49,0.55)] dark:border-lp-dark-line dark:bg-lp-dark-card"
        >
          <div className="flex items-center justify-center">
            <motion.span
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lp-primary/10 text-lp-primary"
            >
              <Lock className="h-6 w-6" />
            </motion.span>
          </div>
          <p className="mt-2.5 text-center text-[12px] font-bold text-lp-ink dark:text-lp-dark-text">
            Vault
          </p>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 py-1.5 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            AES-GCM 256
          </div>
          {/* Kept inside the card so the fixed-height stage never clips it. */}
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-lp-body/70 dark:text-lp-dark-muted/80">
            <KeyRound className="h-3 w-3 text-lp-yellow" />
            Ikaw lang may susi
          </p>
        </motion.div>
      </div>
    </Stage>
  );
}

/** Slide 3 — the receipt that makes a fixer pointless. */
export function ReceiptIllustration() {
  return (
    <Stage>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[290px] rounded-2xl border border-lp-line bg-white p-5 shadow-[0_26px_60px_-32px_rgba(10,25,49,0.6)] dark:border-lp-dark-line dark:bg-lp-dark-card"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-lp-body/55 dark:text-lp-dark-muted/70">
              Anti-Fixer Receipt
            </p>
            <p className="mt-1 font-mono text-[15px] font-bold text-lp-ink dark:text-lp-dark-text">
              {RECEIPT.trackingNumber}
            </p>
          </div>
          <div className="rounded-lg bg-white p-1 ring-1 ring-lp-line dark:ring-lp-dark-line">
            <QRCodeSVG value={RECEIPT.trackingNumber} size={46} level="M" fgColor="#0A1931" />
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-lp-line pt-3 dark:border-lp-dark-line">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-lp-body/55 dark:text-lp-dark-muted/70">
              Official fee
            </p>
            <p className="text-[20px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text">
              {peso(RECEIPT.officialFee)}
            </p>
          </div>
          <p className="pb-1 text-[12px] font-medium text-lp-body/45 line-through dark:text-lp-dark-muted/60">
            P1,000 fixer
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-3 w-3" />
          </span>
          Verifiable online
        </motion.div>
      </motion.div>
    </Stage>
  );
}
