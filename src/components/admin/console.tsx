"use client";

import { useCallback, useEffect, useState } from "react";
import { AppIcon } from "@/components/brand/app-icon";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Coins,
  FileText,
  LogOut,
  Plane,
  Receipt,
  ScrollText,
  Settings as SettingsIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ETravelQueue } from "./etravel-queue";
import { AllOrders, BayadCenter, PsaDeliveries } from "./order-tables";
import { AdminLogs, AdminSettings } from "./logs-and-settings";
import { Panel } from "./ui";
import { LICENSEE } from "@/lib/brand";
import { AGENCIES } from "@/lib/data";
import { adminListOrders, subscribeOrders, type Backend } from "@/lib/etravel-orders";
import { listOrders, peso, totals, type Totals } from "@/lib/orders";

type TabKey = "all" | "etravel" | "bayad" | "psa" | "logs" | "settings";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Orders" },
  { key: "etravel", label: "eTravel Queue" },
  { key: "bayad", label: "Bayad Center" },
  { key: "psa", label: "PSA Deliveries" },
  { key: "logs", label: "Logs" },
  { key: "settings", label: "Settings" },
];

interface Stats extends Totals {
  etravelPending: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  alert,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  accent: string;
  alert?: boolean;
}) {
  return (
    <Panel className="relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl"
        style={{ background: accent }}
        aria-hidden
      />
      <div className="relative flex items-start justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${accent}22`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </span>
        {alert ? (
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-rose-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
            Needs action
          </span>
        ) : null}
      </div>
      <p className="relative mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="relative mt-1 text-[26px] font-bold tracking-tight text-white">{value}</p>
      <p className="relative mt-0.5 text-[12.5px] text-zinc-500">{sub}</p>
    </Panel>
  );
}

export function OwnerConsole() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("etravel");
  const [stats, setStats] = useState<Stats | null>(null);
  const [backend, setBackend] = useState<Backend>("local");

  const recompute = useCallback(async () => {
    const orders = listOrders();
    const { orders: declarations, backend: mode } = await adminListOrders();
    const pending = declarations.filter((d) => d.status !== "FILED").length;
    setStats({ ...totals(orders), etravelPending: pending });
    setBackend(mode);
  }, []);

  useEffect(() => {
    void recompute();
    return subscribeOrders(() => void recompute());
  }, [recompute]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0B] text-zinc-200">
      <header className="border-b border-white/[0.07] bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <AppIcon size={28} />
            <div>
              <p className="text-[15px] font-bold tracking-tight text-white">
                eGov SuperAgent — Owner Console
              </p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-600">
                Built by {LICENSEE.short}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[12.5px]">
            <span className="inline-flex items-center gap-1.5 text-zinc-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live • {AGENCIES.length} agencies
            </span>
            <span className="text-zinc-500">
              Today <span className="font-semibold text-zinc-200">{peso(stats?.todayGross ?? 0)}</span>
            </span>
            <span className="text-zinc-500">
              Pending{" "}
              <span className="font-semibold text-zinc-200">
                {(stats?.etravelPending ?? 0) + (stats?.pendingBayad ?? 0)}
              </span>
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 font-semibold text-zinc-400 transition hover:border-white/25 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Receipt}
            label="Today's orders"
            value={peso(stats?.todayGross ?? 0)}
            sub={`${stats?.todayCount ?? 0} orders today`}
            accent="#0F46F3"
          />
          <StatCard
            icon={Plane}
            label="eTravel queue"
            value={`${stats?.etravelPending ?? 0} pending`}
            sub="Waiting to be filed on etravel.gov.ph"
            accent="#F59E0B"
            alert={(stats?.etravelPending ?? 0) > 0}
          />
          <StatCard
            icon={FileText}
            label="PSA queue"
            value={`${stats?.pendingPsa ?? 0} pending`}
            sub="Ordered or in transit"
            accent="#10B981"
          />
          <StatCard
            icon={Coins}
            label="Revenue (AXLA)"
            value={peso(stats?.ourCut ?? 0)}
            sub={`Official fees ${peso(stats?.officialFees ?? 0)} • our cut ${peso(stats?.ourCut ?? 0)}`}
            accent="#8B5CF6"
          />
        </div>

        <nav className="mt-7 flex flex-wrap gap-1 border-b border-white/[0.07] pb-px">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`relative px-3.5 py-2.5 text-[13.5px] font-semibold transition ${
                tab === t.key ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t.label}
              {tab === t.key ? (
                <motion.span
                  layoutId="admin-tab"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#0F46F3]"
                />
              ) : null}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {tab === "all" ? <AllOrders /> : null}
          {tab === "etravel" ? <ETravelQueue onChanged={recompute} /> : null}
          {tab === "bayad" ? <BayadCenter onChanged={recompute} /> : null}
          {tab === "psa" ? <PsaDeliveries onChanged={recompute} /> : null}
          {tab === "logs" ? <AdminLogs /> : null}
          {tab === "settings" ? <AdminSettings /> : null}
        </div>

        <p className="mt-10 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-5 text-[11.5px] leading-relaxed text-zinc-600">
          <ScrollText className="h-3.5 w-3.5 shrink-0" />
          {backend === "supabase"
            ? "eTravel declarations live in Supabase and reach this console the moment a traveller submits one. Bayad Center and PSA rows are still device-local demo data."
            : "No Supabase project is configured, so this console only sees declarations filed in this browser. Set the project variables to make it a shared queue."}
          <span className="ml-auto inline-flex items-center gap-1.5 uppercase tracking-[0.14em]">
            <SettingsIcon className="h-3 w-3" />
            Built by {LICENSEE.short}
          </span>
        </p>
      </main>
    </div>
  );
}
