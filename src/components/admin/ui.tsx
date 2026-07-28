"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Tone = "demo" | "filing" | "filed" | "danger" | "neutral" | "paid";

const TONES: Record<Tone, string> = {
  demo: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
  filing: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  filed: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  paid: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  danger: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  neutral: "bg-white/[0.06] text-zinc-300 ring-white/10",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset",
        TONES[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-[#111113] shadow-xl shadow-black/40",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Primary action — the shimmer marks the one button that changes the world. */
export function ActionButton({
  children,
  onClick,
  disabled,
  type = "button",
  tone = "primary",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  tone?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-4 py-2 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
        tone === "primary" &&
          "lp-shimmer bg-[#0F46F3] text-white hover:bg-[#0D3DD6] hover:shadow-[0_0_24px_-8px_rgba(15,70,243,0.9)]",
        tone === "ghost" &&
          "border border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:text-white",
        tone === "danger" &&
          "border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
        className
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-zinc-500 ring-1 ring-inset ring-white/[0.06]"
      >
        {icon}
      </motion.span>
      <p className="mt-4 text-[15px] font-semibold text-zinc-200">{title}</p>
      <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-zinc-500">{body}</p>
    </div>
  );
}

export function TableHead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="border-b border-white/[0.07]">
        {columns.map((c) => (
          <th
            key={c}
            className="whitespace-nowrap px-4 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500"
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/[0.09] bg-[#0A0A0B] px-3.5 py-2.5 text-[14px] text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#0F46F3]/60 focus:ring-2 focus:ring-[#0F46F3]/20"
      />
    </label>
  );
}
