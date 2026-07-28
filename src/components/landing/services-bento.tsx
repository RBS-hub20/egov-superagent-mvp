"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BellRing, BookUser, HeartPulse, Home, PiggyBank, Plane, ScrollText, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { peso, philHealth, psa, sss } from "@/lib/data";

interface Tile {
  icon: LucideIcon;
  agency: string;
  title: string;
  body: string;
  metric?: string;
  metricLabel?: string;
  tint: string;
  /** Prompt handed to the console when the tile is opened. */
  prompt?: string;
  /** Featured tile — gets the contribution strip to fill its double height. */
  featured?: boolean;
  /** Full-width closing banner: icon and copy sit side by side. */
  wide?: boolean;
  className: string;
}

const TILES: Tile[] = [
  {
    icon: PiggyBank,
    agency: "SSS",
    title: "Contributions, always current",
    body: `Six straight months posted by ${sss.member.employer} — SuperAgent checks every payday and files your PRN before the deadline.`,
    metric: peso(sss.member.monthlyContribution),
    metricLabel: "per month • up to date",
    tint: "#0F46F3",
    prompt: "check my sss contributions",
    featured: true,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: HeartPulse,
    agency: "PhilHealth",
    title: "Coverage for the whole household",
    body: `Active membership with ${philHealth.dependents.length} dependents on file, valid until December 2026 — Konsulta included.`,
    metric: `${philHealth.dependents.length} dependents`,
    metricLabel: "active coverage",
    tint: "#20C997",
    prompt: "show my philhealth",
    className: "md:col-span-2",
  },
  {
    icon: ScrollText,
    agency: "PSA",
    title: "Birth certificate, no queue",
    body: `Tracking ${psa.request.trackingNumber} — filed, paid and tracked to the releasing counter.`,
    metric: `${psa.request.etaDays} days`,
    metricLabel: "to pickup • no fixer",
    tint: "#FFC700",
    prompt: "request psa birth certificate",
    className: "md:col-span-2",
  },
  {
    icon: Home,
    agency: "Pag-IBIG",
    title: "MP2 and housing, watched",
    body: "Membership savings tracked since 2015, with dividend releases and loan eligibility flagged as they land.",
    tint: "#E7000B",
    prompt: "pag-ibig status",
    className: "md:col-span-2",
  },
  {
    icon: Plane,
    agency: "Immigration",
    title: "eTravel, sabihin mo lang",
    body: "“Flying to Singapore tomorrow at 3pm on PR510” — SuperAgent drafts the declaration and issues the QR you show at the counter.",
    tint: "#0F46F3",
    prompt: "flying to singapore tomorrow at 3pm on PR510, create etravel for me",
    className: "md:col-span-2",
  },
  {
    icon: BookUser,
    agency: "DFA",
    title: "Passport, bantay ang expiry",
    body: "Checked against the six-month rule before every trip, with the renewal window flagged months ahead.",
    tint: "#20C997",
    className: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    agency: "Vault",
    title: "Your IDs, sealed on-device",
    body: "AES-GCM 256 through Web Crypto. The key never leaves your browser — walang kopya sa server.",
    tint: "#0F46F3",
    className: "md:col-span-2",
  },
  {
    icon: BellRing,
    agency: "Alerts",
    title: "Warned before the penalty",
    body: "Due dates across all six agencies surface days early — “Boss, due ng SSS mo in 3 days. Bayaran ko na?” You answer Yes, and it is handled.",
    tint: "#FFC700",
    wide: true,
    className: "md:col-span-4",
  },
];

/** Twelve months of posted contributions, drawn as a compact strip. */
function ContributionStrip() {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return (
    // `flex-1` lets the strip absorb the featured tile's extra height instead
    // of leaving a hole above the metric.
    <div className="mt-6 hidden flex-1 flex-col justify-end md:flex" aria-hidden>
      <div className="flex h-[150px] items-end gap-1.5">
        {months.map((month, i) => {
          // The last six are the posted months carried in the fixture; earlier
          // ones are last year's, shown faded.
          const recent = i >= months.length - sss.contributions.length;
          return (
            <div key={month} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div
                className={`w-full rounded-md ${recent ? "bg-lp-primary" : "bg-lp-primary/20"}`}
                style={{ height: recent ? "100%" : "58%" }}
              />
              <span className="text-[9px] font-medium text-lp-body/45 dark:text-lp-dark-muted/60">
                {month}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[12px] text-lp-body/70 dark:text-lp-dark-muted/80">
        {sss.totals.postedMonths} months posted · {sss.totals.creditedYearsOfService} credited years
        of service
      </p>
    </div>
  );
}

export function ServicesBento() {
  return (
    <section id="services" className="relative px-5 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-lp-primary">
              Services
            </p>
            <h2 className="mt-3 text-[34px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text sm:text-[42px]">
              Six agencies. One utos.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
            Every tile below is real generative UI — the agent renders it inside the chat the moment
            it understands what you need.
          </p>
        </motion.div>

        <div className="mt-12 grid auto-rows-[minmax(0,1fr)] gap-4 md:grid-cols-4">
          {TILES.map((tile, i) => {
            const icon = (
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${tile.tint}1A`, color: tile.tint }}
              >
                <tile.icon className="h-5 w-5" />
              </span>
            );

            const inner = tile.wide ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                {icon}
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lp-body/60 dark:text-lp-dark-muted/70">
                    {tile.agency}
                  </p>
                  <h3 className="mt-1.5 text-[19px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text">
                    {tile.title}
                  </h3>
                </div>
                <p className="text-[14.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted sm:ml-auto sm:max-w-md">
                  {tile.body}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  {icon}
                  {tile.prompt ? (
                    <ArrowUpRight className="h-4 w-4 text-lp-body/35 transition-colors group-hover:text-lp-primary dark:text-lp-dark-muted/50" />
                  ) : null}
                </div>

                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-lp-body/60 dark:text-lp-dark-muted/70">
                  {tile.agency}
                </p>
                <h3 className="mt-1.5 text-[19px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text">
                  {tile.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
                  {tile.body}
                </p>

                {tile.featured ? <ContributionStrip /> : null}

                {tile.metric ? (
                  <div className="mt-auto border-t border-lp-line pt-4 dark:border-lp-dark-line">
                    <p className="text-[22px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text">
                      {tile.metric}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-lp-body/70 dark:text-lp-dark-muted/80">
                      {tile.metricLabel}
                    </p>
                  </div>
                ) : null}
              </>
            );

            return (
              <motion.div
                key={tile.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.07, 0.35) }}
                className={tile.className}
              >
                {tile.prompt ? (
                  <Link
                    href={{ pathname: "/app", query: { q: tile.prompt } }}
                    className="lp-card lp-lift group flex h-full flex-col rounded-2xl p-7"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="lp-card lp-lift group flex h-full flex-col rounded-2xl p-7">
                    {inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
