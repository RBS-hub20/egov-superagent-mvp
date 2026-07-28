"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plane, Upload } from "lucide-react";
import { ActionButton, Badge, EmptyState, Panel, TableHead } from "./ui";
import { FileNowModal } from "./file-now-modal";
import {
  filingStatus,
  formatShortDate,
  formatTime,
  readHistory,
  type ETravelRecord,
} from "@/lib/etravel";
import { timeAgo } from "@/lib/orders";

type Filter = "all" | "demo" | "filed";

export function ETravelQueue({ onChanged }: { onChanged: () => void }) {
  const [records, setRecords] = useState<ETravelRecord[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<ETravelRecord | null>(null);

  function refresh() {
    setRecords(readHistory());
  }

  useEffect(() => {
    refresh();
    // Declarations can arrive from the app in another tab.
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  const rows = useMemo(
    () =>
      records.filter((r) => {
        if (filter === "all") return true;
        const status = filingStatus(r);
        return filter === "filed" ? status === "filed" : status !== "filed";
      }),
    [records, filter]
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["all", "demo", "filed"] as Filter[]).map((f) => (
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
            {f === "demo" ? "Needs filing" : f}
          </button>
        ))}
        <span className="ml-auto text-[12px] text-zinc-500">
          {rows.length} of {records.length}
        </span>
      </div>

      <Panel>
        {rows.length === 0 ? (
          <EmptyState
            icon={<Plane className="h-6 w-6" />}
            title="No pending eTravel"
            body="You're all caught up, boss. New declarations from the app land here automatically."
          />
        ) : (
          <div className="overflow-x-auto eg-scroll">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <TableHead
                columns={["Ref", "Traveler", "Flight", "Departure", "Status", "Action", "Age"]}
              />
              <tbody>
                {rows.map((record) => {
                  const status = filingStatus(record);
                  return (
                    <tr
                      key={record.reference}
                      className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[12.5px] font-semibold text-zinc-200">
                        {record.reference}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-zinc-300">
                        {record.travelerName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-zinc-300">
                        {record.flight ?? "—"} → {record.destination}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-zinc-400">
                        {formatShortDate(record.departureISO)} {formatTime(record.departureISO)}
                      </td>
                      <td className="px-4 py-3.5">
                        {status === "filed" ? (
                          <Badge tone="filed">Filed</Badge>
                        ) : status === "filing" ? (
                          <Badge tone="filing">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Filing
                          </Badge>
                        ) : (
                          <Badge tone="demo">Demo — not filed</Badge>
                        )}
                        {record.filing?.govReference ? (
                          <p className="mt-1 font-mono text-[11px] text-zinc-500">
                            {record.filing.govReference}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <ActionButton
                            onClick={() => setActive(record)}
                            tone={status === "filed" ? "ghost" : "primary"}
                          >
                            {status === "filed" ? "Update" : "File now"}
                          </ActionButton>
                          {status === "filed" && record.filing?.qrFileName ? (
                            <span className="inline-flex items-center gap-1 text-[11.5px] text-zinc-500">
                              <Upload className="h-3 w-3" />
                              {record.filing.qrFileName}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[12px] text-zinc-500">
                        {timeAgo(record.registeredAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <FileNowModal
        record={active}
        onClose={() => setActive(null)}
        onFiled={() => {
          setActive(null);
          refresh();
          onChanged();
        }}
      />
    </>
  );
}
