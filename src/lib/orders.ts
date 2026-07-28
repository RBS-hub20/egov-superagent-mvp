"use client";

/**
 * Bayad Center and PSA orders.
 *
 * Device-local, like everything else in this MVP: the console reads the same
 * browser storage the app writes to. A shared backend (Supabase) is the next
 * step — until then an operator only sees orders raised in their own browser.
 */
import { peso } from "./data";

export type OrderKind = "bayad" | "psa";

export type BayadFulfillment = "Needs PRN" | "Paid to Gov" | "Delivered";
export type PsaFulfillment = "Ordered" | "In Transit" | "Delivered";
export type Fulfillment = BayadFulfillment | PsaFulfillment;

export interface Order {
  id: string;
  kind: OrderKind;
  /** SSS, PhilHealth, Pag-IBIG, PSA … */
  service: string;
  customer: string;
  /** What the agency actually charges. */
  officialFee: number;
  /** AXLA's cut. Zero until pricing is switched on. */
  serviceFee: number;
  paymentStatus: "Paid" | "Pending";
  fulfillment: Fulfillment;
  createdAt: string;
  /** PRN, OR number or courier tracking, once the operator has one. */
  reference?: string;
  /** Filename of the proof the operator attached. */
  proofName?: string;
  notes?: string;
  /** PSA only. */
  docType?: string;
  address?: string;
  courier?: string;
  /** True for the rows seeded so the console isn't empty on a fresh browser. */
  seeded?: boolean;
}

const ORDERS_KEY = "egov-orders";

function read(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Order[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 100)));
  } catch {
    // Storage blocked — the console still works for this session.
  }
}

const SEED: Order[] = [
  {
    id: "EGOV-2026-8891",
    kind: "psa",
    service: "PSA",
    customer: "Guest User",
    officialFee: 365,
    serviceFee: 0,
    paymentStatus: "Paid",
    fulfillment: "Ordered",
    createdAt: new Date(Date.now() - 42 * 60_000).toISOString(),
    docType: "Birth Certificate (SECPA)",
    address: "3F SM City Cebu, North Reclamation Area, Cebu City",
    seeded: true,
  },
  {
    id: "EGOV-2026-8874",
    kind: "bayad",
    service: "SSS",
    customer: "Guest User",
    officialFee: 1350,
    serviceFee: 0,
    paymentStatus: "Paid",
    fulfillment: "Needs PRN",
    createdAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
    seeded: true,
  },
  {
    id: "EGOV-2026-8862",
    kind: "bayad",
    service: "PhilHealth",
    customer: "Guest User",
    officialFee: 900,
    serviceFee: 0,
    paymentStatus: "Paid",
    fulfillment: "Paid to Gov",
    createdAt: new Date(Date.now() - 26 * 60 * 60_000).toISOString(),
    reference: "PH-OR-2026-44120",
    seeded: true,
  },
];

/** Seeds demo rows once, so a fresh browser has something to operate on. */
export function listOrders(): Order[] {
  const existing = read();
  if (existing.length === 0) {
    write(SEED);
    return SEED;
  }
  return existing;
}

export function updateOrder(id: string, patch: Partial<Order>): Order[] {
  const next = listOrders().map((o) => (o.id === id ? { ...o, ...patch } : o));
  write(next);
  return next;
}

export function ordersByKind(kind: OrderKind): Order[] {
  return listOrders()
    .filter((o) => o.kind === kind)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ---------------------------------------------------------------- totals -- */

export interface Totals {
  todayCount: number;
  todayGross: number;
  officialFees: number;
  ourCut: number;
  pendingBayad: number;
  pendingPsa: number;
}

export function totals(orders: Order[]): Totals {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const today = orders.filter((o) => new Date(o.createdAt) >= startOfDay);

  return {
    todayCount: today.length,
    todayGross: today.reduce((sum, o) => sum + o.officialFee + o.serviceFee, 0),
    officialFees: today.reduce((sum, o) => sum + o.officialFee, 0),
    ourCut: today.reduce((sum, o) => sum + o.serviceFee, 0),
    pendingBayad: orders.filter((o) => o.kind === "bayad" && o.fulfillment === "Needs PRN").length,
    pendingPsa: orders.filter((o) => o.kind === "psa" && o.fulfillment !== "Delivered").length,
  };
}

export { peso };

/** "2m ago", "3h ago", "2d ago". */
export function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
