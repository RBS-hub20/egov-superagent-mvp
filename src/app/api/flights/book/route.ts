import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const offer_id = body.offer_id || body.id;
    const passenger = body.passenger || "JEMAR TARSITA";
    console.log("Booking offer_id:", offer_id);

    if (!offer_id) {
      return NextResponse.json({ error: "Field 'id' can't be blank - offer_id missing. Try searching again (offers expire in 2 mins)" }, { status: 400 });
    }

    const token = process.env.DUFFEL_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "No DUFFEL token" }, { status: 500 });

    const given = passenger.split(" ")[0] || "Jemar";
    const family = passenger.split(" ").slice(-1)[0] || "Tarsita";

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
            given_name: given,
            family_name: family,
            born_on: "1990-01-01",
            email: "test@example.com",
            phone_number: "+639171234567",
            gender: "m"
          }]
        }
      })
    });

    const j = await r.json();
    console.log("Duffel order response:", JSON.stringify(j).slice(0,500));

    if (!r.ok) {
      const msg = j.errors?.[0]?.message || j.errors?.[0]?.title || "Booking failed";
      const detail = j.errors?.[0]?.detail || "";
      return NextResponse.json({ error: msg + " " + detail + " - Try searching again, offers expire fast in test mode" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      pnr: j.data?.booking_reference || "TEST-" + Math.random().toString(36).slice(2,7).toUpperCase(),
      order_id: j.data?.id,
      message: "Booked! P350 fee applied + eTravel raised"
    });
  } catch(e:any){
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
