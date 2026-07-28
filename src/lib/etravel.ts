"use client";

import etravelJson from "@mocks/etravel.json";
import type { ETravelIntent } from "./intents";

export interface ETravelDefaults {
  nationality: string;
  direction: string;
  originCountry: string;
  port: string;
  submissionStatus: string;
}

export interface ETravelStep {
  key: string;
  label: string;
  detail: string;
  agency: string;
}

interface ETravelFixture {
  agency: string;
  defaults: ETravelDefaults;
  steps: ETravelStep[];
  elapsedSeconds: number;
  reminder: string;
  nextSteps: string[];
  receiptNote: string;
}

export const ETRAVEL = etravelJson as ETravelFixture;

/** Everything the review card needs, resolved from the message + the profile. */
export interface ETravelDraft {
  travelerName: string;
  nationality: string;
  direction: string;
  destination: string;
  route: string;
  flight: string | null;
  submissionStatus: string;
  departureISO: string | null;
  returnISO: string | null;
  port: string;
}

export type FilingStatus = "demo" | "filing" | "filed";

/**
 * An operator's attestation that the declaration was filed for real.
 *
 * This is a record of what a human says they did on the agency's own site — it
 * is not a lookup against the Bureau of Immigration, and every surface that
 * shows it says so. `govReference` is the number the agency issued.
 */
export interface ETravelFiling {
  status: FilingStatus;
  govReference?: string;
  filedAt?: string;
  filedBy?: string;
  qrFileName?: string;
  pdfFileName?: string;
  notes?: string;
  /** Set once the traveller has been told in chat. */
  notified?: boolean;
}

export interface ETravelRecord extends ETravelDraft {
  reference: string;
  registeredAt: string;
  filing?: ETravelFiling;
}

const HISTORY_KEY = "etravel-history";

export function buildDraft(intent: ETravelIntent, travelerName: string): ETravelDraft {
  const destination = intent.destination ?? "your destination";
  return {
    travelerName,
    nationality: ETRAVEL.defaults.nationality,
    direction: ETRAVEL.defaults.direction,
    destination,
    route: `${ETRAVEL.defaults.originCountry} → ${destination}`,
    flight: intent.flight,
    submissionStatus: ETRAVEL.defaults.submissionStatus,
    departureISO: intent.departureDate ? intent.departureDate.toISOString() : null,
    returnISO: intent.returnDate ? intent.returnDate.toISOString() : null,
    port: ETRAVEL.defaults.port,
  };
}

/** ETR-PH-YYMMDD-#### — the date segment is the departure, not today. */
export function generateETravelReference(departure?: Date | null): string {
  const d = departure ?? new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ETR-PH-${yy}${mm}${dd}-${random}`;
}

export interface ETravelSubmission {
  reference: string;
  qrPayload: string;
  record: ETravelRecord;
}

/**
 * Register a declaration.
 *
 * MVP: everything is produced locally — the reference, the QR payload and the
 * PDF — and stored in this browser. Nothing is sent anywhere.
 *
 * TODO: file against etravel.gov.ph for real. The route we intend is a
 * server-side Playwright session driving the official form, with a human VA
 * dashboard for the cases it cannot complete unattended. Until that exists,
 * this function must keep returning mock data rather than implying a filing.
 */
export async function submitETravel(draft: ETravelDraft): Promise<ETravelSubmission> {
  // Stand-in for the round trip to the agency, so the UI's filing state is real.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const departure = draft.departureISO ? new Date(draft.departureISO) : null;
  const reference = generateETravelReference(departure);
  const record: ETravelRecord = {
    ...draft,
    reference,
    registeredAt: new Date().toISOString(),
  };

  saveToHistory(record);

  return {
    reference,
    qrPayload: [
      reference,
      "ETRAVEL-PH",
      draft.direction.toUpperCase().replace(/\s+/g, "-"),
      draft.flight ?? "NO-FLIGHT",
      departure ? departure.toISOString().slice(0, 10) : "NO-DATE",
    ].join("|"),
    record,
  };
}

export function saveToHistory(record: ETravelRecord): void {
  try {
    const history = readHistory().filter((r) => r.reference !== record.reference);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([record, ...history].slice(0, 25)));
  } catch {
    // Storage blocked — the declaration still shows for this session.
  }
}

export function readHistory(): ETravelRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as ETravelRecord[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function findByReference(reference: string): ETravelRecord | null {
  const target = reference.trim().toUpperCase();
  return readHistory().find((r) => r.reference.toUpperCase() === target) ?? null;
}

/** Records the operator's filing attestation against a declaration. */
export function updateFiling(reference: string, filing: Partial<ETravelFiling>): ETravelRecord[] {
  const history = readHistory().map((record) =>
    record.reference.toUpperCase() === reference.trim().toUpperCase()
      ? { ...record, filing: { status: "demo" as FilingStatus, ...record.filing, ...filing } }
      : record
  );
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Storage blocked — the console still reflects the change this session.
  }
  return history;
}

export function filingStatus(record: ETravelRecord): FilingStatus {
  return record.filing?.status ?? "demo";
}

/** Declarations filed but not yet announced to the traveller in chat. */
export function unnotifiedFilings(): ETravelRecord[] {
  return readHistory().filter((r) => r.filing?.status === "filed" && !r.filing.notified);
}

export function markNotified(reference: string): void {
  updateFiling(reference, { notified: true });
}

/* ------------------------------------------------------------ formatting -- */

const DATE_FMT = new Intl.DateTimeFormat("en-PH", {
  timeZone: "Asia/Manila",
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const TIME_FMT = new Intl.DateTimeFormat("en-PH", {
  timeZone: "Asia/Manila",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatTravelDate(iso: string | null): string {
  if (!iso) return "Not specified yet";
  const d = new Date(iso);
  return `${DATE_FMT.format(d)} ${TIME_FMT.format(d)}`;
}

export function formatShortDate(iso: string | null): string {
  if (!iso) return "not specified";
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return TIME_FMT.format(new Date(iso));
}
