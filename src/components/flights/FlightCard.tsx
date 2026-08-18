"use client";

import { ArrowRight, Loader2, Plane, ShieldCheck } from "lucide-react";
import {
  duration,
  peso,
  type FlightOffer,
  ETRAVEL_BUNDLE_VALUE_PHP,
} from "@/lib/flights/catalog";

/**
 * One sample fare.
 *
 * Glass over the console's dark chrome, matching the eTravel queue's panels.
 * The bundled declaration is the point of the card, so it sits next to the
 * price rather than under a fold.
 */
export function FlightCard({
  offer,
  busy = false,
  onBook,
}: {
  offer: FlightOffer;
  busy?: boolean;
  onBook: (offer: FlightOffer) => void;
}) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-28px_rgba(0,0,0,0.8)] backdrop-blur-[2px] transition-colors hover:border-white/[0.16]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F46F3]/15 text-[#7EA6FF]">
            <Plane className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-white">{offer.airline}</p>
            <p className="mt-0.5 font-mono text-[12px] text-zinc-500">{offer.flightNo}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[22px] font-bold tracking-tight text-white">{peso(offer.totalPrice)}</p>
          <p className="mt-0.5 text-[11.5px] text-zinc-500">
            {peso(offer.basePrice)} fare + {peso(offer.markup)} service
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-[16px] font-semibold text-white">{offer.departTime}</p>
            <p className="mt-0.5 font-mono text-[11px] text-zinc-500">{offer.origin}</p>
          </div>
          <div className="flex flex-col items-center px-1">
            <span className="text-[10.5px] text-zinc-500">{duration(offer.durationMinutes)}</span>
            <span className="my-1 h-px w-16 bg-white/15" aria-hidden />
            <span className="text-[10.5px] text-zinc-500">
              {offer.stops === 0 ? "Direct" : `${offer.stops} stop`}
            </span>
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-white">{offer.arriveTime}</p>
            <p className="mt-0.5 font-mono text-[11px] text-zinc-500">{offer.destination}</p>
          </div>
        </div>

        {offer.saveVsOthers > 0 ? (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-3 py-1 text-[11.5px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
            {peso(offer.saveVsOthers)} below the {peso(offer.comparisonPrice)} sample fare
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FFC300]/25 bg-[#FFC300]/[0.06] px-4 py-3">
        <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#FFC300]">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          FREE eTravel included — save {peso(ETRAVEL_BUNDLE_VALUE_PHP)}
        </p>

        <button
          type="button"
          onClick={() => onBook(offer)}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F46F3] px-5 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#0D3DD6] disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? "Booking…" : "Book with eTravel"}
          {busy ? null : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </article>
  );
}
