"use client";

import { useState } from "react";
import { AppIcon } from "@/components/brand/app-icon";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, BellRing, Check, Copy, ExternalLink, FileText, Loader2 } from "lucide-react";
import { ETravelCard } from "./ETravelCard";
import { LICENSEE } from "@/lib/brand";
import {
  ETRAVEL,
  formatShortDate,
  formatTime,
  submitETravel,
  type ETravelDraft,
  type ETravelSubmission,
} from "@/lib/etravel";

/** "✓ Completed 6 steps across 6 agencies • 9.4s" with the steps behind a toggle. */
function StepSummary() {
  const [open, setOpen] = useState(false);
  const agencies = new Set(ETRAVEL.steps.map((s) => s.agency)).size;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-lp-line bg-white px-3 py-1.5 text-[12px] font-medium text-lp-body transition hover:border-lp-primary/40 hover:text-lp-ink dark:border-lp-dark-line dark:bg-white/[0.04] dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
      >
        <AppIcon size={16} />
        <Check className="h-3.5 w-3.5 text-emerald-500" />
        Completed {ETRAVEL.steps.length} steps across {agencies} agencies •{" "}
        {ETRAVEL.elapsedSeconds}s
      </button>

      {open ? (
        <motion.ol
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2.5 space-y-1.5 overflow-hidden border-l border-lp-line pl-3 dark:border-lp-dark-line"
        >
          {ETRAVEL.steps.map((step) => (
            <li key={step.key} className="flex gap-2 text-[12px] leading-snug">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
              <span>
                <span className="font-semibold text-lp-ink dark:text-lp-dark-text">
                  {step.label}
                </span>
                <span className="text-lp-body/70 dark:text-lp-dark-muted/80"> — {step.detail}</span>
              </span>
            </li>
          ))}
          <li className="flex gap-2 border-t border-lp-line pt-1.5 text-[12px] leading-snug dark:border-lp-dark-line">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
            <span className="text-lp-body/70 dark:text-lp-dark-muted/80">
              {ETRAVEL.receiptNote}
            </span>
          </li>
        </motion.ol>
      ) : null}
    </div>
  );
}

function CopyLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard denied — the value is on screen either way.
        }
      }}
      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-lp-body/70 transition hover:text-lp-primary dark:text-lp-dark-muted/80"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ETravelFlow({ draft }: { draft: ETravelDraft }) {
  const [state, setState] = useState<"review" | "filing" | "registered">("review");
  const [result, setResult] = useState<ETravelSubmission | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  async function submit() {
    setState("filing");
    const submission = await submitETravel(draft);
    setResult(submission);
    setState("registered");
  }

  async function openPdf() {
    // Built on demand so the heavy PDF code stays out of the first load.
    const { buildETravelPdfUrl } = await import("@/lib/etravel-pdf");
    const url = pdfUrl ?? buildETravelPdfUrl(draft, result!);
    setPdfUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (state !== "registered" || !result) {
    return (
      <div className="space-y-3">
        <StepSummary />
        <h3 className="text-[20px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text">
          eTravel Declaration Setup
        </h3>
        <p className="text-[14.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
          Nakuha ko na ang trip details mo para sa{" "}
          <span className="font-semibold text-lp-ink dark:text-lp-dark-text">
            {draft.destination}
          </span>
          . Pakitingnan bago ko isumite:
        </p>

        <ETravelCard data={draft} />

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={submit}
            disabled={state === "filing"}
            className="inline-flex items-center gap-2 rounded-full bg-lp-primary px-5 py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_-8px_rgba(15,70,243,0.8)] transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-80"
          >
            {state === "filing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Ini-file ko na sa eTravel…
              </>
            ) : (
              <>
                Submit my eTravel declaration
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <CopyLine
            text={`${draft.travelerName} • ${draft.route} • ${draft.flight ?? "no flight"} • ${draft.departureISO ?? "no date"}`}
          />
        </div>
      </div>
    );
  }

  const { record, reference, qrPayload } = result;

  return (
    <div className="space-y-3">
      <StepSummary />

      <p className="text-[14.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
        Tapos na boss — <span className="font-semibold text-lp-ink dark:text-lp-dark-text">your
        eTravel declaration is registered.</span> A downloadable QR record has been issued for your
        departure to {record.destination} on {formatShortDate(record.departureISO)} at{" "}
        {formatTime(record.departureISO)} via {record.flight ?? "your flight"}. Itago mo lang ang QR
        na ito para sa immigration clearance.
        {record.returnISO
          ? ` Naka-note na rin ang balik mo sa ${formatShortDate(record.returnISO)}.`
          : ""}
      </p>

      <div className="rounded-2xl border border-lp-line bg-white p-4 dark:border-lp-dark-line dark:bg-lp-dark-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lp-body/60 dark:text-lp-dark-muted/70">
          Next steps
        </p>
        <ol className="mt-2 space-y-1.5">
          {ETRAVEL.nextSteps.map((step, i) => (
            <li key={step} className="flex gap-2.5 text-[13.5px] leading-snug">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lp-primary/10 text-[11px] font-bold text-lp-primary">
                {i + 1}
              </span>
              <span className="text-lp-body dark:text-lp-dark-muted">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 flex items-start gap-2 border-t border-lp-line pt-3 text-[12.5px] leading-snug text-lp-body/80 dark:border-lp-dark-line dark:text-lp-dark-muted/80">
          <BellRing className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lp-yellow" />
          {ETRAVEL.reminder}
        </p>
      </div>

      {/* The issued file */}
      <div className="flex items-center gap-3 rounded-2xl border border-lp-line bg-white p-4 dark:border-lp-dark-line dark:bg-lp-dark-card">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lp-primary/10 text-lp-primary">
          <FileText className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-bold text-lp-ink dark:text-lp-dark-text">
            eTravel QR Declaration.pdf
          </p>
          <p className="text-[11.5px] text-lp-body/70 dark:text-lp-dark-muted/80">
            Generated on this device • {reference}
          </p>
        </div>
        <button
          type="button"
          onClick={openPdf}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-lp-line px-3 py-1.5 text-[12px] font-semibold text-lp-body transition hover:border-lp-primary/50 hover:text-lp-primary dark:border-lp-dark-line dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open file
        </button>
      </div>

      {/* The registered QR record */}
      <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            eTravel QR — Registered
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#10B981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            Active
          </span>
        </header>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-5 border-t border-[#E2E8F0] pt-4">
          <div className="min-w-[150px] space-y-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                Reference
              </p>
              <p className="mt-1 font-mono text-[14px] font-bold text-[#0A1931]">{reference}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                Direction
              </p>
              <p className="mt-1 text-[13.5px] font-semibold text-[#0A1931]">{record.direction}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                Flight
              </p>
              <p className="mt-1 text-[13.5px] font-semibold text-[#0A1931]">
                {record.flight ?? "—"} • {formatTime(record.departureISO)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-xl bg-white p-2 ring-1 ring-[#E2E8F0]">
              <QRCodeSVG value={qrPayload} size={104} level="M" fgColor="#0A1931" />
            </div>
            <Link
              href={`/verify/${reference}`}
              className="text-[11px] font-semibold text-lp-primary hover:underline"
            >
              Verify this record
            </Link>
          </div>
        </div>

        <p className="mt-4 border-t border-[#E2E8F0] pt-3 text-[10px] uppercase tracking-[0.12em] text-[#94A3B8]">
          Built by {LICENSEE.short} • Demo record, not filed with any agency
        </p>
      </article>
    </div>
  );
}
