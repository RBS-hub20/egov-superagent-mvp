import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/admin-auth";
import { FILINGS_BUCKET, serviceClient, toOrder, type OrderRow } from "@/lib/etravel-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bumped when this handler changes, so a stale deployment is obvious. */
const ROUTE_VERSION = "2026-08-03-file-tolerant";
const MAX_UPLOAD = 8 * 1024 * 1024;

/**
 * The operator's attestation: they filed on etravel.gov.ph and this is what
 * came back.
 *
 * Only the official reference is required. The QR and the agency PDF are
 * optional, and with no file attached nothing touches storage at all — an
 * operator who has only the reference must still be able to record it.
 *
 * The update is built from the columns the fetched row actually has. A single
 * missing column would otherwise reject the whole statement, so a table that
 * does not match supabase/migrations would make filing impossible rather than
 * merely incomplete. Anything that could not be written comes back in
 * `skippedFields` — dropped silently would be worse than not saved at all.
 */
export async function POST(req: NextRequest) {
  if (!(await isValidAdminCookie(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json(
      { error: "Unauthorized — sign in to the owner console again.", routeVersion: ROUTE_VERSION },
      { status: 401 }
    );
  }

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
    const officialRef = String(form.get("official_ref") ?? "")
      .trim()
      .slice(0, 60);
    const notes = String(form.get("notes") ?? "")
      .trim()
      .slice(0, 500);

    if (!id || !officialRef) {
      return NextResponse.json(
        {
          error: "The order id and the official reference are both required.",
          routeVersion: ROUTE_VERSION,
        },
        { status: 400 }
      );
    }

    const { data: existing, error: findError } = await client
      .from("etravel_orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError) {
      return NextResponse.json(
        {
          error: `Could not read the order: ${findError.message}`,
          code: findError.code,
          hint: findError.hint,
          routeVersion: ROUTE_VERSION,
        },
        { status: 500 }
      );
    }
    if (!existing) {
      return NextResponse.json(
        { error: `No order found with id ${id}.`, routeVersion: ROUTE_VERSION },
        { status: 404 }
      );
    }

    const row = existing as OrderRow;
    // The row itself is the schema: only write columns it already carries.
    const columnList = Object.keys(existing as Record<string, unknown>).sort();
    const columns = new Set(columnList);
    const hasStatus = columns.has("status");

    // Show the move through FILING when the column exists, and notice if it fails.
    if (hasStatus) {
      const { error: filingError } = await client
        .from("etravel_orders")
        .update({ status: "FILING" })
        .eq("id", id);
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

    // Uploads are optional; with no file this loop never reaches storage.
    let qrPath = row.qr_path ?? null;
    let pdfPath = row.pdf_path ?? null;
    try {
      qrPath = (await upload(client, form.get("qr"), row.ref ?? id, "qr")) ?? qrPath;
      pdfPath = (await upload(client, form.get("pdf"), row.ref ?? id, "declaration")) ?? pdfPath;
    } catch (cause) {
      if (hasStatus) {
        // Put the row back rather than leaving it stuck mid-filing.
        await client.from("etravel_orders").update({ status: row.status }).eq("id", id);
      }
      return NextResponse.json(
        {
          error: cause instanceof Error ? cause.message : "Upload failed.",
          routeVersion: ROUTE_VERSION,
        },
        { status: 400 }
      );
    }

    const desired: Record<string, unknown> = {
      status: "FILED",
      official_ref: officialRef,
      notes: notes || null,
      qr_path: qrPath,
      pdf_path: pdfPath,
      filed_at: new Date().toISOString(),
      filed_by: "Owner console",
    };

    const patch: Record<string, unknown> = {};
    const skippedFields: string[] = [];
    for (const [key, value] of Object.entries(desired)) {
      if (columns.has(key)) patch[key] = value;
      else skippedFields.push(key);
    }

    if (!("official_ref" in patch)) {
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

    const { data: updated, error } = await client
      .from("etravel_orders")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (hasStatus) {
        await client.from("etravel_orders").update({ status: row.status }).eq("id", id);
      }
      return NextResponse.json(
        {
          error: `Could not record the filing: ${error.message}`,
          code: error.code,
          hint: error.hint,
          details: error.details,
          attemptedFields: Object.keys(patch),
          columnsOnRow: columnList,
          routeVersion: ROUTE_VERSION,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order: await toOrder(client, updated as OrderRow, "operator"),
      skippedFields,
      routeVersion: ROUTE_VERSION,
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
