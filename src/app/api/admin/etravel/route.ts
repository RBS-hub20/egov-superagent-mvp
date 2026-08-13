import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/admin-auth";
import { describeConnection, serviceClient, toOrder, type OrderRow } from "@/lib/etravel-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bumped when this handler changes, so a stale deployment is obvious. */
const ROUTE_VERSION = "2026-08-03-list-unordered";

/** Newest first, done in JS so the query needs no column to exist. */
function newestFirst(rows: OrderRow[]): OrderRow[] {
  return [...rows].sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
}

/**
 * The whole queue, for the owner console only.
 *
 * There is deliberately no filter here — no status, no date window, no
 * soft-delete column. The console needs pending and filed rows alike, and a
 * declaration whose `official_ref`, `filed_at`, `qr_path` and `pdf_path` are
 * all still null is exactly the row an operator has to see first.
 *
 * The ordering is applied after the fetch rather than as `.order("created_at")`.
 * PostgREST rejects the whole request when an ordered column is missing, so on
 * a table that was not created by this repo's migration the sort clause alone
 * could sink a query that would otherwise return every row.
 *
 * `?diagnose=1` runs both this query and a bare count through the same client
 * and reports each result, so a divergence between them is visible rather than
 * inferred.
 */
export async function GET(req: NextRequest) {
  if (!(await isValidAdminCookie(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json(
      { error: "Unauthorized — sign in to the owner console again." },
      { status: 401 }
    );
  }

  const client = serviceClient();
  if (!client) {
    return NextResponse.json({
      orders: [],
      backend: "local",
      routeVersion: ROUTE_VERSION,
      error:
        "No Supabase project is configured on this deployment. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    });
  }

  const list = await client.from("etravel_orders").select("*", { count: "exact" }).limit(200);

  if (req.nextUrl.searchParams.get("diagnose")) {
    const head = await client.from("etravel_orders").select("id", { count: "exact", head: true });
    const connection = describeConnection();
    const firstRow = (list.data?.[0] ?? null) as Record<string, unknown> | null;

    // Report every finding rather than guessing one: a wrong key and a failing
    // query can be true at the same time, and picking one hides the other.
    const findings: string[] = [];
    if (!connection.keyIsServiceRole) {
      findings.push(
        `SUPABASE_SERVICE_ROLE_KEY holds a "${connection.keyRole}" key, not a service-role key. etravel_orders has row level security enabled with no policies, so any other key reads zero rows and reports no error at all. Copy the service_role secret from Project settings → API keys.`
      );
    }
    if (head.error) findings.push(`The count query failed: ${head.error.message}`);
    if (list.error) findings.push(`The list query failed: ${list.error.message}`);
    if (!head.error && !list.error && (head.count ?? 0) > 0 && (list.data?.length ?? 0) === 0) {
      findings.push(
        "The count sees rows but the list returns none through the same key — that is a PostgREST result, not a permission problem. Send this whole response on."
      );
    }
    if (!list.error && (list.data?.length ?? 0) > 0) {
      findings.push(
        `The list query returns ${list.data?.length} row(s) here, so an empty console is a problem between this route and the browser, not the database.`
      );
    }
    if (firstRow) {
      const required = ["id", "ref", "traveler_name", "destination", "status", "created_at"];
      const missing = required.filter((c) => !(c in firstRow));
      if (missing.length) {
        findings.push(
          `The row is missing column(s) this app expects: ${missing.join(", ")}. The table does not match supabase/migrations, so parts of the console will not render.`
        );
      }
    }

    return NextResponse.json({
      ...connection,
      routeVersion: ROUTE_VERSION,
      rowsVisibleToThisKey: head.count ?? 0,
      rowsReturnedByListQuery: list.data?.length ?? 0,
      listCount: list.count ?? 0,
      columnsOnFirstRow: firstRow ? Object.keys(firstRow).sort() : [],
      queryError: head.error
        ? { message: head.error.message, code: head.error.code, hint: head.error.hint }
        : null,
      listError: list.error
        ? { message: list.error.message, code: list.error.code, hint: list.error.hint }
        : null,
      findings,
    });
  }

  if (list.error) {
    // Pass the database's own words through: "[]" with a 200 hides the cause.
    return NextResponse.json(
      {
        error: list.error.message,
        code: list.error.code,
        hint: list.error.hint,
        details: list.error.details,
        routeVersion: ROUTE_VERSION,
      },
      { status: 500 }
    );
  }

  const rows = newestFirst((list.data ?? []) as OrderRow[]);

  try {
    const orders = await Promise.all(rows.map((row) => toOrder(client, row, "operator")));
    return NextResponse.json({
      orders,
      backend: "supabase",
      count: list.count ?? orders.length,
      routeVersion: ROUTE_VERSION,
    });
  } catch (cause) {
    // A row that cannot be shaped is a schema mismatch, not an empty queue.
    return NextResponse.json(
      {
        error: `Read ${rows.length} row(s) but could not render them: ${
          cause instanceof Error ? cause.message : String(cause)
        }`,
        routeVersion: ROUTE_VERSION,
      },
      { status: 500 }
    );
  }
}
