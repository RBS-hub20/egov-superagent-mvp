"use client";

import { useEffect, useMemo, useState } from "react";
import { KeyRound, Search, ShieldAlert, UserPlus } from "lucide-react";
import { ActionButton, Badge, EmptyState, Field, Panel } from "./ui";
import { adminListOrders, statusLabel, type ETravelOrder } from "@/lib/etravel-orders";
import { listOrders, timeAgo, type Order } from "@/lib/orders";

interface Entry {
  at: string;
  ref: string;
  event: string;
  tone: "neutral" | "filed" | "demo";
}

/** One timeline across declarations and orders — the anti-fixer audit trail. */
function buildEntries(records: ETravelOrder[], orders: Order[]): Entry[] {
  const entries: Entry[] = [];

  records.forEach((r) => {
    entries.push({
      at: r.created_at,
      ref: r.ref,
      event: `Declaration queued for ${r.destination} • ${r.flight_no ?? "no flight"}`,
      tone: "demo",
    });
    if (r.status === "FILED" && r.filed_at) {
      entries.push({
        at: r.filed_at,
        ref: r.ref,
        // The line an audit asks for: who says they filed it, where, and when.
        event: `Operator attests filed on etravel.gov.ph at ${manilaClock(r.filed_at)} by ${r.filed_by ?? "operator"} — official ${r.official_ref}`,
        tone: "filed",
      });
    } else if (r.status === "FILING") {
      entries.push({ at: r.created_at, ref: r.ref, event: statusLabel(r.status), tone: "neutral" });
    }
  });

  orders.forEach((o) => {
    entries.push({
      at: o.createdAt,
      ref: o.id,
      event: `${o.service} order raised — ${o.fulfillment}`,
      tone: o.fulfillment === "Needs PRN" ? "demo" : "neutral",
    });
    if (o.reference) {
      entries.push({
        at: o.createdAt,
        ref: o.id,
        event: `Reference recorded: ${o.reference}`,
        tone: "filed",
      });
    }
  });

  return entries.sort((a, b) => b.at.localeCompare(a.at));
}

const CLOCK = new Intl.DateTimeFormat("en-PH", {
  timeZone: "Asia/Manila",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function manilaClock(iso: string): string {
  return CLOCK.format(new Date(iso));
}

export function AdminLogs() {
  const [records, setRecords] = useState<ETravelOrder[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void adminListOrders().then((result) => setRecords(result.orders));
    setOrders(listOrders());
  }, []);

  const entries = useMemo(() => {
    const all = buildEntries(records, orders);
    const q = query.trim().toUpperCase();
    return q ? all.filter((e) => e.ref.toUpperCase().includes(q)) : all;
  }, [records, orders, query]);

  return (
    <Panel className="p-5">
      <div className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-[#0A0A0B] px-3.5 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-zinc-600" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by receipt or reference…"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-zinc-100 outline-none placeholder:text-zinc-600"
        />
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={<ShieldAlert className="h-6 w-6" />}
          title="Nothing logged yet"
          body="Every declaration, filing and payment lands here with a timestamp."
        />
      ) : (
        <ol className="mt-4 space-y-3">
          {entries.map((entry, i) => (
            <li key={`${entry.ref}-${entry.at}-${i}`} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F46F3]" />
              <div className="min-w-0 flex-1 border-b border-white/[0.05] pb-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-mono text-[12px] font-semibold text-zinc-300">
                    {entry.ref}
                  </span>
                  <span className="text-[11.5px] text-zinc-600">{timeAgo(entry.at)}</span>
                  {entry.tone === "filed" ? <Badge tone="filed">Official</Badge> : null}
                  {entry.tone === "demo" ? <Badge tone="demo">Needs action</Badge> : null}
                </div>
                <p className="mt-1 text-[13px] leading-snug text-zinc-400">{entry.event}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

const DEMO_MODE_KEY = "egov-demo-mode";

export function AdminSettings() {
  const [demoMode, setDemoMode] = useState(true);
  const [vaEmail, setVaEmail] = useState("");
  const [vas, setVas] = useState<string[]>([]);

  useEffect(() => {
    try {
      setDemoMode(localStorage.getItem(DEMO_MODE_KEY) !== "off");
      setVas(JSON.parse(localStorage.getItem("egov-va-accounts") || "[]"));
    } catch {
      // Defaults are fine.
    }
  }, []);

  function toggleDemo() {
    const next = !demoMode;
    setDemoMode(next);
    try {
      localStorage.setItem(DEMO_MODE_KEY, next ? "on" : "off");
    } catch {
      // Not persisted; still applies this session.
    }
  }

  function addVa() {
    const email = vaEmail.trim().toLowerCase();
    if (!email || vas.includes(email)) return;
    const next = [...vas, email];
    setVas(next);
    setVaEmail("");
    try {
      localStorage.setItem("egov-va-accounts", JSON.stringify(next));
    } catch {
      // Not persisted.
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel className="p-5">
        <h3 className="text-[15px] font-bold text-white">Demo mode</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
          While this is on, every new declaration is marked <strong className="text-zinc-300">demo
          — not filed</strong> until an operator files it. Turning it off does not make filings
          real; it only hides the warning, so leave it on until a backend and a live agency
          integration exist.
        </p>
        <button
          type="button"
          onClick={toggleDemo}
          role="switch"
          aria-checked={demoMode}
          className={`mt-4 inline-flex h-9 w-[68px] items-center rounded-full p-1 transition ${
            demoMode ? "bg-[#0F46F3]" : "bg-white/[0.12]"
          }`}
        >
          <span
            className={`h-7 w-7 rounded-full bg-white transition-transform ${
              demoMode ? "translate-x-[32px]" : "translate-x-0"
            }`}
          />
        </button>
        <p className="mt-2 text-[12px] font-semibold text-zinc-400">
          {demoMode ? "On — warnings shown" : "Off — warnings hidden"}
        </p>
      </Panel>

      <Panel className="p-5">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-white">
          <KeyRound className="h-4 w-4 text-[#0F46F3]" />
          Console password
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
          Set by the <code className="text-zinc-300">ADMIN_PASSWORD</code> environment variable on
          the deployment. It is checked server-side and never reaches the browser, so it cannot be
          changed from this screen — update it in Vercel and redeploy.
        </p>
        <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#0A0A0B] p-3 font-mono text-[12.5px] text-zinc-500">
          ADMIN_PASSWORD = ••••••••••
        </div>
      </Panel>

      <Panel className="p-5">
        <h3 className="text-[15px] font-bold text-white">Payment keys</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
          No payment processor is connected in this build. Payment status in the Bayad Center is
          demo data. When PayMongo is wired up, its keys belong in environment variables — never in
          this repository or this screen.
        </p>
        <div className="mt-4 space-y-2 font-mono text-[12.5px] text-zinc-600">
          <p>PAYMONGO_SECRET_KEY = not configured</p>
          <p>PAYMONGO_PUBLIC_KEY = not configured</p>
        </div>
      </Panel>

      <Panel className="p-5">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-white">
          <UserPlus className="h-4 w-4 text-[#0F46F3]" />
          VA accounts
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
          A note-to-self list for now — everyone still signs in with the single console password.
          Per-person accounts need the backend.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Field label="VA email" value={vaEmail} onChange={setVaEmail} placeholder="va@axla.ph" />
          </div>
          <ActionButton onClick={addVa}>Add</ActionButton>
        </div>
        {vas.length > 0 ? (
          <ul className="mt-4 space-y-1.5">
            {vas.map((email) => (
              <li
                key={email}
                className="rounded-lg border border-white/[0.07] bg-[#0A0A0B] px-3 py-2 text-[13px] text-zinc-300"
              >
                {email}
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>
    </div>
  );
}
