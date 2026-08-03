/**
 * Server side of the eTravel store. Never import this from a client component —
 * it holds the service role key, which bypasses row level security.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { generateOrderRef, maskPassport, type ETravelOrder, type OrderStatus } from "./etravel-orders";

export const FILINGS_BUCKET = "etravel-filings";
const SIGNED_URL_TTL = 60 * 60; // an hour: long enough to screenshot, short enough to expire

/** The row as it exists in Postgres, before redaction. */
export interface OrderRow {
  id: string;
  ref: string;
  access_key: string;
  user_id: string | null;
  traveler_name: string;
  passport_no: string | null;
  flight_no: string | null;
  departure_date: string | null;
  departure_airport: string;
  destination: string;
  contact: string | null;
  status: OrderStatus;
  official_ref: string | null;
  qr_path: string | null;
  pdf_path: string | null;
  notes: string | null;
  filed_at: string | null;
  filed_by: string | null;
  created_at: string;
}

let cached: SupabaseClient | null | undefined;

/**
 * Service-role client, or null when the deployment has no project.
 *
 * `SUPABASE_URL` is preferred but the public one is accepted, since a Vercel
 * project that already set `NEXT_PUBLIC_SUPABASE_URL` should not have to set it
 * twice. The key has no public counterpart on purpose.
 */
export function serviceClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cached;
}

export function isServiceConfigured(): boolean {
  return serviceClient() !== null;
}

/** A ref is not a secret; the key that comes with it is. */
export function newAccessKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

export async function insertOrder(
  client: SupabaseClient,
  values: Omit<OrderRow, "id" | "ref" | "access_key" | "created_at" | "status" | "official_ref" | "qr_path" | "pdf_path" | "notes" | "filed_at" | "filed_by">
): Promise<{ row: OrderRow; accessKey: string }> {
  const accessKey = newAccessKey();

  // `ref` is unique and short enough to collide; retry rather than hand the
  // traveller an error for a coin flip.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await client
      .from("etravel_orders")
      .insert({ ...values, ref: generateOrderRef(), access_key: accessKey, status: "PENDING" })
      .select()
      .single();

    if (!error && data) return { row: data as OrderRow, accessKey };
    if (error && error.code !== "23505") throw new Error(error.message);
  }
  throw new Error("Could not allocate a reference for this declaration.");
}

async function signed(client: SupabaseClient, path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data } = await client.storage.from(FILINGS_BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
  return data?.signedUrl ?? null;
}

export type Audience = "public" | "holder" | "operator";

/**
 * Shapes a row for the audience asking.
 *
 * - `public` — someone typed the ref: is it filed, and for where. No name, no
 *   passport, no documents.
 * - `holder` — the ref *and* its access key: the traveller's own record, with
 *   the passport masked and signed links to the agency files.
 * - `operator` — the owner console behind the admin cookie: everything, because
 *   the passport number is exactly what they need to type into etravel.gov.ph.
 */
export async function toOrder(
  client: SupabaseClient,
  row: OrderRow,
  audience: Audience
): Promise<ETravelOrder> {
  const base: ETravelOrder = {
    id: row.id,
    ref: row.ref,
    user_id: row.user_id,
    passport_no: null,
    traveler_name: row.traveler_name,
    flight_no: row.flight_no,
    departure_date: row.departure_date,
    departure_airport: row.departure_airport,
    destination: row.destination,
    status: row.status,
    official_ref: row.official_ref,
    qr_url: null,
    pdf_url: null,
    notes: row.notes,
    filed_at: row.filed_at,
    filed_by: row.filed_by,
    created_at: row.created_at,
  };

  if (audience === "public") {
    return {
      ...base,
      // Enough to confirm the record without naming the traveller to a stranger.
      traveler_name: initialsOnly(row.traveler_name),
      notes: null,
    };
  }

  const [qr_url, pdf_url] = await Promise.all([signed(client, row.qr_path), signed(client, row.pdf_path)]);

  return {
    ...base,
    passport_no: audience === "operator" ? row.passport_no : maskPassport(row.passport_no),
    qr_url,
    pdf_url,
  };
}

function initialsOnly(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => `${part[0]?.toUpperCase() ?? ""}.`)
      .join(" ") || "—"
  );
}
