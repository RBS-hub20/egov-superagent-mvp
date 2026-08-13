import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/admin-auth";
import { describeConnection, serviceClient, toOrder, type OrderRow } from "@/lib/etravel-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The whole queue, for the owner console only.
 *
 * There is deliberately no filter here — no status, no date window, no
 * soft-delete column. The console needs pending and filed rows alike, and a
 * declaration whose `official_ref`, `filed_at`, `qr_path` and `pdf_path` are
 * all still null is exactly the row an operator has to see first.
 *
 * `?diagnose=1` answers the only question a caller can't otherwise ask: an
 * empty queue means either "no rows" or "this key cannot see the rows", and
 * with row level security enabled those are indistinguishable — Postgres
 * returns zero rows and no error when the key lacks access.
 */
export async function GET(req: NextRequest) {
  if (!(await isValidAdminCookie(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized — sign in to the owner console again." }, { status: 401 });
  }

  const client = serviceClient();
  if (!client) {
    return NextResponse.json({
      orders: [],
      backend: "local",
      error:
        "No Supabase project is configured on this deployment. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    });
  }

  if (req.nextUrl.searchParams.get("diagnose")) {
    const { count, error } = await client
      .from("etravel_orders")
      .select("id", { count: "exact", head: true });

    const connection = describeConnection();

    // Report every finding rather than guessing one: a wrong key and a failing
    // query can be true at the same time, and picking one hides the other.
    const findings: string[] = [];
    if (!connection.keyIsServiceRole) {
      findings.push(
        `SUPABASE_SERVICE_ROLE_KEY holds a "${connection.keyRole}" key, not a service-role key. etravel_orders has row level security enabled with no policies, so any other key reads zero rows and reports no error at all. Copy the service_role secret from Project settings → API keys.`
      );
    }
    if (error) findings.push(`The query failed: ${error.message}`);
    if (!error && count === 0 && connection.keyIsServiceRole) {
      findings.push(
        `The key can read ${connection.projectHost ?? "the project"} but etravel_orders holds no rows. Confirm the row was inserted into this same project, in the public schema.`
      );
    }
    if (!error && (count ?? 0) > 0) {
      findings.push(
        "The key can see rows here, so an empty console is a problem between this route and the browser, not the database."
      );
    }

    return NextResponse.json({
      ...connection,
      rowsVisibleToThisKey: count ?? 0,
      queryError: error ? { message: error.message, code: error.code, hint: error.hint } : null,
      findings,
    });
  }

  const { data, error, count } = await client
    .from("etravel_orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    // Pass the database's own words through: "[]" with a 200 hides the cause.
    return NextResponse.json(
      { error: error.message, code: error.code, hint: error.hint, details: error.details },
      { status: 500 }
    );
  }

  const orders = await Promise.all(
    ((data ?? []) as OrderRow[]).map((row) => toOrder(client, row, "operator"))
  );
  return NextResponse.json({ orders, backend: "supabase", count: count ?? orders.length });
}
