RBS _LABS, [Aug 18, 2026 at 3:03:49 PM]:
import type { Metadata } from "next";
import { FlightsScreen } from "@/components/flights/FlightsScreen";

export const metadata: Metadata = {
  title: "Flights",
  description:
    "Search sample fares and raise the bundled eTravel declaration in one step. Demonstration data — no airline is connected.",
  alternates: { canonical: "/app/flights" },
};

export default function FlightsPage() {
  return <FlightsScreen />;
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { from, to, departure_date } = await req.json();
    const token = process.env.DUFFEL_ACCESS_TOKEN;

    console.log("[DUFFEL] Token exists?",!!token, "Route:", from, "->", to);

    // Kung wala pang token sa Vercel — balik sa demo para di mag crash
    if (!token) {
      return NextResponse.json({
        live: false,
        offers: [],
        message: "No DUFFEL token - using demo"
      });
    }

    const duffelRes = await fetch("https://api.duffel.com/air/offer_requests", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${token},
        "Duffel-Version": "v2",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          slices: [{ origin: from, destination: to, departure_date }],
          passengers: [{ type: "adult" }],
          cabin_class: "economy",
        },
      }),
    });

    const json = await duffelRes.json();

    if (!duffelRes.ok) {
      console.error("[DUFFEL ERROR]", json);
      return NextResponse.json({ live: false, error: json, offers: [] }, { status: 200 });
    }

    const offers = json.data?.offers || [];
    console.log(`[DUFFEL] Found ${offers.length} offers`);

    // Format to our UI shape - mas mura tayo P350 lang!
    const formatted = offers.slice(0, 20).map((o: any) => ({
      id: o.id,
      airline: o.owner?.name  o.slices[0]?.segments[0]?.marketing_carrier?.name  "Airline",
      flight_number: o.slices[0]?.segments[0]?.marketing_carrier_flight_number || "FL",
      from: o.slices[0]?.origin?.iata_code,
      to: o.slices[0]?.destination?.iata_code,
      departure: o.slices[0]?.segments[0]?.departing_at,
      arrival: o.slices[0]?.segments[0]?.arriving_at,
      duration: o.slices[0]?.duration,
      price: parseFloat(o.total_amount) + 350, // + P350 service fee natin - mas mura vs Trip.com P1200!
      base_price: parseFloat(o.total_amount),
      currency: o.total_currency,
      raw: o, // para sa booking
    }));

    return NextResponse.json({ live: true, offers: formatted });
  } catch (e: any) {
    console.error("[DUFFEL FATAL]", e);
    return NextResponse.json({ live: false, offers: [], error: e.message });
  }
}
