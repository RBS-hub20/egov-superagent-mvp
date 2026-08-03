"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, ExternalLink, Loader2, Upload, X } from "lucide-react";
import { ActionButton, Field } from "./ui";
import { formatTravelDate } from "@/lib/etravel";
import { adminMarkFiled, type ETravelOrder } from "@/lib/etravel-orders";

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

function FilePicker({
  label,
  accept,
  file,
  onPick,
}: {
  label: string;
  accept: string;
  file: File | null;
  onPick: (f: File | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-white/[0.12] px-3 py-2.5">
        <Upload className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
        <input
          type="file"
          accept={accept}
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          className="min-w-0 flex-1 text-[12px] text-zinc-400 file:mr-2 file:rounded-md file:border-0 file:bg-white/[0.06] file:px-2 file:py-1 file:text-[11px] file:text-zinc-300"
        />
      </div>
      {file ? (
        <span className="mt-1 block truncate text-[11px] text-zinc-500">
          {file.name} • {(file.size / 1024).toFixed(0)} KB
        </span>
      ) : null}
    </label>
  );
}

/**
 * The step that turns a pending declaration into a filed one.
 *
 * SuperAgent cannot file on etravel.gov.ph unattended, so an operator does it
 * on the agency's own site and records what came back. Everything captured here
 * is an attestation by that person — the app never claims to have checked with
 * the Bureau of Immigration itself.
 */
export function FileNowModal({
  order,
  onClose,
  onFiled,
}: {
  order: ETravelOrder | null;
  onClose: () => void;
  onFiled: () => void;
}) {
  const [officialRef, setOfficialRef] = useState("");
  const [notes, setNotes] = useState("");
  const [qr, setQr] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-opening on a different traveller must not inherit the last one's fields.
  useEffect(() => {
    setOfficialRef(order?.official_ref ?? "");
    setNotes(order?.notes ?? "");
    setQr(null);
    setPdf(null);
    setError(null);
  }, [order]);

  async function markFiled() {
    if (!order) return;
    const reference = officialRef.trim();
    if (!reference) {
      setError("Ilagay ang official reference galing sa eTravel bago i-mark as filed.");
      return;
    }
    setBusy(true);
    setError(null);
    const updated = await adminMarkFiled({
      id: order.id,
      ref: order.ref,
      official_ref: reference,
      notes: notes.trim() || undefined,
      qr,
      pdf,
    });
    setBusy(false);
    if (!updated) {
      setError("Hindi na-save. Tingnan ang connection at subukan ulit.");
      return;
    }
    onFiled();
  }

  return (
    <AnimatePresence>
      {order ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="file-now-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={busy ? undefined : onClose}
            aria-hidden
          />

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
            <p className="mt-1.5 font-mono text-[12.5px] text-zinc-500">{order.ref}</p>

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
                <CopyRow label="Full name" value={order.traveler_name} />
                <CopyRow label="Passport number" value={order.passport_no ?? "Not provided"} />
                <CopyRow label="Flight" value={order.flight_no ?? "Not specified"} />
                <CopyRow label="Departure" value={formatTravelDate(order.departure_date)} />
                <CopyRow label="Departure port" value={order.departure_airport} />
                <CopyRow label="Destination" value={order.destination} />
              </div>
            </section>

            {/* Step 3 */}
            <section className="mt-3 rounded-xl border border-white/[0.07] bg-[#0A0A0B] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0F46F3]">
                Step 3 — record what the agency returned
              </p>
              <div className="mt-3 space-y-3">
                <Field
                  label="Official eTravel reference"
                  value={officialRef}
                  onChange={setOfficialRef}
                  placeholder="ETR-GOV-XXXXXX"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <FilePicker label="QR screenshot" accept="image/*" file={qr} onPick={setQr} />
                  <FilePicker
                    label="Gov PDF"
                    accept="application/pdf"
                    file={pdf}
                    onPick={setPdf}
                  />
                </div>
                <Field label="Notes" value={notes} onChange={setNotes} placeholder="Optional" />
              </div>
              <p className="mt-2.5 text-[11.5px] leading-snug text-zinc-500">
                Uploads go to a private bucket; the traveller sees them through short-lived signed
                links, never a public URL.
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
