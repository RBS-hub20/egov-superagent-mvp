"use client";

import { motion } from "framer-motion";
import { Check, KeyRound, ReceiptText, ShieldCheck } from "lucide-react";
import { RECEIPT, peso, phDate } from "@/lib/data";
import { shortNameOf, useUser } from "@/lib/user";

const POINTS = [
  {
    icon: KeyRound,
    title: "Encrypted on your device",
    body: "IDs are sealed with AES-GCM 256 through Web Crypto and stored in IndexedDB. The key is non-extractable and never leaves the browser.",
  },
  {
    icon: ReceiptText,
    title: "Every peso accounted for",
    body: "Each filing carries a tracking number, the official fee, and a timestamped trail. If it is not on the receipt, nobody was paid for it.",
  },
  {
    icon: ShieldCheck,
    title: "No fixer, ever",
    body: "SuperAgent transacts only through official channels and shows you the queue position instead of selling you a shortcut.",
  },
];

export function TrustReceipt() {
  // The audit line carries a {name} placeholder so it can name whoever is
  // connected — "you" until someone is.
  const filedFor = shortNameOf(useUser());

  return (
    <section id="trust" className="relative px-5 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-lp-primary">
            Trust
          </p>
          <h2 className="mt-3 text-balance text-[34px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text sm:text-[42px]">
            The Anti-Fixer Receipt.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
            Fixers thrive where there is no paper trail. So every action SuperAgent takes on your
            behalf produces one — visible to you, in real time, from filing to pickup.
          </p>

          <ul className="mt-9 space-y-6">
            {POINTS.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lp-primary/10 text-lp-primary">
                  <point.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[16px] font-bold text-lp-ink dark:text-lp-dark-text">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Live receipt, rendered from the same fixture the console uses. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative"
        >
          <div
            className="pointer-events-none absolute -inset-6 rounded-[32px] opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(15,70,243,0.22), transparent 70%)" }}
            aria-hidden
          />

          <div className="lp-card relative rounded-2xl p-6 shadow-[0_30px_80px_-40px_rgba(10,25,49,0.5)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-[14px] font-bold text-lp-ink dark:text-lp-dark-text">
                <ReceiptText className="h-4 w-4 text-lp-primary" />
                Anti-Fixer Receipt
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <p className="mt-4 font-mono text-[19px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text">
              {RECEIPT.trackingNumber}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5">
              {[
                ["Agency", RECEIPT.agency],
                ["Requested", RECEIPT.requestedLabel],
                ["ETA", `${RECEIPT.etaLabel} • ${phDate(RECEIPT.etaDate)}`],
                ["Official fee", peso(RECEIPT.officialFee)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-lp-body/55 dark:text-lp-dark-muted/70">
                    {label}
                  </dt>
                  <dd className="mt-1 text-[14px] font-semibold text-lp-ink dark:text-lp-dark-text">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-semibold text-lp-primary">{RECEIPT.stage}</span>
                <span className="tabular-nums text-lp-body/70 dark:text-lp-dark-muted">
                  {RECEIPT.progress}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-lp-line dark:bg-lp-dark-line">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${RECEIPT.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-lp-primary to-emerald-400"
                />
              </div>
            </div>

            <ol className="mt-5 space-y-2.5 border-t border-lp-line pt-4 dark:border-lp-dark-line">
              {RECEIPT.auditTrail.map((entry) => (
                <li key={entry.at} className="flex gap-3 text-[12.5px] leading-snug">
                  <span className="shrink-0 font-mono text-lp-body/50 dark:text-lp-dark-muted/70">
                    {entry.at}
                  </span>
                  <span className="text-lp-body dark:text-lp-dark-muted">
                    {entry.event.replace("{name}", filedFor)}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-5 flex items-start gap-2 rounded-xl bg-emerald-500/[0.07] p-3 text-[12px] leading-snug text-emerald-700 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-400">
              <Check className="mt-px h-3.5 w-3.5 shrink-0" />
              All actions logged, no fixer. Official fees only — {RECEIPT.paidTo}.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
