import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/admin-auth";
import { FILINGS_BUCKET, serviceClient, toOrder, type OrderRow } from "@/lib/etravel-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bumped when this handler changes, so a stale deployment is obvious. */
const ROUTE_VERSION = "2026-08-03-file-tolerant-v2";
const MAX_UPLOAD = 8 * 1024 * 1024;

type Row = Record<string, unknown>;

async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  if (await isValidAdminCookie(req.cookies.get(ADMIN_COOKIE)?.value)) return null;
  return NextResponse.json(
    { error: "Unauthorized — sign in to the owner console again.", routeVersion: ROUTE_VERSION },
    { status: 401 }
  );
}

/** Finds the order by id, falling back to ref — either identifies it. */
async function locate(
  client: NonNullable<ReturnType<typeof serviceClient>>,
  id: string,
  ref: string
): Promise<{ row: Row | null; error: string | null; matchedBy: "id" | "ref" | null }> {
  if (id) {
    const { data, error } = await client.from("etravel_orders").select("*").eq("id", id).maybeSingle();
    if (error) return { row: null, error: error.message, matchedBy: null };
    if (data) return { row: data as Row, error: null, matchedBy: "id" };
  }
  if (ref) {
    const { data, error } = await client
      .from("etravel_orders")
      .select("*")
      .eq("ref", ref)
      .maybeSingle();
    if (error) return { row: null, error: error.message, matchedBy: null };
    if (data) return { row: data as Row, error: null, matchedBy: "ref" };
  }
  return { row: null, error: null, matchedBy: null };
}

/**
 * Read-only: what this table actually looks like for one order.
 *
 * The list endpoint returns orders shaped by `toOrder()`, where `qr_url` and
 * `pdf_url` are signed URLs derived from the `qr_path`/`pdf_path` columns — so
 * that payload cannot be read as the table's column list. This can.
 */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const client = serviceClient();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase is not configured on this deployment.", routeVersion: ROUTE_VERSION },
      { status: 503 }
    );
  }

  const id = (req.nextUrl.searchParams.get("id") ?? "").trim();
  const ref = (req.nextUrl.searchParams.get("ref") ?? "").trim();
  const { row, error, matchedBy } = await locate(client, id, ref);

  if (error) return NextResponse.json({ error, routeVersion: ROUTE_VERSION }, { status: 500 });
  if (!row) {
    return NextResponse.json(
      { error: "No order matched that id or ref.", routeVersion: ROUTE_VERSION },
      { status: 404 }
    );
  }

  const columns = Object.keys(row).sort();
  return NextResponse.json({
    routeVersion: ROUTE_VERSION,
    matchedBy,
    columnsOnRow: columns,
    // The fields this route wants to write, and whether the table has them.
    writable: {
      status: columns.includes("status"),
      official_ref: columns.includes("official_ref"),
      notes: columns.includes("notes"),
      qr: columns.includes("qr_path") ? "qr_path" : columns.includes("qr_url") ? "qr_url" : null,
      pdf: columns.includes("pdf_path") ? "pdf_path" : columns.includes("pdf_url") ? "pdf_url" : null,
      filed_at: columns.includes("filed_at"),
      filed_by: columns.includes("filed_by"),
    },
    current: { status: row.status ?? null, official_ref: row.official_ref ?? null },
  });
}

/**
 * The operator's attestation: they filed on etravel.gov.ph and this is what
 * came back.
 *
 * Only the official reference is required. The QR and the agency PDF are
 * optional, and with no file attached nothing touches storage at all.
 *
 * The update is built from the columns the fetched row actually carries, so a
 * table that does not match supabase/migrations saves what it can rather than
 * rejecting the whole statement. What was written and what was skipped both
 * come back in the response — a silent partial save would be worse than none.
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const client = serviceClient();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase is not configured on this deployment.", routeVersion: ROUTE_VERSION },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const id = String(form.get("id") ?? "").trim();
    const ref = String(form.get("ref") ?? "").trim();
    const officialRef = String(form.get("official_ref") ?? "").trim().slice(0, 60);
    const notes = String(form.get("notes") ?? "").trim().slice(0, 500);

    if ((!id && !ref) || !officialRef) {
      return NextResponse.json(
        {
          error: "An order id or ref, and the official reference, are required.",
          routeVersion: ROUTE_VERSION,
        },
        { status: 400 }
      );
    }

    const located = await locate(client, id, ref);
    if (located.error) {
      return NextResponse.json(
        { error: `Could not read the order: ${located.error}`, routeVersion: ROUTE_VERSION },
        { status: 500 }
      );
    }
    if (!located.row) {
      return NextResponse.json(
        {
          error: `No order matched id "${id}" or ref "${ref}".`,
          routeVersion: ROUTE_VERSION,
        },
        { status: 404 }
      );
    }

    const row = located.row;
    const columnList = Object.keys(row).sort();
    const columns = new Set(columnList);
    const hasStatus = columns.has("status");

    // Whichever column this table uses for the stored artifacts.
    const qrColumn = columns.has("qr_path") ? "qr_path" : columns.has("qr_url") ? "qr_url" : null;
    const pdfColumn = columns.has("pdf_path") ? "pdf_path" : columns.has("pdf_url") ? "pdf_url" : null;

    // Match the row the same way for the update as for the read.
    const matchColumn = located.matchedBy === "ref" ? "ref" : "id";
    const matchValue = located.matchedBy === "ref" ? (row.ref as string) : (row.id as string);

    if (hasStatus) {
      const { error: filingError } = await client
        .from("etravel_orders")
        .update({ status: "FILING" })
        .eq(matchColumn, matchValue);
      if (filingError) {
        return NextResponse.json(
          {
            error: `Could not set the order to FILING: ${filingError.message}`,
            code: filingError.code,
            hint: filingError.hint,
            routeVersion: ROUTE_VERSION,
          },
          { status: 500 }
        );
      }
    }

    // Uploads are optional; with no file this never reaches storage.
    let qrValue = (qrColumn ? row[qrColumn] : null) as string | null;
    let pdfValue = (pdfColumn ? row[pdfColumn] : null) as string | null;
    try {
      const refForPath = (row.ref as string) || (row.id as string);
      qrValue = (await upload(client, form.get("qr"), refForPath, "qr")) ?? qrValue;
      pdfValue = (await upload(client, form.get("pdf"), refForPath, "declaration")) ?? pdfValue;
    } catch (cause) {
      if (hasStatus) {
        await client
          .from("etravel_orders")
          .update({ status: row.status })
          .eq(matchColumn, matchValue);
      }
      return NextResponse.json(
        {
          error: cause instanceof Error ? cause.message : "Upload failed.",
          routeVersion: ROUTE_VERSION,
        },
        { status: 400 }
      );
    }

    const desired: Array<[string | null, unknown]> = [
      [hasStatus ? "status" : null, "FILED"],
      [columns.has("official_ref") ? "official_ref" : null, officialRef],
      [columns.has("notes") ? "notes" : null, notes || null],
      [qrColumn, qrValue],
      [pdfColumn, pdfValue],
      [columns.has("filed_at") ? "filed_at" : null, new Date().toISOString()],
      [columns.has("filed_by") ? "filed_by" : null, "Owner console"],
    ];

    const patch: Row = {};
    for (const [column, value] of desired) if (column) patch[column] = value;

    const wanted = ["status", "official_ref", "notes", "qr", "pdf", "filed_at", "filed_by"];
    const columnsUpdated = Object.keys(patch);
    const skippedFields = wanted.filter((f) => {
      if (f === "qr") return qrColumn === null;
      if (f === "pdf") return pdfColumn === null;
      return !columns.has(f);
    });

    if (!columns.has("official_ref")) {
      return NextResponse.json(
        {
          error:
            "This table has no official_ref column, so the agency reference cannot be recorded. Add it (text, nullable) or apply supabase/migrations.",
          columnsOnRow: columnList,
          routeVersion: ROUTE_VERSION,
        },
        { status: 500 }
      );
    }

    // No `.single()`: a filter that matches nothing must report "0 rows
    // updated" rather than an opaque "no rows returned" error.
    const { data: updatedRows, error } = await client
      .from("etravel_orders")
      .update(patch)
      .eq(matchColumn, matchValue)
      .select();

    if (error) {
      if (hasStatus) {
        await client
          .from("etravel_orders")
          .update({ status: row.status })
          .eq(matchColumn, matchValue);
      }
      return NextResponse.json(
        {
          error: `Could not record the filing: ${error.message}`,
          code: error.code,
          hint: error.hint,
          details: error.details,
          attemptedFields: columnsUpdated,
          columnsOnRow: columnList,
          routeVersion: ROUTE_VERSION,
        },
        { status: 500 }
      );
    }

    const rowsUpdated = updatedRows?.length ?? 0;
    if (rowsUpdated === 0) {
      return NextResponse.json(
        {
          error: `The update matched no rows on ${matchColumn} = ${matchValue}. The row was read but not written — check for a row level security UPDATE policy.`,
          columnsOnRow: columnList,
          routeVersion: ROUTE_VERSION,
        },
        { status: 500 }
      );
    }

    const saved = updatedRows![0] as Row;
    return NextResponse.json({
      order: await toOrder(client, saved as unknown as OrderRow, "operator"),
      routeVersion: ROUTE_VERSION,
      matchedBy: located.matchedBy,
      rowsUpdated,
      columnsUpdated,
      skippedFields,
      // Read back from the row the database returned, so "it did nothing" is
      // answerable from the response alone.
      savedStatus: saved.status ?? null,
      savedOfficialRef: saved.official_ref ?? null,
    });
  } catch (cause) {
    return NextResponse.json(
      {
        error: cause instanceof Error ? cause.message : "Unexpected failure while filing.",
        routeVersion: ROUTE_VERSION,
      },
      { status: 500 }
    );
  }
}

async function upload(
  client: NonNullable<ReturnType<typeof serviceClient>>,
  value: FormDataEntryValue | null,
  ref: string,
  kind: string
): Promise<string | null> {
  if (!value || typeof value === "string" || value.size === 0) return null;
  if (value.size > MAX_UPLOAD) throw new Error(`The ${kind} file is larger than 8 MB.`);

  const extension = value.name.includes(".") ? value.name.split(".").pop()!.toLowerCase() : "bin";
  const path = `${ref}/${kind}-${Date.now()}.${extension.replace(/[^a-z0-9]/g, "")}`;
  const { error } = await client.storage
    .from(FILINGS_BUCKET)
    .upload(path, value, { contentType: value.type || undefined, upsert: true });

  if (error) {
    // The most common cause by far, and the message alone does not say it.
    throw new Error(
      `Could not upload the ${kind} file: ${error.message}. Check that the "${FILINGS_BUCKET}" storage bucket exists.`
    );
  }
  return path;
}
