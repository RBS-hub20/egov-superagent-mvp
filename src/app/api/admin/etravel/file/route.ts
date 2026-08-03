import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/admin-auth";
import { FILINGS_BUCKET, serviceClient, toOrder, type OrderRow } from "@/lib/etravel-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD = 8 * 1024 * 1024;

/**
 * The operator's attestation: they filed on etravel.gov.ph and this is what
 * came back.
 *
 * The row goes through FILING before FILED so the traveller's console shows the
 * move rather than a value that changed while nobody was looking.
 */
export async function POST(req: NextRequest) {
  if (!(await isValidAdminCookie(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const client = serviceClient();
  if (!client) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

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
      { error: "The order id and the official reference are both required." },
      { status: 400 }
    );
  }

  const { data: existing, error: findError } = await client
    .from("etravel_orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const row = existing as OrderRow;
  await client.from("etravel_orders").update({ status: "FILING" }).eq("id", id);

  let qrPath = row.qr_path;
  let pdfPath = row.pdf_path;
  try {
    qrPath = (await upload(client, form.get("qr"), row.ref, "qr")) ?? qrPath;
    pdfPath = (await upload(client, form.get("pdf"), row.ref, "declaration")) ?? pdfPath;
  } catch (error) {
    // Put the row back rather than leaving it stuck mid-filing.
    await client.from("etravel_orders").update({ status: row.status }).eq("id", id);
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data: updated, error } = await client
    .from("etravel_orders")
    .update({
      status: "FILED",
      official_ref: officialRef,
      notes: notes || null,
      qr_path: qrPath,
      pdf_path: pdfPath,
      filed_at: new Date().toISOString(),
      filed_by: "Owner console",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ order: await toOrder(client, updated as OrderRow, "operator") });
}

async function upload(
  client: NonNullable<ReturnType<typeof serviceClient>>,
  value: FormDataEntryValue | null,
  ref: string,
  kind: string
): Promise<string | null> {
  if (!value || typeof value === "string" || value.size === 0) return null;
  if (value.size > MAX_UPLOAD) {
    throw new Error(`${kind} is larger than 8 MB.`);
  }

  const extension = value.name.includes(".") ? value.name.split(".").pop()! .toLowerCase() : "bin";
  const path = `${ref}/${kind}-${Date.now()}.${extension.replace(/[^a-z0-9]/g, "")}`;
  const { error } = await client.storage
    .from(FILINGS_BUCKET)
    .upload(path, value, { contentType: value.type || undefined, upsert: true });
  if (error) throw new Error(error.message);
  return path;
}
