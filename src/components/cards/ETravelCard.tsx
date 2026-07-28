"use client";

import { formatTravelDate, type ETravelDraft } from "@/lib/etravel";

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[#0A1931]">{value}</p>
    </div>
  );
}

/**
 * The declaration as it will be filed, shown before anything is submitted.
 *
 * White in both themes on purpose — like the other agency records in this app,
 * this is the document, not the agent talking.
 */
export function ETravelCard({
  data,
  status = "READY TO REVIEW",
}: {
  data: ETravelDraft;
  status?: string;
}) {
  return (
    <article className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
          eTravel Departure — {status}
        </p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#10B981]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          Active
        </span>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#E2E8F0] pt-4">
        <Field label="Traveler" value={`${data.travelerName} • ${data.nationality}`} />
        <Field label="Direction" value={data.direction} />
        <Field label="Route" value={data.route} />
        <Field label="Flight" value={data.flight ?? "Not specified yet"} />
        <Field label="Submission" value={data.submissionStatus} />
        <Field label="Departure port" value={data.port} />
        <Field label="Travel date" value={formatTravelDate(data.departureISO)} wide />
        {data.returnISO ? (
          <Field label="Return date" value={formatTravelDate(data.returnISO)} wide />
        ) : null}
      </dl>
    </article>
  );
}
