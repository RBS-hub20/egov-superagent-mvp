"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Plane, ReceiptText, ScrollText, X } from "lucide-react";
import { RECEIPT } from "@/lib/data";
import { formatShortDate, readHistory, type ETravelRecord } from "@/lib/etravel";
import { shortNameOf, useUser } from "@/lib/user";

/**
 * Everything the agent has done on this device: eTravel declarations it has
 * registered, plus the audit trail behind the open receipt.
 */
export function LogsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useUser();
  const [records, setRecords] = useState<ETravelRecord[]>([]);

  useEffect(() => {
    if (open) setRecords(readHistory());
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logs-title"
        >
          <div
            className="absolute inset-0 bg-lp-ink/40 backdrop-blur-sm dark:bg-black/65"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="eg-surface relative max-h-[86dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-lp-line p-6 shadow-2xl eg-scroll dark:border-lp-dark-line sm:rounded-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-lp-body/50 transition hover:bg-slate-100 hover:text-lp-ink dark:text-lp-dark-muted dark:hover:bg-white/10 dark:hover:text-lp-dark-text"
            >
              <X className="h-4 w-4" />
            </button>

            <h2
              id="logs-title"
              className="flex items-center gap-2 text-[18px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text"
            >
              <ScrollText className="h-4.5 w-4.5 text-lp-primary" />
              Activity logs
            </h2>
            <p className="mt-1.5 text-[13px] text-lp-body dark:text-lp-dark-muted">
              Nasa device mo lang ito — walang kopya sa server.
            </p>

            <section className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lp-body/55 dark:text-lp-dark-muted/70">
                eTravel declarations
              </p>
              {records.length === 0 ? (
                <p className="mt-2 rounded-xl border border-dashed border-lp-line p-4 text-center text-[13px] text-lp-body/70 dark:border-lp-dark-line dark:text-lp-dark-muted/80">
                  Wala pa. Subukan mo: “flying to Singapore tomorrow at 3pm on PR510”.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {records.map((record) => (
                    <li
                      key={record.reference}
                      className="flex items-center gap-3 rounded-xl border border-lp-line bg-white p-3 dark:border-lp-dark-line dark:bg-white/[0.03]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lp-primary/10 text-lp-primary">
                        <Plane className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-[12.5px] font-bold text-lp-ink dark:text-lp-dark-text">
                          {record.reference}
                        </p>
                        <p className="truncate text-[11.5px] text-lp-body/70 dark:text-lp-dark-muted/80">
                          {record.route} • {record.flight ?? "no flight"} •{" "}
                          {formatShortDate(record.departureISO)}
                        </p>
                      </div>
                      <Link
                        href={`/verify/${record.reference}`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-lp-line px-2.5 py-1.5 text-[11.5px] font-semibold text-lp-body transition hover:border-lp-primary/50 hover:text-lp-primary dark:border-lp-dark-line dark:text-lp-dark-muted"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Verify
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lp-body/55 dark:text-lp-dark-muted/70">
                Anti-Fixer Receipt • {RECEIPT.trackingNumber}
              </p>
              <ol className="mt-2 space-y-2 rounded-xl border border-lp-line bg-white p-3 dark:border-lp-dark-line dark:bg-white/[0.03]">
                {RECEIPT.auditTrail.map((entry) => (
                  <li key={entry.at} className="flex gap-2.5 text-[12px] leading-snug">
                    <span className="shrink-0 font-mono text-lp-body/50 dark:text-lp-dark-muted/70">
                      {entry.at}
                    </span>
                    <span className="text-lp-body dark:text-lp-dark-muted">
                      {entry.event.replace("{name}", shortNameOf(user))}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <p className="mt-5 flex items-start gap-1.5 text-[11px] leading-snug text-lp-body/55 dark:text-lp-dark-muted/70">
              <ReceiptText className="mt-px h-3 w-3 shrink-0" />
              Demo records generated on this device. Nothing here was filed with a real agency.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
