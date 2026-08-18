"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plane, Search } from "lucide-react";
import { FlightResults, type BookingResult } from "./FlightResults";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { verifyPath, saveClaim } from "@/lib/etravel-orders";
import type { ETravelOrder } from "@/lib/etravel-orders";
import type { FlightOffer } from "@/lib/flights/catalog";
import { useUser } from "@/lib/user";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-3.5 py-2.5 text-[14.5px] text-white outline-none transition placeholder:text-zinc-600 focus:border-[#0F46F3]/60 focus:ring-2 focus:ring-[#0F46F3]/20"
      />
    </label>
  );
}

/**
 * Search a route, then book one of the sample fares.
 *
 * Booking raises a real eTravel declaration through the existing queue, so the
 * bundle is not a claim — the reference it returns is the same one the operator
 * console will work. The flight side is demonstration data throughout.
 */
export function FlightsScreen() {
  const user = useUser();
  const [from, setFrom] = useState("MNL");
  const [to, setTo] = useState("SIN");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function search() {
    setLoading(true);
    setError(null);
    setBooking(null);
    try {
      const params = new URLSearchParams({ from, to, date });
      const res = await fetch(`/api/flights/search?${params}`, { cache: "no-store" });
      const body = (await res.json()) as { offers?: FlightOffer[]; error?: string };
      if (!res.ok) throw new Error(body.error ?? "Search failed.");
      setOffers(body.offers ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Search failed.");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }

  async function book(offer: FlightOffer) {
    const passenger = (name.trim() || (user.verified ? user.name : "")).trim();
    if (!passenger) {
      setError("Enter the passenger name as printed on the passport before booking.");
      return;
    }
    setBookingId(offer.id);
    setError(null);
    try {
      const res = await fetch("/api/flights/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer.id,
          passenger_name: passenger,
          departure_date: date ? new Date(`${date}T00:00:00+08:00`).toISOString() : null,
          origin: offer.origin,
          destination: offer.destination,
        }),
      });
      const body = (await res.json()) as {
        booking?: { ref: string; total_price: number };
        etravel?: { order: ETravelOrder; accessKey: string };
        error?: string;
      };
      if (!res.ok || !body.booking || !body.etravel) {
        throw new Error(body.error ?? "The booking could not be completed.");
      }

      // Keep the claim so the traveller can reopen their own declaration.
      saveClaim({ ref: body.etravel.order.ref, accessKey: body.etravel.accessKey });

      setBooking({
        flightRef: body.booking.ref,
        etravelRef: body.etravel.order.ref,
        verifyHref: verifyPath(body.etravel.order, body.etravel.accessKey),
        total: body.booking.total_price,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The booking could not be completed.");
    } finally {
      setBookingId(null);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#050A18] text-zinc-200">
      <header className="border-b border-white/[0.07] px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/" aria-label="eGov SuperAgent home">
            <BrandLockup size={28} priority textClassName="text-white" />
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[13px] font-semibold text-zinc-300 transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Console
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#FFC300]/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#FFC300] ring-1 ring-inset ring-[#FFC300]/30">
          <Plane className="h-3.5 w-3.5" />
          New
        </p>
        <h1 className="mt-4 text-[30px] font-bold tracking-tight text-white sm:text-[38px]">
          Book cheaper. eTravel included.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
          Search a route and the eTravel declaration is raised with the booking — one form instead
          of two, and the reference lands in the same queue an operator files from.
        </p>

        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="From" value={from} onChange={setFrom} placeholder="MNL" />
            <Field label="To" value={to} onChange={setTo} placeholder="SIN" />
            <Field label="Departure date" value={date} onChange={setDate} type="date" />
            <Field
              label="Passenger name"
              value={name}
              onChange={setName}
              placeholder={user.verified ? user.name : "Juan Dela Cruz"}
            />
          </div>

          <button
            type="button"
            onClick={search}
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F46F3] px-6 py-3 text-[14.5px] font-semibold text-white transition hover:bg-[#0D3DD6] disabled:cursor-wait disabled:opacity-70"
          >
            <Search className="h-4 w-4" />
            {loading ? "Searching…" : "Search flights"}
          </button>
        </section>

        <div className="mt-6">
          <FlightResults
            offers={offers}
            loading={loading}
            error={error}
            bookingId={bookingId}
            booking={booking}
            onBook={book}
          />
        </div>
      </main>
    </div>
  );
}
