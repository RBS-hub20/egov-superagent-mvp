import { NextResponse } from "next/server";
import { isServiceConfigured } from "@/lib/etravel-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Which backend the browser is talking to.
 *
 * Only the server knows whether a service role key is present, and the UI has
 * to say so plainly: an order that lives in localStorage is not pending with
 * anybody.
 */
export function GET() {
  return NextResponse.json({ supabase: isServiceConfigured() });
}
