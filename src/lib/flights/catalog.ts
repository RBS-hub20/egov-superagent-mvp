/**
 * Flight fares — demonstration data.
 *
 * No airline, GDS or aggregator is connected. These are fixed sample fares
 * used to show what the flights + eTravel bundle looks like end to end; every
 * surface that renders them says so, and nothing here takes a payment.
 *
 * Shared by the search route and the UI, so the price a passenger sees and the
 * price the booking records are computed the same way once.
 */

/** Service markup added to the sample base fare, in whole pesos. */
export const MARKUP_PHP = 350;

/** What the bundled eTravel filing is worth as a standalone service. */
export const ETRAVEL_BUNDLE_VALUE_PHP = 1149;

export interface FlightOffer {
  id: string;
  airline: string;
  flightNo: string;
  origin: string;
  destination: string;
  /** Local departure/arrival clock times for the sample itinerary. */
  departTime: string;
  arriveTime: string;
  durationMinutes: number;
  stops: number;
  basePrice: number;
  markup: number;
  totalPrice: number;
  /** A sample fare for the same route, for illustration only. */
  comparisonPrice: number;
  saveVsOthers: number;
  currency: "PHP";
}

interface Fixture {
  id: string;
  airline: string;
  flightNo: string;
  departTime: string;
  arriveTime: string;
  durationMinutes: number;
  stops: number;
  basePrice: number;
  comparisonPrice: number;
}

/** Manila → Singapore, the route the bundle is built around. */
const MNL_SIN: Fixture[] = [
  {
    id: "PR501",
    airline: "Philippine Airlines",
    flightNo: "PR501",
    departTime: "06:20",
    arriveTime: "10:05",
    durationMinutes: 225,
    stops: 0,
    basePrice: 7480,
    comparisonPrice: 8990,
  },
  {
    id: "5J803",
    airline: "Cebu Pacific",
    flightNo: "5J803",
    departTime: "11:45",
    arriveTime: "15:30",
    durationMinutes: 225,
    stops: 0,
    basePrice: 5920,
    comparisonPrice: 7150,
  },
  {
    id: "3K772",
    airline: "Jetstar Asia",
    flightNo: "3K772",
    departTime: "18:10",
    arriveTime: "22:00",
    durationMinutes: 230,
    stops: 0,
    basePrice: 5240,
    comparisonPrice: 6480,
  },
];

function toOffer(f: Fixture, origin: string, destination: string): FlightOffer {
  const totalPrice = f.basePrice + MARKUP_PHP;
  return {
    id: f.id,
    airline: f.airline,
    flightNo: f.flightNo,
    origin,
    destination,
    departTime: f.departTime,
    arriveTime: f.arriveTime,
    durationMinutes: f.durationMinutes,
    stops: f.stops,
    basePrice: f.basePrice,
    markup: MARKUP_PHP,
    totalPrice,
    comparisonPrice: f.comparisonPrice,
    // Against the sample comparison fare above, never a live competitor quote.
    saveVsOthers: Math.max(0, f.comparisonPrice - totalPrice),
    currency: "PHP",
  };
}

/**
 * Sample offers for a route.
 *
 * Only MNL→SIN has a fixture; any other pair reuses it with the requested
 * airports substituted, so the demo never returns an empty screen. That is a
 * demonstration convenience, which is why the UI labels the fares as samples.
 */
export function searchOffers(origin: string, destination: string): FlightOffer[] {
  const from = (origin || "MNL").trim().toUpperCase().slice(0, 4);
  const to = (destination || "SIN").trim().toUpperCase().slice(0, 4);
  return MNL_SIN.map((f) => toOffer(f, from, to)).sort((a, b) => a.totalPrice - b.totalPrice);
}

export function findOffer(id: string): FlightOffer | null {
  const fixture = MNL_SIN.find((f) => f.id === id.trim().toUpperCase());
  return fixture ? toOffer(fixture, "MNL", "SIN") : null;
}

/** FLT-2026-4821 — the number a passenger reads back over the phone. */
export function generateFlightRef(now = new Date()): string {
  const year = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", year: "numeric" }).format(
    now
  );
  return `FLT-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function peso(amount: number): string {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export function duration(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}
