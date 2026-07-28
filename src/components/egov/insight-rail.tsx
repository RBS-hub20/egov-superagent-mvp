"use client";

import { X } from "lucide-react";
import { VaultPreview } from "@/components/vault/vault-preview";
import { AntiFixerReceipt } from "@/components/receipts/anti-fixer-receipt";
import { MemoryGraph } from "./memory-graph";

/**
 * Right rail: what the agent is holding (vault), what it is doing (receipt),
 * and what it knows (memory). Inline on wide screens, a side drawer on tablets,
 * a bottom sheet on phones.
 */
export function InsightRail({
  onClose,
  variant = "rail",
}: {
  onClose?: () => void;
  variant?: "rail" | "sheet";
}) {
  return (
    <div className="eg-surface flex h-full flex-col">
      {onClose ? (
        <div className="relative flex items-center justify-between border-b border-lp-line px-4 py-3 pt-4 dark:border-lp-dark-line xl:hidden">
          {variant === "sheet" ? (
            <span
              className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-lp-line dark:bg-lp-dark-line"
              aria-hidden
            />
          ) : null}
          <p className="text-[13px] font-bold text-lp-ink dark:text-lp-dark-text">
            Vault &amp; receipts
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-md p-1 text-lp-body/60 transition hover:bg-slate-100 hover:text-lp-ink dark:text-lp-dark-muted dark:hover:bg-white/10 dark:hover:text-lp-dark-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex-1 space-y-3 overflow-y-auto p-4 eg-scroll">
        <VaultPreview />
        <AntiFixerReceipt />
        <MemoryGraph />
      </div>
    </div>
  );
}
