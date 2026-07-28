"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Copy, ReceiptText, ShieldCheck } from "lucide-react";
import { RECEIPT, peso, phDate } from "@/lib/data";
import { shortNameOf, useUser } from "@/lib/user";
import { LICENSEE } from "@/lib/brand";

export function AntiFixerReceipt() {
  const user = useUser();
  const filedFor = shortNameOf(user);
  const [escalated, setEscalated] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyTracking() {
    try {
      await navigator.clipboard.writeText(RECEIPT.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard denied — the number is on screen anyway.
    }
  }

  return (
    <section className="eg-panel eg-receipt-glow rounded-2xl p-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[13px] font-bold text-lp-ink dark:text-lp-dark-text">
          <ReceiptText className="h-3.5 w-3.5 text-lp-primary" />
          Anti-Fixer Receipt
        </h2>
        <button
          type="button"
          onClick={copyTracking}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-lp-body/60 transition hover:bg-slate-100 hover:text-lp-ink dark:text-lp-dark-muted/70 dark:hover:bg-white/[0.06] dark:hover:text-lp-dark-text"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy #"}
        </button>
      </header>

      <p className="mt-3 font-mono text-[15px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text">
        {RECEIPT.trackingNumber}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
        {[
          ["Agency", RECEIPT.agency],
          ["Requested", RECEIPT.requestedLabel],
          ["ETA", `${RECEIPT.etaLabel} • ${phDate(RECEIPT.etaDate)}`],
          ["Official fee", peso(RECEIPT.officialFee)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-lp-body/55 dark:text-lp-dark-muted/70">
              {label}
            </dt>
            <dd className="mt-0.5 text-[12.5px] font-semibold text-lp-ink dark:text-lp-dark-text">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-lp-primary">{RECEIPT.stage}</span>
          <span className="tabular-nums text-lp-body/70 dark:text-lp-dark-muted">
            {RECEIPT.progress}%
          </span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-lp-line dark:bg-lp-dark-line">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${RECEIPT.progress}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-lp-primary to-emerald-400"
          />
        </div>
      </div>

      <ol className="mt-4 space-y-2 border-t border-lp-line pt-3 dark:border-lp-dark-line">
        {RECEIPT.auditTrail.map((entry) => (
          <li key={entry.at} className="flex gap-2.5 text-[11.5px] leading-snug">
            <span className="shrink-0 font-mono text-lp-body/50 dark:text-lp-dark-muted/70">
              {entry.at}
            </span>
            <span className="text-lp-body dark:text-lp-dark-muted">
              {entry.event.replace("{name}", filedFor)}
            </span>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => setEscalated(true)}
        disabled={escalated}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-[12.5px] font-bold text-amber-800 transition hover:bg-amber-100 disabled:cursor-default disabled:border-emerald-300 disabled:bg-emerald-50 disabled:text-emerald-700 dark:border-lp-yellow/35 dark:bg-lp-yellow/10 dark:text-lp-yellow dark:hover:bg-lp-yellow/20 dark:disabled:border-emerald-500/30 dark:disabled:bg-emerald-500/10 dark:disabled:text-emerald-400"
      >
        {escalated ? <Check className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
        {escalated ? "Escalated — agency notified" : "Escalate"}
      </button>

      <p className="mt-2.5 flex items-start gap-1.5 text-[10.5px] leading-snug text-lp-body/60 dark:text-lp-dark-muted/70">
        <ShieldCheck className="mt-px h-3 w-3 shrink-0 text-emerald-500" />
        All actions logged, no fixer. Official fees only — {RECEIPT.paidTo}.
      </p>
      <p className="mt-1.5 text-[10px] uppercase tracking-[0.12em] text-lp-body/45 dark:text-lp-dark-muted/60">
        Powered by {LICENSEE.short} • Official fee only
      </p>
    </section>
  );
}
