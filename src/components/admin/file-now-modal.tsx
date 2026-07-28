"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, ExternalLink, Loader2, Upload, X } from "lucide-react";
import { ActionButton, Field } from "./ui";
import { formatTravelDate, updateFiling, type ETravelRecord } from "@/lib/etravel";

const ETRAVEL_URL = "https://etravel.gov.ph";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </p>
        <p className="truncate text-[13.5px] font-medium text-zinc-100">{value}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            // Clipboard denied — the value is selectable on screen.
          }
        }}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11.5px] font-semibold text-zinc-400 transition hover:border-white/25 hover:text-white"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/**
 * The step that turns a demo record into a real one.
 *
 * SuperAgent cannot file on etravel.gov.ph unattended, so an operator does it
 * on the agency's own site and records what came back. Everything captured here
 * is an attestation by that person — the app never claims to have checked with
 * the Bureau of Immigration itself.
 */
export function FileNowModal({
  record,
  onClose,
  onFiled,
}: {
  record: ETravelRecord | null;
  onClose: () => void;
  onFiled: () => void;
}) {
  const [govReference, setGovReference] = useState("");
  const [notes, setNotes] = useState("");
  const [qrName, setQrName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function markFiled() {
    const reference = govReference.trim();
    if (!reference) {
      setError("Ilagay ang official reference galing sa eTravel bago i-mark as filed.");
      return;
    }
    setBusy(true);
    setError(null);
    updateFiling(record!.reference, { status: "filing" });
    // Brief pause so the queue visibly moves through FILING.
    await new Promise((r) => setTimeout(r, 900));
    updateFiling(record!.reference, {
      status: "filed",
      govReference: reference,
      filedAt: new Date().toISOString(),
      filedBy: "Owner console",
      qrFileName: qrName || undefined,
      pdfFileName: pdfName || undefined,
      notes: notes.trim() || undefined,
      notified: false,
    });
    setBusy(false);
    setGovReference("");
    setNotes("");
    setQrName("");
    setPdfName("");
    onFiled();
  }

  return (
    <AnimatePresence>
      {record ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="file-now-title"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={busy ? undefined : onClose} aria-hidden />

          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-white/[0.08] bg-[#111113] p-6 shadow-2xl eg-scroll sm:rounded-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 id="file-now-title" className="text-[18px] font-bold tracking-tight text-white">
              File to Bureau of Immigration
            </h2>
            <p className="mt-1.5 font-mono text-[12.5px] text-zinc-500">{record.reference}</p>

            {/* Step 1 */}
            <section className="mt-5 rounded-xl border border-white/[0.07] bg-[#0A0A0B] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0F46F3]">
                Step 1 — open the agency site
              </p>
              <a
                href={ETRAVEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-semibold text-zinc-200 transition hover:border-white/25 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open etravel.gov.ph
              </a>
            </section>

            {/* Step 2 */}
            <section className="mt-3 rounded-xl border border-white/[0.07] bg-[#0A0A0B] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0F46F3]">
                Step 2 — copy the traveller details
              </p>
              <div className="mt-2">
                <CopyRow label="Full name" value={record.travelerName} />
                <CopyRow label="Nationality" value={record.nationality} />
                <CopyRow label="Flight" value={record.flight ?? "Not specified"} />
                <CopyRow label="Departure" value={formatTravelDate(record.departureISO)} />
                <CopyRow label="Destination" value={record.destination} />
                <CopyRow label="Departure port" value={record.port} />
                {record.returnISO ? (
                  <CopyRow label="Return" value={formatTravelDate(record.returnISO)} />
                ) : null}
              </div>
              <p className="mt-2 text-[11.5px] leading-snug text-zinc-500">
                Passport number is not stored by this app — read it from the traveller&apos;s vault
                document or ask them directly.
              </p>
            </section>

            {/* Step 3 */}
            <section className="mt-3 rounded-xl border border-white/[0.07] bg-[#0A0A0B] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0F46F3]">
                Step 3 — record what the agency returned
              </p>
              <div className="mt-3 space-y-3">
                <Field
                  label="Official eTravel reference"
                  value={govReference}
                  onChange={setGovReference}
                  placeholder="ETR-GOV-XXXXXX"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      QR screenshot
                    </span>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-white/[0.12] px-3 py-2.5">
                      <Upload className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setQrName(e.target.files?.[0]?.name ?? "")}
                        className="min-w-0 flex-1 text-[12px] text-zinc-400 file:mr-2 file:rounded-md file:border-0 file:bg-white/[0.06] file:px-2 file:py-1 file:text-[11px] file:text-zinc-300"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      Gov PDF
                    </span>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-white/[0.12] px-3 py-2.5">
                      <Upload className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setPdfName(e.target.files?.[0]?.name ?? "")}
                        className="min-w-0 flex-1 text-[12px] text-zinc-400 file:mr-2 file:rounded-md file:border-0 file:bg-white/[0.06] file:px-2 file:py-1 file:text-[11px] file:text-zinc-300"
                      />
                    </div>
                  </label>
                </div>
                <Field label="Notes" value={notes} onChange={setNotes} placeholder="Optional" />
              </div>
              <p className="mt-2.5 text-[11.5px] leading-snug text-zinc-500">
                Filenames are recorded for the audit trail; the files themselves are not uploaded
                anywhere in this build.
              </p>
            </section>

            {error ? (
              <p className="mt-3 text-[12.5px] font-medium text-rose-400" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <ActionButton onClick={markFiled} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {busy ? "Recording…" : "Mark as filed & notify user"}
              </ActionButton>
              <ActionButton tone="ghost" onClick={onClose} disabled={busy}>
                Cancel
              </ActionButton>
            </div>

            <p className="mt-4 border-t border-white/[0.07] pt-3 text-[11px] leading-relaxed text-zinc-500">
              Marking this filed records your attestation that you completed the filing on
              etravel.gov.ph. It is shown to the traveller as an operator attestation, not as a
              lookup against the Bureau of Immigration.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
