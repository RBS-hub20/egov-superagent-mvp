/**
 * eTravel intent parsing.
 *
 * Deliberately hand-rolled rather than pulling in a date library: the phrasings
 * that matter here are narrow ("tomorrow at 3pm", "aug 5 6pm", "balik ako…"),
 * and every field the parser is unsure about is returned as null so the UI can
 * ask instead of inventing a flight.
 */

export interface ETravelIntent {
  /** Country or city as written by the traveller, title-cased. */
  destination: string | null;
  /** Airline code + number, e.g. "PR510". */
  flight: string | null;
  departureDate: Date | null;
  returnDate: Date | null;
  /** True when the message mentions coming back ("balik ako", "return"). */
  hasReturn: boolean;
}

const TRIGGER =
  /\b(e-?travel|lipad|flying\s+to|flight|departure|departing|naia|immigration|paalis|byahe)\b|\b(?:PR|5J|Z2|CX|SQ|EK|QR|TG|MH|JL|NH|BR|CI|KE|OZ|VN|GA|TR|3K|AK)\s?-?\s?\d{2,4}\b/i;

const AIRLINES = "PR|5J|Z2|CX|SQ|EK|QR|TG|MH|JL|NH|BR|CI|KE|OZ|VN|GA|TR|3K|AK|UA|AA|DL|KL|LH|BA|QF|NZ|ET|SV|GF|WY|J9";

/** Destinations common on a Philippine departure, matched case-insensitively. */
const DESTINATIONS = [
  "Singapore", "Japan", "Tokyo", "Osaka", "South Korea", "Korea", "Seoul", "Hong Kong", "Macau",
  "Taiwan", "Taipei", "Thailand", "Bangkok", "Vietnam", "Hanoi", "Ho Chi Minh", "Malaysia",
  "Kuala Lumpur", "Indonesia", "Jakarta", "Bali", "Brunei", "Cambodia", "Laos", "Myanmar",
  "China", "Shanghai", "Beijing", "Guangzhou", "India", "Dubai", "UAE", "Abu Dhabi", "Qatar",
  "Doha", "Saudi Arabia", "Riyadh", "Jeddah", "Kuwait", "Bahrain", "Oman", "Israel", "Turkey",
  "USA", "United States", "Canada", "Australia", "Sydney", "New Zealand", "United Kingdom", "UK",
  "London", "Germany", "France", "Paris", "Italy", "Spain", "Netherlands", "Switzerland",
];

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8,
  september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

/** Splits on a return marker so "balik ako aug 5" doesn't hijack the departure. */
const RETURN_MARKER = /\b(balik(?:\s+ako)?|pabalik|uwi(?:\s+ako)?|return(?:ing)?|back)\b/i;

export function detectETravelIntent(message: string): ETravelIntent | null {
  if (!TRIGGER.test(message)) return null;

  const returnMatch = RETURN_MARKER.exec(message);
  const departurePart = returnMatch ? message.slice(0, returnMatch.index) : message;
  const returnPart = returnMatch ? message.slice(returnMatch.index + returnMatch[0].length) : "";

  const now = new Date();
  return {
    destination: parseDestination(departurePart) ?? parseDestination(message),
    flight: parseFlight(message),
    departureDate: parseWhen(departurePart, now),
    returnDate: returnPart ? parseWhen(returnPart, now) : null,
    hasReturn: Boolean(returnMatch),
  };
}

export function parseFlight(text: string): string | null {
  const m = new RegExp(`\\b(${AIRLINES})\\s?-?\\s?(\\d{2,4})\\b`, "i").exec(text);
  return m ? `${m[1].toUpperCase()}${m[2]}` : null;
}

export function parseDestination(text: string): string | null {
  // A known destination anywhere in the phrase wins — it survives typos in the
  // surrounding words ("flying singapore tom").
  for (const place of DESTINATIONS) {
    if (new RegExp(`\\b${place.replace(/\s+/g, "\\s+")}\\b`, "i").test(text)) return place;
  }
  // Otherwise take whatever follows a direction word and title-case it.
  const m = /\b(?:to|papuntang|papunta\s+sa|going\s+to|bound\s+for)\s+([A-Za-z][A-Za-z\s]{2,24}?)(?=\s+(?:tomorrow|today|on|at|via|next|this|sa|bukas|ngayon)\b|[,.]|$)/i.exec(
    text
  );
  if (!m) return null;
  return m[1]
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Hours/minutes from "3pm", "3:30 pm", "15:00". Defaults to null, never to noon. */
function parseTime(text: string): { hours: number; minutes: number } | null {
  const ampm = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i.exec(text);
  if (ampm) {
    let hours = parseInt(ampm[1], 10) % 12;
    if (/pm/i.test(ampm[3])) hours += 12;
    return { hours, minutes: ampm[2] ? parseInt(ampm[2], 10) : 0 };
  }
  const h24 = /\b([01]?\d|2[0-3]):([0-5]\d)\b/.exec(text);
  if (h24) return { hours: parseInt(h24[1], 10), minutes: parseInt(h24[2], 10) };
  return null;
}

/**
 * Philippine wall-clock time.
 *
 * "3pm" means 3pm in Manila no matter where the browser is, so dates are built
 * from an explicit +08:00 offset rather than the device's local timezone —
 * otherwise a UTC host turns a 15:00 flight into 23:00.
 */
const PH_OFFSET = "+08:00";
const PH_TZ = "Asia/Manila";

const pad = (n: number) => String(n).padStart(2, "0");

interface Ymd {
  year: number;
  month: number; // 1-12
  day: number;
}

/** Today's date as it reads on a calendar in Manila. */
function manilaToday(base: Date): Ymd {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", {
    timeZone: PH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(base)
    .split("-")
    .map(Number);
  return { year, month, day };
}

/** Adds days with month/year rollover handled by Date.UTC's normalisation. */
function addDays({ year, month, day }: Ymd, delta: number): Ymd {
  const d = new Date(Date.UTC(year, month - 1, day + delta));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

function atManila(ymd: Ymd, time: { hours: number; minutes: number } | null): Date {
  const { hours, minutes } = time ?? { hours: 0, minutes: 0 };
  return new Date(
    `${ymd.year}-${pad(ymd.month)}-${pad(ymd.day)}T${pad(hours)}:${pad(minutes)}:00${PH_OFFSET}`
  );
}

/**
 * Resolves the day mentioned in `text` relative to `base`.
 *
 * A bare month/day that has already passed this year rolls to next year, so
 * "aug 5" in December means next August rather than a trip in the past.
 */
export function parseWhen(text: string, base: Date): Date | null {
  const time = parseTime(text);
  const today = manilaToday(base);

  if (/\b(bukas|tomorrow)\b/i.test(text)) return atManila(addDays(today, 1), time);
  if (/\b(ngayon|today|mamaya|later)\b/i.test(text)) return atManila(today, time);

  // "aug 5", "august 5 2026", "5 aug"
  const monthFirst = /\b([a-z]{3,9})\.?\s+(\d{1,2})(?:\s*,?\s*(\d{4}))?\b/i.exec(text);
  const dayFirst = /\b(\d{1,2})\s+([a-z]{3,9})\.?(?:\s*,?\s*(\d{4}))?\b/i.exec(text);

  for (const [m, monthIdx, dayIdx, yearIdx] of [
    [monthFirst, 1, 2, 3],
    [dayFirst, 2, 1, 3],
  ] as const) {
    if (!m) continue;
    const month = MONTHS[m[monthIdx].toLowerCase()];
    if (month === undefined) continue;
    const day = parseInt(m[dayIdx], 10);
    if (day < 1 || day > 31) continue;

    const explicitYear = m[yearIdx] ? parseInt(m[yearIdx], 10) : null;
    let candidate: Ymd = { year: explicitYear ?? today.year, month: month + 1, day };
    // A bare month/day that has already gone by means next year's trip.
    if (!explicitYear && atManila(candidate, time).getTime() < base.getTime() - 86_400_000) {
      candidate = { ...candidate, year: candidate.year + 1 };
    }
    return atManila(candidate, time);
  }

  // A time on its own means today, or tomorrow if it has already passed.
  if (time) {
    const sameDay = atManila(today, time);
    return sameDay.getTime() < base.getTime() ? atManila(addDays(today, 1), time) : sameDay;
  }
  return null;
}
