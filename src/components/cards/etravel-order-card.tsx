"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  BadgeCheck,
  BellRing,
  Check,
  Clock,
  ExternalLink,
  FileText,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { AppIcon } from "@/components/brand/app-icon";
import { LICENSEE } from "@/lib/brand";
import { ETRAVEL, formatShortDate, formatTime, formatTravelDate } from "@/lib/etravel";
import {
  getOrder,
  subscribeOrders,
  verifyPath,
  type ETravelOrder,
} from "@/lib/etravel-orders";

/** "✓ Prepared 6 steps across 6 agencies • 9.4s" with the steps behind a toggle. */
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
        Prepared {ETRAVEL.steps.length} steps across {agencies} agencies • {ETRAVEL.elapsedSeconds}s
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
            <span className="text-lp-body/70 dark:text-lp-dark-muted/80">{ETRAVEL.receiptNote}</span>
          </li>
        </motion.ol>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[#0A1931]">{value}</p>
    </div>
  );
}

function StatusPill({ order }: { order: ETravelOrder }) {
  if (order.status === "FILED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-500/25">
        <BadgeCheck className="h-3.5 w-3.5" />
        Filed
      </span>
    );
  }
  if (order.status === "FILING") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700 ring-1 ring-inset ring-blue-500/25">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Filing now
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-500/25">
      <Clock className="h-3.5 w-3.5" />
      Pending filing
    </span>
  );
}

/**
 * A live view of one declaration in the queue.
 *
 * It re-reads the order whenever anything changes server-side, so the traveller
 * watches PENDING become FILED without refreshing. Until an operator files it,
 * this card says pending — it never shows a QR as if the agency had issued one.
 */
export function ETravelOrderCard({
  initial,
  accessKey,
}: {
  initial: ETravelOrder;
  accessKey: string;
}) {
  const [order, setOrder] = useState(initial);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const refresh = useCallback(() => {
    void getOrder(initial.ref, accessKey).then((next) => {
      if (next) setOrder(next);
    });
  }, [initial.ref, accessKey]);

  useEffect(() => subscribeOrders(refresh), [refresh]);

  const link = verifyPath(order, accessKey);
  const verifyUrl = typeof window === "undefined" ? link : `${window.location.origin}${link}`;

  async function openPdf() {
    // Loaded on demand so jsPDF stays out of the console's first load.
    const { buildETravelPdfUrl } = await import("@/lib/etravel-pdf");
    const url = pdfUrl ?? buildETravelPdfUrl(order, verifyUrl);
    setPdfUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-3">
      <StepSummary />

      <article className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            eTravel departure declaration
          </p>
          <StatusPill order={order} />
        </header>

        <p className="mt-3 font-mono text-[18px] font-bold tracking-tight text-[#0A1931]">
          {order.ref}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#E2E8F0] pt-4">
          <Row label="Traveler" value={order.traveler_name} />
          <Row label="Passport" value={order.passport_no ?? "Not provided"} />
          <Row label="Flight" value={order.flight_no ?? "Not specified"} />
          <Row label="Destination" value={order.destination} />
          <Row label="Departure port" value={order.departure_airport} />
          <Row
            label="Departure"
            value={
              order.departure_date
                ? `${formatShortDate(order.departure_date)} ${formatTime(order.departure_date)}`
                : "Not specified"
            }
          />
          {order.status === "FILED" ? (
            <>
              <Row label="Official reference" value={order.official_ref ?? "—"} />
              <Row
                label="Filed"
                value={order.filed_at ? formatTravelDate(order.filed_at) : "—"}
              />
            </>
          ) : null}
        </dl>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#E2E8F0] pt-4">
          <div className="min-w-[180px] flex-1">
            {order.status === "FILED" ? (
              <p className="text-[12.5px] leading-relaxed text-[#475569]">
                An {LICENSEE.short} operator recorded that this was filed on etravel.gov.ph under{" "}
                <span className="font-semibold text-[#0A1931]">{order.official_ref}</span>. Show the
                official QR at the counter.
              </p>
            ) : (
              <p className="text-[12.5px] leading-relaxed text-[#475569]">
                Nasa queue ka na. Ang operator ang mag-fa-file nito sa etravel.gov.ph at dito rin
                lalabas ang official reference at QR — hindi pa ito filed ngayon.
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openPdf}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-[12px] font-semibold text-[#475569] transition hover:border-lp-primary/50 hover:text-lp-primary"
              >
                <FileText className="h-3.5 w-3.5" />
                Declaration summary
              </button>
              {order.pdf_url ? (
                <a
                  href={order.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-[12px] font-semibold text-[#475569] transition hover:border-lp-primary/50 hover:text-lp-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Agency PDF
                </a>
              ) : null}
              {order.qr_url ? (
                <a
                  href={order.qr_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-[12px] font-semibold text-[#475569] transition hover:border-lp-primary/50 hover:text-lp-primary"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Official QR
                </a>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            {/* Scans to this record's own page — not to anything at the agency. */}
            <div className="rounded-xl bg-white p-2 ring-1 ring-[#E2E8F0]">
              <QRCodeSVG value={verifyUrl} size={104} level="M" fgColor="#0A1931" />
            </div>
            <Link href={link} className="text-[11px] font-semibold text-lp-primary hover:underline">
              Verify this record
            </Link>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 border-t border-[#E2E8F0] pt-3 text-[12px] leading-snug text-[#64748B]">
          <BellRing className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lp-yellow" />
          {ETRAVEL.reminder}
        </p>
      </article>
    </div>
  );
}
