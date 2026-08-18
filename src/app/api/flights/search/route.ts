import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = process.env.DUFFEL_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ live: false, offers: [] });
    const r = await fetch("https://api.duffel.com/air/offer_requests", {
      method: "POST",
      headers: { "Authorization": "Bearer "+token, "Duffel-Version": "v2", "Content-Type": "application/json" },
      body: JSON.stringify({ data: { slices: [{ origin: body.from, destination: body.to, departure_date: body.departure_date }], passengers: [{ type: "adult" }], cabin_class: "economy" } })
    });
    const j = await r.json();
    const offers = (j.data?.offers||[]).slice(0,20).map((o:any)=>({ id:o.id, airline:o.owner?.name||"Airline", from:o.slices?.[0]?.origin?.iata_code, to:o.slices?.[0]?.destination?.iata_code, price: parseFloat(o.total_amount)+350, base_price: parseFloat(o.total_amount) }));
    return NextResponse.json({ live: true, offers });
  } catch(e:any){ return NextResponse.json({ live: false, offers: [] }); }
}
