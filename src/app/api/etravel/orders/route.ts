import { NextResponse, type NextRequest } from "next/server";
import { insertOrder, serviceClient, toOrder } from "@/lib/etravel-service";
import type { NewOrderInput } from "@/lib/etravel-orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = 120;

function clean(value: unknown, limit = MAX): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

/** A traveller files a declaration into the queue. */
export async function POST(req: NextRequest) {
  const client = serviceClient();
  if (!client) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let body: Partial<NewOrderInput>;
  try {
    body = (await req.json()) as Partial<NewOrderInput>;
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }

  const traveler_name = clean(body.traveler_name);
  const destination = clean(body.destination);
  if (!traveler_name || !destination) {
    return NextResponse.json(
      { error: "Traveler name and destination are required." },
      { status: 400 }
    );
  }

  // A bad date must not become a row that says "not specified" forever.
  const departureRaw = clean(body.departure_date, 40);
  const departure = departureRaw ? new Date(departureRaw) : null;
  if (departure && Number.isNaN(departure.getTime())) {
    return NextResponse.json({ error: "Departure date is not a valid date." }, { status: 400 });
  }

  try {
    const { row, accessKey } = await insertOrder(client, {
      user_id: null,
      traveler_name,
      passport_no: clean(body.passport_no, 30) || null,
      flight_no: clean(body.flight_no, 20) || null,
      departure_date: departure ? departure.toISOString() : null,
      departure_airport: clean(body.departure_airport, 60) || "NAIA Terminal 3",
      destination,
      contact: clean(body.contact, 80) || null,
    });

    return NextResponse.json({ order: await toOrder(client, row, "holder"), accessKey });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save the declaration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
