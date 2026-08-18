"use client";

import Link from "next/link";
import { BadgeCheck, Info, Loader2, Plane } from "lucide-react";
import { FlightCard } from "./FlightCard";
import { peso, type FlightOffer, ETRAVEL_BUNDLE_VALUE_PHP } from "@/lib/flights/catalog";

export interface BookingResult {
  flightRef: string;
  etravelRef: string;
  verifyHref: string;
  total: number;
}

/**
 * The result list, its empty and loading states, and the confirmation that
 * replaces them once a booking is raised.
 */
export function FlightResults({
  offers,
  loading,
  error,
  bookingId,
  booking,
  onBook,
}: {
  offers: FlightOffer[];
  loading: boolean;
  error: string | null;
  /** The offer currently being booked, so only its button spins. */
  bookingId: string | null;
  booking: BookingResult | null;
  onBook: (offer: FlightOffer) => void;
}) {
  if (booking) {
    return (
      <section className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.06] p-6">
        <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
          <BadgeCheck className="h-4 w-4" />
          Booking request raised
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Flight reference
            </p>
            <p className="mt-1 font-mono text-[18px] font-bold text-white">{booking.flightRef}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              eTravel declaration
            </p>
            <p className="mt-1 font-mono text-[18px] font-bold text-white">{booking.etravelRef}</p>
          </div>
        </div>

        <p className="mt-4 rounded-xl border border-[#FFC300]/25 bg-[#FFC300]/[0.06] px-4 py-3 text-[13px] font-semibold text-[#FFC300]">
          FREE eTravel included — save {peso(ETRAVEL_BUNDLE_VALUE_PHP)}
        </p>

        <p className="mt-4 text-[13px] leading-relaxed text-zinc-400">
          The declaration is in the operator queue and will be filed on etravel.gov.ph. The flight
          itself is a demonstration: no seat is held, no payment was taken, and no airline has been
          contacted.
        </p>

        <Link
          href={booking.verifyHref}
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7EA6FF] underline-offset-4 hover:underline"
        >
          Track the declaration
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] py-16 text-zinc-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.07] p-5">
        <p className="text-[13.5px] font-semibold text-rose-300">Could not complete that</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-rose-200/80">{error}</p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-zinc-500 ring-1 ring-inset ring-white/[0.06]">
          <Plane className="h-6 w-6" />
        </span>
        <p className="mt-4 text-[15px] font-semibold text-zinc-200">Search a route</p>
        <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-zinc-500">
          Pick where you are flying from and to, and the bundled eTravel filing comes with it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="flex items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-[12.5px] leading-relaxed text-zinc-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
        Demonstration fares from a fixed sample catalog. No airline or booking system is connected,
        and the comparison figure is a sample fare for the same route rather than a live quote.
      </p>

      {offers.map((offer) => (
        <FlightCard
          key={offer.id}
          offer={offer}
          busy={bookingId === offer.id}
          onBook={onBook}
        />
      ))}
    </div>
  );
}
