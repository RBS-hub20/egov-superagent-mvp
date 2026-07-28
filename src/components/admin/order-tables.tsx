"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ExternalLink, FileText, Loader2, PackageCheck, Receipt, Upload, X } from "lucide-react";
import { ActionButton, Badge, EmptyState, Field, Panel, TableHead } from "./ui";
import {
  listOrders,
  ordersByKind,
  peso,
  timeAgo,
  updateOrder,
  type BayadFulfillment,
  type Order,
  type PsaFulfillment,
} from "@/lib/orders";

const PORTALS: Record<string, string> = {
  SSS: "https://member.sss.gov.ph",
  PhilHealth: "https://memberinquiry.philhealth.gov.ph",
  "Pag-IBIG": "https://www.pagibigfundservices.com/virtualpagibig",
  PSA: "https://www.psahelpline.ph",
};

function fulfillmentTone(value: string) {
  if (value === "Delivered" || value === "Paid to Gov") return "filed" as const;
  if (value === "In Transit" || value === "Ordered") return "filing" as const;
  return "demo" as const;
}

/* --------------------------------------------------------- fulfil modal -- */

function FulfillModal({
  order,
  onClose,
  onDone,
}: {
  order: Order | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [reference, setReference] = useState("");
  const [proof, setProof] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  if (!order) return null;
  const isPsa = order.kind === "psa";

  async function apply(next: BayadFulfillment | PsaFulfillment) {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    updateOrder(order!.id, {
      fulfillment: next,
      reference: reference.trim() || order!.reference,
      proofName: proof || order!.proofName,
      notes: notes.trim() || order!.notes,
      courier: isPsa ? order!.courier ?? "J&T Express" : undefined,
    });
    setBusy(false);
    setReference("");
    setProof("");
    setNotes("");
    onDone();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={busy ? undefined : onClose} aria-hidden />
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/[0.08] bg-[#111113] p-6 shadow-2xl eg-scroll sm:rounded-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <h2 className="text-[18px] font-bold tracking-tight text-white">
            {isPsa ? "Fulfil PSA delivery" : `Pay ${order.service} to the agency`}
          </h2>
          <p className="mt-1.5 font-mono text-[12.5px] text-zinc-500">{order.id}</p>

          <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#0A0A0B] p-4 text-[13px]">
            <p className="text-zinc-300">
              <span className="text-zinc-500">Customer:</span> {order.customer}
            </p>
            <p className="mt-1 text-zinc-300">
              <span className="text-zinc-500">Official fee:</span> {peso(order.officialFee)}
            </p>
            {isPsa ? (
              <p className="mt-1 text-zinc-300">
                <span className="text-zinc-500">Deliver to:</span> {order.address}
              </p>
            ) : (
              <p className="mt-1 text-zinc-500">
                Member number is not stored by this app — read it from the customer&apos;s vault
                document.
              </p>
            )}
          </div>

          {PORTALS[order.service] ? (
            <a
              href={PORTALS[order.service]}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-semibold text-zinc-200 transition hover:border-white/25 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {isPsa ? "Open PSAHelpline" : `Open ${order.service} portal`}
            </a>
          ) : null}

          <div className="mt-4 space-y-3">
            <Field
              label={isPsa ? "Courier tracking number" : "PRN / official receipt number"}
              value={reference}
              onChange={setReference}
              placeholder={isPsa ? "J&T 620..." : "PRN or OR number"}
            />
            <label className="block">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Proof screenshot
              </span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-white/[0.12] px-3 py-2.5">
                <Upload className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setProof(e.target.files?.[0]?.name ?? "")}
                  className="min-w-0 flex-1 text-[12px] text-zinc-400 file:mr-2 file:rounded-md file:border-0 file:bg-white/[0.06] file:px-2 file:py-1 file:text-[11px] file:text-zinc-300"
                />
              </div>
            </label>
            <Field label="Notes" value={notes} onChange={setNotes} placeholder="Optional" />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {isPsa ? (
              <>
                <ActionButton onClick={() => apply("In Transit")} disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
                  Mark in transit
                </ActionButton>
                <ActionButton tone="ghost" onClick={() => apply("Delivered")} disabled={busy}>
                  Mark delivered
                </ActionButton>
              </>
            ) : (
              <ActionButton onClick={() => apply("Paid to Gov")} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Mark as paid to agency
              </ActionButton>
            )}
            <ActionButton tone="ghost" onClick={onClose} disabled={busy}>
              Cancel
            </ActionButton>
          </div>

          <p className="mt-4 border-t border-white/[0.07] pt-3 text-[11px] leading-relaxed text-zinc-500">
            Recorded as your attestation. Payment status shown in this console is demo data — no
            payment processor is connected in this build.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------- tables -- */

export function BayadCenter({ onChanged }: { onChanged: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [active, setActive] = useState<Order | null>(null);

  useEffect(() => {
    setOrders(ordersByKind("bayad"));
  }, []);

  function refresh() {
    setOrders(ordersByKind("bayad"));
    onChanged();
  }

  return (
    <>
      <Panel>
        {orders.length === 0 ? (
          <EmptyState
            icon={<Receipt className="h-6 w-6" />}
            title="No payments waiting"
            body="Bayad orders raised in the app appear here for fulfilment."
          />
        ) : (
          <div className="overflow-x-auto eg-scroll">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <TableHead
                columns={["Receipt", "Service", "Amount", "Customer", "Payment", "Fulfilment", "Action"]}
              />
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[12.5px] font-semibold text-zinc-200">
                      {order.id}
                      <p className="mt-0.5 font-sans text-[11px] font-normal text-zinc-600">
                        {timeAgo(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-zinc-300">{order.service}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] font-semibold text-zinc-200">
                      {peso(order.officialFee + order.serviceFee)}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-zinc-300">{order.customer}</td>
                    <td className="px-4 py-3.5">
                      <Badge tone={order.paymentStatus === "Paid" ? "paid" : "demo"}>
                        {order.paymentStatus} (demo)
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge tone={fulfillmentTone(order.fulfillment)}>{order.fulfillment}</Badge>
                      {order.reference ? (
                        <p className="mt-1 font-mono text-[11px] text-zinc-500">{order.reference}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5">
                      <ActionButton
                        onClick={() => setActive(order)}
                        tone={order.fulfillment === "Needs PRN" ? "primary" : "ghost"}
                      >
                        Fulfil
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {active ? (
        <FulfillModal
          order={active}
          onClose={() => setActive(null)}
          onDone={() => {
            setActive(null);
            refresh();
          }}
        />
      ) : null}
    </>
  );
}

export function PsaDeliveries({ onChanged }: { onChanged: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [active, setActive] = useState<Order | null>(null);

  useEffect(() => {
    setOrders(ordersByKind("psa"));
  }, []);

  return (
    <>
      <Panel>
        {orders.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="No PSA deliveries"
            body="Document requests raised in the app appear here with their courier status."
          />
        ) : (
          <div className="overflow-x-auto eg-scroll">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <TableHead
                columns={["Receipt", "Customer", "Type", "Address", "Status", "Tracking", "Action"]}
              />
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[12.5px] font-semibold text-zinc-200">
                      {order.id}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-zinc-300">{order.customer}</td>
                    <td className="px-4 py-3.5 text-[13px] text-zinc-300">{order.docType}</td>
                    <td className="max-w-[220px] px-4 py-3.5 text-[12.5px] text-zinc-400">
                      {order.address}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge tone={fulfillmentTone(order.fulfillment)}>{order.fulfillment}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px] text-zinc-400">
                      {order.reference ? `${order.courier ?? "J&T"} ${order.reference}` : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <ActionButton
                        onClick={() => setActive(order)}
                        tone={order.fulfillment === "Delivered" ? "ghost" : "primary"}
                      >
                        Update
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {active ? (
        <FulfillModal
          order={active}
          onClose={() => setActive(null)}
          onDone={() => {
            setActive(null);
            setOrders(ordersByKind("psa"));
            onChanged();
          }}
        />
      ) : null}
    </>
  );
}

export function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    setOrders(listOrders().sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, []);

  return (
    <Panel>
      <div className="overflow-x-auto eg-scroll">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <TableHead columns={["Receipt", "Kind", "Service", "Customer", "Amount", "Status", "Age"]} />
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02]"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[12.5px] font-semibold text-zinc-200">
                  {order.id}
                </td>
                <td className="px-4 py-3.5 text-[12.5px] uppercase tracking-wide text-zinc-500">
                  {order.kind}
                </td>
                <td className="px-4 py-3.5 text-[13px] text-zinc-300">{order.service}</td>
                <td className="px-4 py-3.5 text-[13px] text-zinc-300">{order.customer}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[13px] font-semibold text-zinc-200">
                  {peso(order.officialFee + order.serviceFee)}
                </td>
                <td className="px-4 py-3.5">
                  <Badge tone={fulfillmentTone(order.fulfillment)}>{order.fulfillment}</Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[12px] text-zinc-500">
                  {timeAgo(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
