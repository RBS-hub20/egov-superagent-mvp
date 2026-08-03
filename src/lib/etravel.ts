"use client";

import etravelJson from "@mocks/etravel.json";

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

/**
 * The preparation an eTravel filing needs, as fixture copy.
 *
 * The declaration itself lives in `etravel-orders.ts`; this file only carries
 * the six-agency checklist the console shows and the Manila date formatting
 * every surface shares.
 */
export const ETRAVEL = etravelJson as ETravelFixture;

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
