"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plane, Radio } from "lucide-react";
import { ActionButton, Badge, EmptyState, Panel, TableHead } from "./ui";
import { FileNowModal } from "./file-now-modal";
import { formatShortDate, formatTime } from "@/lib/etravel";
import {
  adminListOrders,
  subscribeOrders,
  type Backend,
  type ETravelOrder,
} from "@/lib/etravel-orders";
import { timeAgo } from "@/lib/orders";

type Filter = "all" | "pending" | "filed";

export function ETravelQueue({ onChanged }: { onChanged: () => void }) {
  const [orders, setOrders] = useState<ETravelOrder[]>([]);
  const [backend, setBackend] = useState<Backend>("local");
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<ETravelOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const result = await adminListOrders();
    setOrders(result.orders);
    setBackend(result.backend);
    setError(result.error ?? null);
    setLoading(false);
  }, []);

  // Realtime on Supabase, storage events plus a poll on the local backend.
  useEffect(() => {
    void refresh();
    return subscribeOrders(() => void refresh());
  }, [refresh]);

  const rows = useMemo(
    () =>
      orders.filter((o) => {
        if (filter === "all") return true;
        return filter === "filed" ? o.status === "FILED" : o.status !== "FILED";
      }),
    [orders, filter]
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["all", "pending", "filed"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold capitalize transition ${
              filter === f
                ? "bg-white/[0.1] text-white ring-1 ring-inset ring-white/15"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {f === "pending" ? "Needs filing" : f}
          </button>
        ))}

        <span
          className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-zinc-500"
          title={
            backend === "supabase"
              ? "Subscribed to the Supabase change feed"
              : "No Supabase project configured — this queue is whatever this browser has stored"
          }
        >
          <Radio
            className={`h-3.5 w-3.5 ${backend === "supabase" ? "text-emerald-400" : "text-amber-400"}`}
          />
          {backend === "supabase" ? "Live" : "Device-local"} • {rows.length} of {orders.length}
        </span>
      </div>

      {/* An empty queue and an unreadable queue must not look the same. */}
      {error ? (
        <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/[0.07] p-4">
          <p className="text-[13.5px] font-semibold text-rose-300">Could not read the queue</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-rose-200/80">{error}</p>
          <a
            href="/api/admin/etravel?diagnose=1"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-[12.5px] font-semibold text-rose-200 underline underline-offset-4 hover:text-white"
          >
            Run connection diagnosis
          </a>
        </div>
      ) : null}

      <Panel>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<Plane className="h-6 w-6" />}
            title="No pending eTravel"
            body={
              backend === "supabase"
                ? "The database returned no rows. If you are expecting one, open /api/admin/etravel?diagnose=1 — a key without service-role access reads zero rows and reports no error."
                : "No Supabase project is configured, so this console only sees declarations filed in this browser."
            }
          />
        ) : (
          <div className="overflow-x-auto eg-scroll">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <TableHead
                columns={["Ref", "Traveler", "Passport", "Flight", "Departure", "Status", "Action", "Age"]}
              />
              <tbody>
                {rows.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[12.5px] font-semibold text-zinc-200">
                      {order.ref}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-zinc-300">{order.traveler_name}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[12.5px] text-zinc-400">
                      {order.passport_no ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-zinc-300">
                      {order.flight_no ?? "—"} → {order.destination}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-zinc-400">
                      {order.departure_date
                        ? `${formatShortDate(order.departure_date)} ${formatTime(order.departure_date)}`
                        : "Not specified"}
                    </td>
                    <td className="px-4 py-3.5">
                      {order.status === "FILED" ? (
                        <Badge tone="filed">Filed</Badge>
                      ) : order.status === "FILING" ? (
                        <Badge tone="filing">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Filing
                        </Badge>
                      ) : (
                        <Badge tone="demo">Pending</Badge>
                      )}
                      {order.official_ref ? (
                        <p className="mt-1 font-mono text-[11px] text-zinc-500">
                          {order.official_ref}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5">
                      <ActionButton
                        onClick={() => setActive(order)}
                        tone={order.status === "FILED" ? "ghost" : "primary"}
                      >
                        {order.status === "FILED" ? "Update" : "File now"}
                      </ActionButton>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[12px] text-zinc-500">
                      {timeAgo(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <FileNowModal
        order={active}
        onClose={() => setActive(null)}
        onFiled={() => {
          setActive(null);
          void refresh();
          onChanged();
        }}
      />
    </>
  );
}
