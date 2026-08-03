"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Lock, Plane, ShieldCheck, X } from "lucide-react";
import { createOrder, type ETravelOrder } from "@/lib/etravel-orders";
import { readPassportNumber, savePassportNumber } from "@/lib/passport";

const AIRPORTS = [
  "NAIA Terminal 1",
  "NAIA Terminal 2",
  "NAIA Terminal 3",
  "Clark International",
  "Mactan–Cebu International",
  "Davao International",
  "Iloilo International",
  "Kalibo International",
];

export interface ETravelPrefill {
  travelerName?: string;
  destination?: string | null;
  flight?: string | null;
  departureISO?: string | null;
}

/** "2026-08-04T15:00" in Manila, whatever timezone the browser is in. */
function toManilaInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** The form is filled in Manila time because the flight leaves from Manila. */
function fromManilaInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(`${value}:00+08:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-lp-body/70 dark:text-lp-dark-muted/80">
        {label}
        {required ? <span className="text-lp-primary"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-lp-line bg-white px-3.5 py-2.5 text-[14.5px] text-lp-ink outline-none transition placeholder:text-lp-body/40 focus:border-lp-primary/60 focus:ring-2 focus:ring-lp-primary/15 dark:border-lp-dark-line dark:bg-white/[0.04] dark:text-lp-dark-text"
      />
      {hint ? (
        <span className="mt-1 block text-[11.5px] leading-snug text-lp-body/70 dark:text-lp-dark-muted/80">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/**
 * The flight form.
 *
 * Everything here is typed by the traveller — the app reads nothing off an ID —
 * and it goes straight into the filing queue as PENDING. Nothing is filed with
 * the Bureau of Immigration by submitting it, which the footer says outright.
 */
export function ETravelModal({
  open,
  prefill,
  onClose,
  onCreated,
}: {
  open: boolean;
  prefill?: ETravelPrefill;
  onClose: () => void;
  onCreated: (order: ETravelOrder, accessKey: string) => void;
}) {
  const [travelerName, setTravelerName] = useState("");
  const [passport, setPassport] = useState("");
  const [remember, setRemember] = useState(true);
  const [flight, setFlight] = useState("");
  const [departure, setDeparture] = useState("");
  const [airport, setAirport] = useState(AIRPORTS[2]);
  const [destination, setDestination] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setTravelerName((v) => v || prefill?.travelerName || "");
    setDestination((v) => v || prefill?.destination || "");
    setFlight((v) => v || prefill?.flight || "");
    setDeparture((v) => v || toManilaInput(prefill?.departureISO));
    // Prefill from the vault so a repeat traveller does not retype it.
    void readPassportNumber().then((saved) => {
      if (saved) setPassport((v) => v || saved);
    });
  }, [open, prefill]);

  async function submit() {
    if (!travelerName.trim() || !destination.trim()) {
      setError("Kailangan ang buong pangalan at destination.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (remember && passport.trim()) await savePassportNumber(passport);
      const { order, accessKey } = await createOrder({
        traveler_name: travelerName.trim(),
        passport_no: passport.trim(),
        flight_no: flight.trim(),
        departure_date: fromManilaInput(departure),
        departure_airport: airport,
        destination: destination.trim(),
        contact: contact.trim() || undefined,
      });
      onCreated(order, accessKey);
      onClose();
    } catch {
      setError("Hindi ma-save ang declaration. Subukan ulit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="etravel-modal-title"
        >
          <div
            className="absolute inset-0 bg-[#0A1931]/45 backdrop-blur-sm"
            onClick={busy ? undefined : onClose}
            aria-hidden
          />

          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-lp-line bg-white p-6 shadow-2xl eg-scroll dark:border-lp-dark-line dark:bg-lp-dark-card sm:rounded-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-lp-body/60 transition hover:bg-slate-100 hover:text-lp-ink disabled:opacity-50 dark:text-lp-dark-muted dark:hover:bg-white/[0.06]"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-lp-primary/10 text-lp-primary">
              <Plane className="h-5 w-5" />
            </span>
            <h2
              id="etravel-modal-title"
              className="mt-3 text-[20px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text"
            >
              File your eTravel declaration
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
              Punan mo lang ito — isasabay namin sa Bureau of Immigration queue at ang operator na
              ang mag-fa-file sa etravel.gov.ph.
            </p>

            <div className="mt-5 space-y-3.5">
              <Field
                label="Full name (as printed on passport)"
                value={travelerName}
                onChange={setTravelerName}
                placeholder="Juan Dela Cruz"
                required
              />
              <Field
                label="Passport number"
                value={passport}
                onChange={setPassport}
                placeholder="P1234567A"
              />
              <label className="flex items-start gap-2.5 text-[12.5px] leading-snug text-lp-body dark:text-lp-dark-muted">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-lp-line text-lp-primary focus:ring-lp-primary/30"
                />
                <span>
                  <Lock className="mr-1 inline h-3 w-3 text-emerald-500" />
                  Itago sa encrypted Vault ko para hindi na ulit i-type. Nasa device mo lang ang
                  kopya.
                </span>
              </label>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  label="Flight number"
                  value={flight}
                  onChange={setFlight}
                  placeholder="PR510"
                />
                <Field
                  label="Departure (Manila time)"
                  value={departure}
                  onChange={setDeparture}
                  type="datetime-local"
                />
              </div>

              <label className="block">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-lp-body/70 dark:text-lp-dark-muted/80">
                  Departure airport
                </span>
                <select
                  value={airport}
                  onChange={(e) => setAirport(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-lp-line bg-white px-3.5 py-2.5 text-[14.5px] text-lp-ink outline-none transition focus:border-lp-primary/60 focus:ring-2 focus:ring-lp-primary/15 dark:border-lp-dark-line dark:bg-white/[0.04] dark:text-lp-dark-text"
                >
                  {AIRPORTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="Destination"
                value={destination}
                onChange={setDestination}
                placeholder="Singapore"
                required
              />
              <Field
                label="Contact number or email"
                value={contact}
                onChange={setContact}
                placeholder="0917 123 4567"
                hint="Para may mahanapan ka ng operator kung may kulang sa form."
              />
            </div>

            {error ? (
              <p className="mt-4 text-[13px] font-medium text-rose-600 dark:text-rose-400" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-lp-primary py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#0D3DD6] hover:shadow-[0_0_28px_-8px_rgba(15,70,243,0.9)] disabled:cursor-wait disabled:opacity-80"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {busy ? "Isinasama sa queue…" : "Submit to filing queue"}
            </button>

            <p className="mt-4 border-t border-lp-line pt-3 text-[11.5px] leading-relaxed text-lp-body/70 dark:border-lp-dark-line dark:text-lp-dark-muted/80">
              Submitting places this in the operator queue. It is not filed with the Bureau of
              Immigration until a person files it on etravel.gov.ph and records the official
              reference — you will see that here and at your verify link.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
