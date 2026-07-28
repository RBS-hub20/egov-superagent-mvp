"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, IdCard, Lock, LogOut, Plus, User as UserIcon, X } from "lucide-react";
import { ConsoleLogo } from "./console-logo";
import { AGENCIES, memoryFactsFor } from "@/lib/data";
import { clearUser, initialsOf, useUser } from "@/lib/user";
import { LICENSEE } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Sidebar({
  onNewConversation,
  onOpenMemory,
  onOpenVault,
  onConnectId,
  onClose,
}: {
  onNewConversation: () => void;
  onOpenMemory: () => void;
  onOpenVault: () => void;
  onConnectId: () => void;
  /** Present only when the sidebar is rendered as a mobile drawer. */
  onClose?: () => void;
}) {
  const user = useUser();
  const initials = initialsOf(user);
  const factCount = memoryFactsFor(user).length;

  return (
    <div className="eg-surface flex h-full w-full flex-col">
      <div className="flex items-start justify-between px-5 pb-4 pt-5">
        <Link href="/" aria-label="eGov SuperAgent home">
          <ConsoleLogo width={140} />
        </Link>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1 text-lp-body/60 transition hover:bg-slate-100 hover:text-lp-ink dark:text-lp-dark-muted dark:hover:bg-white/10 dark:hover:text-lp-dark-text lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={onNewConversation}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-lp-primary/40 bg-white py-2.5 text-[13.5px] font-semibold text-lp-primary transition hover:bg-lp-primary/[0.06] hover:shadow-[0_0_18px_-6px_rgba(15,70,243,0.5)] dark:border-lp-primary/50 dark:bg-transparent dark:text-lp-glow dark:hover:bg-lp-primary/10"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </button>
      </div>

      <nav className="mt-7 flex-1 overflow-y-auto px-4 eg-scroll">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-lp-body/55 dark:text-lp-dark-muted/70">
          Connected Agencies
        </p>
        <ul className="mt-3 space-y-1.5">
          {AGENCIES.map((agency, i) => (
            <motion.li
              key={agency.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.32, delay: 0.05 * i }}
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-lp-line bg-white/70 px-3 py-2.5 transition hover:border-lp-primary/30 hover:bg-white dark:border-lp-dark-line dark:bg-white/[0.03] dark:hover:border-lp-primary/40 dark:hover:bg-white/[0.06]">
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    agency.connected ? "bg-emerald-500 eg-pulse" : "bg-slate-300 dark:bg-white/25"
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-lp-ink dark:text-lp-dark-text">
                    {agency.name}
                  </p>
                  <p className="truncate text-[10.5px] text-lp-body/70 dark:text-lp-dark-muted/80">
                    {agency.detail}
                  </p>
                </div>
                <span className="shrink-0 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {agency.connected ? "Connected" : "Off"}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-lp-line px-4 py-3 dark:border-lp-dark-line">
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={onOpenMemory}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-lp-body transition hover:bg-slate-100 hover:text-lp-ink dark:text-lp-dark-muted dark:hover:bg-white/[0.06] dark:hover:text-lp-dark-text"
          >
            <BrainCircuit className="h-4 w-4 text-lp-primary" />
            Memory
            <span className="ml-auto text-[10px] text-lp-body/55 dark:text-lp-dark-muted/70">
              {factCount ? `${factCount} facts` : "Empty"}
            </span>
          </button>
          <button
            type="button"
            onClick={onOpenVault}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-lp-body transition hover:bg-slate-100 hover:text-lp-ink dark:text-lp-dark-muted dark:hover:bg-white/[0.06] dark:hover:text-lp-dark-text"
          >
            <Lock className="h-4 w-4 text-lp-primary" />
            Vault
            <span className="ml-auto text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Encrypted
            </span>
          </button>
        </div>

        <p className="mt-4 border-t border-lp-line pt-3 text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-lp-body/50 dark:border-lp-dark-line dark:text-lp-dark-muted/60">
          Built by {LICENSEE.name}
        </p>

        <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-lp-line bg-white/70 px-2.5 py-2.5 dark:border-lp-dark-line dark:bg-white/[0.03]">
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ring-1 ring-inset",
              user.verified
                ? "bg-lp-primary/10 text-lp-primary ring-lp-primary/20"
                : "bg-slate-100 text-lp-body/60 ring-lp-line dark:bg-white/[0.06] dark:text-lp-dark-muted dark:ring-lp-dark-line"
            )}
          >
            {user.verified ? initials : <UserIcon className="h-4 w-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-lp-ink dark:text-lp-dark-text">
              {user.name}
            </p>
            <p className="truncate text-[10.5px] text-lp-body/70 dark:text-lp-dark-muted/80">
              {user.verified ? `${user.status} • ${user.location}` : user.status}
            </p>
          </div>
          {user.verified ? (
            <button
              type="button"
              onClick={clearUser}
              aria-label="Disconnect this profile"
              title="Disconnect"
              className="shrink-0 rounded-md p-1 text-lp-body/45 transition hover:text-lp-red dark:text-lp-dark-muted/70"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        {!user.verified ? (
          <button
            type="button"
            onClick={onConnectId}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-lp-primary py-2.5 text-[13px] font-semibold text-white shadow-[0_0_18px_-6px_rgba(15,70,243,0.7)] transition hover:scale-[1.01]"
          >
            <IdCard className="h-4 w-4" />
            Connect ID
          </button>
        ) : null}
      </div>
    </div>
  );
}
