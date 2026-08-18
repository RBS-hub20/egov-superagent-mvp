import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = process.env.DUFFEL_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ live: false, offers: [], note: "No token" });
    const r = await fetch("https://api.duffel.com/air/offer_requests", {
      method: "POST",
      headers: { "Authorization": "Bearer "+token, "Duffel-Version": "v2", "Content-Type": "application/json" },
      body: JSON.stringify({ data: { slices: [{ origin: body.from, destination: body.to, departure_date: body.departure_date }], passengers: [{ type: "adult" }], cabin_class: "economy" } })
    });
    const j = await r.json();
    if (!r.ok) {
      return NextResponse.json({ live: false, offers: [], error: j.errors?.[0]?.message, raw: j });
    }
    const offers = (j.data?.offers||[]).slice(0,15).map((o:any)=>({
      id: o.id,
      offer_id: o.id,
      airline: o.owner?.name || "Airline",
      from: o.slices?.[0]?.origin?.iata_code,
      to: o.slices?.[0]?.destination?.iata_code,
      price: parseFloat(o.total_amount)+350,
      base_price: parseFloat(o.total_amount),
      total_amount: o.total_amount,
      currency: o.total_currency,
      is_test: o.total_amount < 1000
    }));
    return NextResponse.json({ live: true, offers, is_test: true });
  } catch(e:any){ return NextResponse.json({ live: false, offers: [], error: e.message }); }
}
