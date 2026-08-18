import { NextResponse, type NextRequest } from "next/server";
import { ETRAVEL_BUNDLE_VALUE_PHP, MARKUP_PHP, searchOffers } from "@/lib/flights/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE_VERSION = "flights-hybrid-v1-isolated-locked";

/**
 * Sample fares for a route.
 *
 * No airline or aggregator is connected: the offers come from a fixed catalog
 * and the response says so, so nothing downstream can present them as live
 * availability.
 */
export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const origin = (params.get("from") ?? "MNL").trim();
  const destination = (params.get("to") ?? "SIN").trim();
  const date = (params.get("date") ?? "").trim();

  const offers = searchOffers(origin, destination);

  return NextResponse.json({
    routeVersion: ROUTE_VERSION,
    query: { from: origin.toUpperCase(), to: destination.toUpperCase(), date: date || null },
    offers,
    markup: MARKUP_PHP,
    etravelBundleValue: ETRAVEL_BUNDLE_VALUE_PHP,
    // Stated in the payload, not only in the UI, so any other consumer of this
    // endpoint inherits the caveat too.
    demo: true,
    notice:
      "Demonstration fares from a fixed sample catalog. No airline or booking system is connected and no seat is held.",
  });
}
