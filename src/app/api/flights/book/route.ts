import { NextResponse, type NextRequest } from "next/server";
import { insertOrder, serviceClient, toOrder } from "@/lib/etravel-service";
import { ETRAVEL_BUNDLE_VALUE_PHP, findOffer, generateFlightRef } from "@/lib/flights/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE_VERSION = "flights-hybrid-v1-isolated-locked";

interface BookBody {
  offerId?: string;
  passenger_name?: string;
  passport_no?: string;
  contact?: string;
  departure_date?: string;
  origin?: string;
  destination?: string;
}

function clean(value: unknown, limit = 120): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

/**
 * Books a sample flight and raises the bundled eTravel declaration.
 *
 * The declaration is created through `insertOrder` — the same function the
 * chat flow uses — so there is one place that knows how a declaration is
 * shaped, how its reference is allocated and how its access key is issued.
 *
 * The booking is recorded as PENDING and no payment is taken. A row here means
 * "a passenger asked for this itinerary", never "a seat is confirmed".
 */
export async function POST(req: NextRequest) {
  const client = serviceClient();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase is not configured on this deployment.", routeVersion: ROUTE_VERSION },
      { status: 503 }
    );
  }

  let body: BookBody;
  try {
    body = (await req.json()) as BookBody;
  } catch {
    return NextResponse.json(
      { error: "Expected JSON.", routeVersion: ROUTE_VERSION },
      { status: 400 }
    );
  }

  const passengerName = clean(body.passenger_name);
  const offer = findOffer(clean(body.offerId, 20));

  if (!passengerName || !offer) {
    return NextResponse.json(
      {
        error: "A passenger name and a valid offer id are required.",
        routeVersion: ROUTE_VERSION,
      },
      { status: 400 }
    );
  }

  const departureRaw = clean(body.departure_date, 40);
  const departure = departureRaw ? new Date(departureRaw) : null;
  if (departure && Number.isNaN(departure.getTime())) {
    return NextResponse.json(
      { error: "Departure date is not a valid date.", routeVersion: ROUTE_VERSION },
      { status: 400 }
    );
  }

  const origin = clean(body.origin, 8).toUpperCase() || offer.origin;
  const destination = clean(body.destination, 60) || offer.destination;
  const passportNo = clean(body.passport_no, 30) || null;
  const contact = clean(body.contact, 80) || null;
  const departureISO = departure ? departure.toISOString() : null;

  try {
    // The declaration first: a booking that claims a free eTravel is only
    // honest once the declaration actually exists to point at.
    const { row: declaration, accessKey } = await insertOrder(client, {
      user_id: null,
      traveler_name: passengerName,
      passport_no: passportNo,
      flight_no: offer.flightNo,
      departure_date: departureISO,
      departure_airport: origin,
      destination,
      contact,
    });

    const flightRef = generateFlightRef();
    const { data: booking, error } = await client
      .from("flight_orders")
      .insert({
        ref: flightRef,
        etravel_ref: declaration.ref,
        passenger_name: passengerName,
        passport_no: passportNo,
        contact,
        origin,
        destination,
        departure_date: departureISO,
        airline: offer.airline,
        flight_no: offer.flightNo,
        base_price: offer.basePrice,
        markup: offer.markup,
        total_price: offer.totalPrice,
        currency: offer.currency,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      // The declaration stands on its own, so say what did and did not happen
      // rather than implying the whole request failed.
      return NextResponse.json(
        {
          error: `The eTravel declaration ${declaration.ref} was created, but the booking could not be saved: ${error.message}`,
          code: error.code,
          hint: error.hint,
          etravelRef: declaration.ref,
          routeVersion: ROUTE_VERSION,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      routeVersion: ROUTE_VERSION,
      booking,
      etravel: {
        order: await toOrder(client, declaration, "holder"),
        accessKey,
      },
      bundle: {
        etravelIncluded: true,
        etravelValue: ETRAVEL_BUNDLE_VALUE_PHP,
      },
      demo: true,
      notice:
        "Demonstration booking. No seat is held, no payment is taken, and no airline has been contacted. The eTravel declaration is a real queue entry awaiting an operator.",
    });
  } catch (cause) {
    return NextResponse.json(
      {
        error: cause instanceof Error ? cause.message : "Could not complete the booking.",
        routeVersion: ROUTE_VERSION,
      },
      { status: 500 }
    );
  }
}
