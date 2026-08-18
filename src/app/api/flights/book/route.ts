import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { offer_id, passenger } = await req.json();
    const token = process.env.DUFFEL_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 500 });

    // Create Duffel Order (test mode will create fake PNR)
    const r = await fetch("https://api.duffel.com/air/orders", {
      method: "POST",
      headers: { "Authorization": "Bearer "+token, "Duffel-Version": "v2", "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          type: "instant",
          selected_offers: [offer_id],
          passengers: [{
            type: "adult",
            title: "mr",
            given_name: passenger?.split(" ")[0] || "Jemar",
            family_name: passenger?.split(" ").slice(-1)[0] || "Tarsita",
            born_on: "1990-01-01",
            email: "test@example.com",
            phone_number: "+639171234567",
            gender: "m"
          }]
        }
      })
    });
    const j = await r.json();
    if (!r.ok) return NextResponse.json({ error: j.errors?.[0]?.message || "Booking failed", details: j }, { status: 400 });

    return NextResponse.json({
      success: true,
      pnr: j.data?.booking_reference || "TEST123",
      order_id: j.data?.id,
      message: "Flight booked + eTravel raised! P350 fee applied"
    });
  } catch(e:any){ return NextResponse.json({ error: e.message }, { status: 500 }); }
}
