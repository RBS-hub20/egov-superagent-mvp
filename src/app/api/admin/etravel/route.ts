import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/admin-auth";
import { serviceClient, toOrder, type OrderRow } from "@/lib/etravel-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The whole queue, for the owner console only. */
export async function GET(req: NextRequest) {
  if (!(await isValidAdminCookie(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const client = serviceClient();
  if (!client) return NextResponse.json({ orders: [], backend: "local" });

  const { data, error } = await client
    .from("etravel_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const orders = await Promise.all(
    ((data ?? []) as OrderRow[]).map((row) => toOrder(client, row, "operator"))
  );
  return NextResponse.json({ orders, backend: "supabase" });
}
