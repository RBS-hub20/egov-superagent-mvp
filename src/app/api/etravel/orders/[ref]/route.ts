import { NextResponse, type NextRequest } from "next/server";
import { serviceClient, toOrder, type OrderRow } from "@/lib/etravel-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Look up one declaration.
 *
 * The ref alone gets the public view — status, destination, official reference.
 * The ref plus its access key (`?k=`) gets the traveller's own record. The key
 * is compared in constant time so this endpoint cannot be used to guess one.
 */
export async function GET(req: NextRequest, { params }: { params: { ref: string } }) {
  const client = serviceClient();
  if (!client) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const ref = decodeURIComponent(params.ref).trim().toUpperCase();
  const { data, error } = await client
    .from("etravel_orders")
    .select("*")
    .eq("ref", ref)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const row = data as OrderRow;
  const key = req.nextUrl.searchParams.get("k") ?? "";
  const audience = key && timingSafeEqual(key, row.access_key) ? "holder" : "public";

  return NextResponse.json({ order: await toOrder(client, row, audience) });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
