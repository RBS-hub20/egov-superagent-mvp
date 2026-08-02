"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, BadgeCheck, HelpCircle, Plane, ReceiptText } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LICENSEE } from "@/lib/brand";
import { RECEIPT, peso, phDate } from "@/lib/data";
import { findByReference, formatTravelDate, type ETravelRecord } from "@/lib/etravel";

type Result =
  | { kind: "etravel"; record: ETravelRecord }
  | { kind: "receipt" }
  | { kind: "unknown" }
  | { kind: "loading" };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-lp-line py-3 first:border-t-0 dark:border-lp-dark-line">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-lp-body/55 dark:text-lp-dark-muted/70">
        {label}
      </p>
      <p className="mt-1 text-[14px] font-semibold text-lp-ink dark:text-lp-dark-text">{value}</p>
    </div>
  );
}

export function VerifyRecord({ id }: { id: string }) {
  const [result, setResult] = useState<Result>({ kind: "loading" });
  const reference = decodeURIComponent(id).trim().toUpperCase();

  useEffect(() => {
    // Records live in the browser that created them — there is no server to ask.
    if (reference.startsWith("ETR-PH-")) {
      const record = findByReference(reference);
      setResult(record ? { kind: "etravel", record } : { kind: "unknown" });
      return;
    }
    if (reference === RECEIPT.trackingNumber.toUpperCase()) {
      setResult({ kind: "receipt" });
      return;
    }
    setResult({ kind: "unknown" });
  }, [reference]);

  return (
    <div className="lp-canvas min-h-[100dvh]">
      <header className="flex items-center justify-between px-5 py-4 sm:px-6">
        <Link href="/" aria-label="eGov SuperAgent home">
          <BrandLockup size={28} priority />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line px-3 py-2 text-[13px] font-semibold text-lp-body transition hover:border-lp-primary/40 hover:text-lp-ink dark:border-lp-dark-line dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Console
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-5 pb-16 pt-4 sm:px-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-lp-primary">
          Record check
        </p>
        <h1 className="mt-2 break-all font-mono text-[24px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text">
          {reference}
        </h1>

        {result.kind === "loading" ? (
          <p className="mt-6 text-[14px] text-lp-body dark:text-lp-dark-muted">Checking…</p>
        ) : null}

        {result.kind === "etravel" ? (
          <>
            {result.record.filing?.status === "filed" ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-[12.5px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400">
                <BadgeCheck className="h-4 w-4" />
                Filed with the Bureau of Immigration
              </div>
            ) : (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-[12.5px] font-bold text-amber-700 ring-1 ring-inset ring-amber-500/25 dark:text-amber-400">
                <HelpCircle className="h-4 w-4" />
                Demo record — not filed yet
              </div>
            )}

            <section className="mt-5 rounded-2xl border border-lp-line bg-white p-5 dark:border-lp-dark-line dark:bg-lp-dark-card">
              <div className="flex items-center gap-2 pb-3">
                <Plane className="h-4 w-4 text-lp-primary" />
                <p className="text-[13px] font-bold text-lp-ink dark:text-lp-dark-text">
                  eTravel departure declaration
                </p>
              </div>
              <Row label="Traveler" value={`${result.record.travelerName} • ${result.record.nationality}`} />
              <Row label="Direction" value={result.record.direction} />
              <Row label="Route" value={result.record.route} />
              <Row label="Flight" value={result.record.flight ?? "Not specified"} />
              <Row label="Travel date" value={formatTravelDate(result.record.departureISO)} />
              {result.record.returnISO ? (
                <Row label="Return date" value={formatTravelDate(result.record.returnISO)} />
              ) : null}
              <Row label="Departure port" value={result.record.port} />
              {result.record.filing?.status === "filed" ? (
                <>
                  <Row
                    label="Official reference"
                    value={result.record.filing.govReference ?? "—"}
                  />
                  <Row
                    label="Filed"
                    value={
                      result.record.filing.filedAt
                        ? `${formatTravelDate(result.record.filing.filedAt)} • ${result.record.filing.filedBy ?? "operator"}`
                        : "—"
                    }
                  />
                </>
              ) : null}

              <div className="mt-4 flex justify-center border-t border-lp-line pt-4 dark:border-lp-dark-line">
                <div className="rounded-xl bg-white p-2 ring-1 ring-lp-line dark:ring-lp-dark-line">
                  <QRCodeSVG value={result.record.reference} size={116} level="M" fgColor="#0A1931" />
                </div>
              </div>
            </section>

            <p className="mt-4 text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-lp-body/60 dark:text-lp-dark-muted/70">
              Bureau of Immigration lane • Built by {LICENSEE.short}
            </p>

            {result.record.filing?.status === "filed" ? (
              <p className="mt-3 rounded-xl bg-emerald-500/[0.07] p-3 text-[12px] leading-relaxed text-emerald-800 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-400">
                An AXLA operator recorded that this declaration was filed on etravel.gov.ph under
                reference {result.record.filing.govReference}. That is their attestation — this page
                does not query the Bureau of Immigration. Check the official reference on the
                agency&apos;s own site before you travel.
              </p>
            ) : null}
          </>
        ) : null}

        {result.kind === "receipt" ? (
          <>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-[12.5px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400">
              <BadgeCheck className="h-4 w-4" />
              Known demo receipt
            </div>

            <section className="mt-5 rounded-2xl border border-lp-line bg-white p-5 dark:border-lp-dark-line dark:bg-lp-dark-card">
              <div className="flex items-center gap-2 pb-3">
                <ReceiptText className="h-4 w-4 text-lp-primary" />
                <p className="text-[13px] font-bold text-lp-ink dark:text-lp-dark-text">
                  Anti-Fixer Receipt
                </p>
              </div>
              <Row label="Agency" value={RECEIPT.agency} />
              <Row label="Service" value={RECEIPT.service} />
              <Row label="Stage" value={`${RECEIPT.stage} • ${RECEIPT.progress}%`} />
              <Row label="Official fee" value={peso(RECEIPT.officialFee)} />
              <Row label="Ready by" value={phDate(RECEIPT.etaDate)} />
            </section>
          </>
        ) : null}

        {result.kind === "unknown" ? (
          <>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-[12.5px] font-bold text-amber-700 ring-1 ring-inset ring-amber-500/25 dark:text-amber-400">
              <HelpCircle className="h-4 w-4" />
              Not found on this device
            </div>
            <p className="mt-4 text-[14.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
              This MVP keeps every record in the browser that created it — there is no server to
              ask. Open this link on the device that produced the declaration, or file a new one in
              the console.
            </p>
            <Link
              href="/app"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-lp-primary px-5 py-3 text-[14px] font-semibold text-white transition hover:scale-[1.01]"
            >
              Open the console
            </Link>
          </>
        ) : null}

        <p className="mt-10 border-t border-lp-line pt-5 text-[11.5px] leading-relaxed text-lp-body/60 dark:border-lp-dark-line dark:text-lp-dark-muted/70">
          Records live in the browser that created them; this page reads that store rather than an
          agency system. Anything not marked as filed by an operator was generated for
          demonstration and was never submitted to any agency. Built by {LICENSEE.short}.
        </p>
      </main>
    </div>
  );
}
