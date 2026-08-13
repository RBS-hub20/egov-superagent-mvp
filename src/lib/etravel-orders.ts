/**
 * eTravel orders — the one store behind the traveller's console, the owner
 * console and /verify.
 *
 * Two backends behind one API:
 *
 *   * **Supabase** when the deployment has a project and a service role key.
 *     The browser never touches the table (see the migration for why); it calls
 *     this app's route handlers, which do.
 *   * **This browser** otherwise, so the product still demonstrates end to end
 *     with nothing configured. Every surface says which one it is running on —
 *     a device-local order is not pending with anybody.
 *
 * Types live here rather than in the routes because both sides share them.
 */

export type OrderStatus = "PENDING" | "FILING" | "FILED";

export interface ETravelOrder {
  id: string;
  ref: string;
  user_id: string | null;
  traveler_name: string;
  /** Masked to the last three characters everywhere except the owner console. */
  passport_no: string | null;
  flight_no: string | null;
  departure_date: string | null;
  departure_airport: string;
  destination: string;
  status: OrderStatus;
  official_ref: string | null;
  /** Short-lived signed URLs when Supabase is on; object URLs are never public. */
  qr_url: string | null;
  pdf_url: string | null;
  notes: string | null;
  filed_at: string | null;
  filed_by: string | null;
  created_at: string;
}

export interface NewOrderInput {
  traveler_name: string;
  passport_no: string;
  flight_no: string;
  /** ISO instant, built at +08:00 by the form. */
  departure_date: string | null;
  departure_airport: string;
  destination: string;
  contact?: string;
}

/** What the traveller keeps locally so they can reopen their own record. */
export interface OrderClaim {
  ref: string;
  accessKey: string;
}

export type Backend = "supabase" | "local";

const CLAIMS_KEY = "etravel-claims";
const LOCAL_ORDERS_KEY = "etravel-orders";

/* ------------------------------------------------------------ helpers ---- */

export function maskPassport(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.length <= 3) return "•••";
  return `${"•".repeat(Math.max(3, trimmed.length - 3))}${trimmed.slice(-3)}`;
}

/** EGOV-2026-8891 — the number the traveller reads back over the phone. */
export function generateOrderRef(now = new Date()): string {
  const year = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
  }).format(now);
  return `EGOV-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function statusLabel(status: OrderStatus): string {
  if (status === "FILED") return "Filed with the Bureau of Immigration";
  if (status === "FILING") return "Operator is filing it now";
  return "Pending filing by a VA";
}

export function verifyPath(order: Pick<ETravelOrder, "ref">, accessKey?: string): string {
  const base = `/verify/${encodeURIComponent(order.ref)}`;
  return accessKey ? `${base}?k=${encodeURIComponent(accessKey)}` : base;
}

/* ------------------------------------------------- traveller's claims ---- */

export function readClaims(): OrderClaim[] {
  try {
    const raw = localStorage.getItem(CLAIMS_KEY);
    const parsed = raw ? (JSON.parse(raw) as OrderClaim[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveClaim(claim: OrderClaim): void {
  try {
    const next = [claim, ...readClaims().filter((c) => c.ref !== claim.ref)].slice(0, 25);
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked. The order still shows for this session.
  }
}

export function claimFor(ref: string): OrderClaim | null {
  const target = ref.trim().toUpperCase();
  return readClaims().find((c) => c.ref.toUpperCase() === target) ?? null;
}

/* --------------------------------------------------------- local store --- */

function readLocalOrders(): ETravelOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as ETravelOrder[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalOrders(orders: ETravelOrder[]): void {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders.slice(0, 50)));
    // Same-tab listeners; the storage event only fires in other tabs.
    window.dispatchEvent(new CustomEvent(LOCAL_CHANGE_EVENT));
  } catch {
    // Storage blocked — the console still reflects the change this session.
  }
}

const LOCAL_CHANGE_EVENT = "etravel-orders-changed";

/* ------------------------------------------------------------ backend ---- */

let backendMode: Backend | null = null;

/** Resolved once from the server, which is the only side that knows. */
export async function backend(): Promise<Backend> {
  if (backendMode) return backendMode;
  try {
    const res = await fetch("/api/etravel/config", { cache: "no-store" });
    const body = (await res.json()) as { supabase?: boolean };
    backendMode = body.supabase ? "supabase" : "local";
  } catch {
    backendMode = "local";
  }
  return backendMode;
}

/* --------------------------------------------------------------- API ----- */

export async function createOrder(
  input: NewOrderInput
): Promise<{ order: ETravelOrder; accessKey: string }> {
  if ((await backend()) === "supabase") {
    const res = await fetch("/api/etravel/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      // Deliberately not falling back to the local store: a record only this
      // browser can see would look queued while no operator could ever see it.
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? "The filing queue did not accept this declaration.");
    }
    const body = (await res.json()) as { order: ETravelOrder; accessKey: string };
    saveClaim({ ref: body.order.ref, accessKey: body.accessKey });
    return body;
  }

  const now = new Date().toISOString();
  const order: ETravelOrder = {
    id: `local-${Math.random().toString(36).slice(2, 10)}`,
    ref: generateOrderRef(),
    user_id: null,
    traveler_name: input.traveler_name,
    passport_no: input.passport_no || null,
    flight_no: input.flight_no || null,
    departure_date: input.departure_date,
    departure_airport: input.departure_airport,
    destination: input.destination,
    status: "PENDING",
    official_ref: null,
    qr_url: null,
    pdf_url: null,
    notes: null,
    filed_at: null,
    filed_by: null,
    created_at: now,
  };
  writeLocalOrders([order, ...readLocalOrders()]);
  const accessKey = "local";
  saveClaim({ ref: order.ref, accessKey });
  return { order, accessKey };
}

export async function getOrder(ref: string, accessKey?: string): Promise<ETravelOrder | null> {
  if ((await backend()) === "supabase") {
    const url = `/api/etravel/orders/${encodeURIComponent(ref)}${
      accessKey ? `?k=${encodeURIComponent(accessKey)}` : ""
    }`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) return ((await res.json()) as { order: ETravelOrder }).order;
    return null;
  }
  const target = ref.trim().toUpperCase();
  const found = readLocalOrders().find((o) => o.ref.toUpperCase() === target) ?? null;
  if (!found) return null;
  // Same rule as the server: without the key you get status, not a traveller.
  const claimed = accessKey ?? claimFor(ref)?.accessKey;
  return claimed ? found : redact(found);
}

/** The view for someone holding only the reference. */
function redact(order: ETravelOrder): ETravelOrder {
  return {
    ...order,
    traveler_name:
      order.traveler_name
        .trim()
        .split(/\s+/)
        .map((part) => `${part[0]?.toUpperCase() ?? ""}.`)
        .join(" ") || "—",
    passport_no: null,
    notes: null,
    qr_url: null,
    pdf_url: null,
  };
}

/** The traveller's own orders — resolved from the claims kept in this browser. */
export async function listMyOrders(): Promise<ETravelOrder[]> {
  const claims = readClaims();
  if ((await backend()) === "local") {
    const refs = new Set(claims.map((c) => c.ref.toUpperCase()));
    const local = readLocalOrders();
    // Claims can outlive the orders (cleared storage); intersect rather than assume.
    return local.filter((o) => refs.has(o.ref.toUpperCase()));
  }
  const found = await Promise.all(claims.map((c) => getOrder(c.ref, c.accessKey)));
  return found.filter((o): o is ETravelOrder => o !== null);
}

/* ----------------------------------------------------------- realtime ---- */

/**
 * Calls back whenever any order changes.
 *
 * On Supabase this is a Realtime subscription to the event feed — the payload
 * says only that something moved, which is all the UI needs before refetching
 * through a route that can actually see the row. Polling backs it up in case
 * the socket is blocked, and is the whole mechanism in the local backend.
 */
export function subscribeOrders(onChange: () => void): () => void {
  const cleanups: Array<() => void> = [];

  const poll = setInterval(onChange, 8000);
  cleanups.push(() => clearInterval(poll));

  const onLocal = () => onChange();
  window.addEventListener(LOCAL_CHANGE_EVENT, onLocal);
  window.addEventListener("storage", onLocal);
  cleanups.push(() => {
    window.removeEventListener(LOCAL_CHANGE_EVENT, onLocal);
    window.removeEventListener("storage", onLocal);
  });

  let cancelled = false;
  void (async () => {
    if ((await backend()) !== "supabase" || cancelled) return;
    const { supabase } = await import("./supabase");
    const client = supabase();
    if (!client || cancelled) return;
    const channel = client
      .channel("etravel-order-events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "etravel_order_events" },
        () => onChange()
      )
      .subscribe();
    cleanups.push(() => {
      void client.removeChannel(channel);
    });
  })();

  return () => {
    cancelled = true;
    cleanups.forEach((fn) => fn());
  };
}

/* -------------------------------------------------- owner console API ---- */

export interface AdminQueue {
  orders: ETravelOrder[];
  backend: Backend;
  /** Rows the database reports, which can exceed the 200 returned. */
  count?: number;
  /** Set when the queue could not be read. An empty list is not the same thing. */
  error?: string;
}

export async function adminListOrders(): Promise<AdminQueue> {
  if ((await backend()) === "supabase") {
    let res: Response;
    try {
      res = await fetch("/api/admin/etravel", { cache: "no-store" });
    } catch {
      return { orders: [], backend: "supabase", error: "Could not reach the server." };
    }
    const body = (await res.json().catch(() => ({}))) as Partial<AdminQueue> & { error?: string };
    if (!res.ok) {
      // Reporting this as an empty queue is what made an auth or database
      // failure look identical to "no declarations yet".
      return {
        orders: [],
        backend: "supabase",
        error: body.error ?? `The queue request failed (HTTP ${res.status}).`,
      };
    }
    return { orders: body.orders ?? [], backend: "supabase", count: body.count, error: body.error };
  }
  // No project configured: the queue is whatever this browser filed. Said out
  // loud in the console header, because it is not a real queue.
  return { orders: readLocalOrders(), backend: "local" };
}

export interface FileNowInput {
  id: string;
  ref: string;
  official_ref: string;
  notes?: string;
  qr?: File | null;
  pdf?: File | null;
}

/** Records the operator's attestation. Returns the updated order. */
export async function adminMarkFiled(input: FileNowInput): Promise<ETravelOrder | null> {
  if ((await backend()) === "supabase") {
    const form = new FormData();
    form.set("id", input.id);
    form.set("official_ref", input.official_ref);
    if (input.notes) form.set("notes", input.notes);
    if (input.qr) form.set("qr", input.qr);
    if (input.pdf) form.set("pdf", input.pdf);
    const res = await fetch("/api/admin/etravel/file", { method: "POST", body: form });
    if (res.ok) return ((await res.json()) as { order: ETravelOrder }).order;
    return null;
  }

  const orders = readLocalOrders();
  const idx = orders.findIndex((o) => o.id === input.id || o.ref === input.ref);
  if (idx === -1) return null;
  const updated: ETravelOrder = {
    ...orders[idx],
    status: "FILED",
    official_ref: input.official_ref,
    notes: input.notes ?? null,
    // No bucket to upload to on this backend; the filename is the audit trail.
    qr_url: input.qr ? input.qr.name : orders[idx].qr_url,
    pdf_url: input.pdf ? input.pdf.name : orders[idx].pdf_url,
    filed_at: new Date().toISOString(),
    filed_by: "Owner console",
  };
  orders[idx] = updated;
  writeLocalOrders(orders);
  return updated;
}

/* ------------------------------------------------ traveller notified ----- */

const NOTIFIED_KEY = "etravel-notified";

/** Filed orders this browser has not yet announced in chat. */
export function unannounced(orders: ETravelOrder[]): ETravelOrder[] {
  let seen: string[] = [];
  try {
    seen = JSON.parse(localStorage.getItem(NOTIFIED_KEY) ?? "[]") as string[];
  } catch {
    seen = [];
  }
  return orders.filter((o) => o.status === "FILED" && !seen.includes(o.ref));
}

export function markAnnounced(refs: string[]): void {
  try {
    const seen = JSON.parse(localStorage.getItem(NOTIFIED_KEY) ?? "[]") as string[];
    const merged = seen.concat(refs).filter((ref, i, all) => all.indexOf(ref) === i);
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(merged.slice(-50)));
  } catch {
    // Storage blocked — the traveller may be told twice, which is harmless.
  }
}
