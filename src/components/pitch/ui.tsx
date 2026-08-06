import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Pitch deck primitives.
 *
 * The deck is always dark — it is presented, not themed — so these carry
 * explicit colours instead of the `lp-*` light/dark pairs the rest of the app
 * uses. Navy #0A1931 is the brand tile's own background; gold #FFC300 marks the
 * one thing on each slide that should be read first.
 */

export const GOLD = "#FFC300";
export const NAVY = "#0A1931";

export function Slide({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      // Min-height rather than fixed: a slide that outgrows a short laptop
      // screen should scroll, not clip.
      className={cn(
        "relative flex min-h-[100dvh] w-full snap-start flex-col justify-center px-6 py-24 sm:px-10 lg:px-16",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFC300]">{children}</p>
  );
}

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "mt-4 text-balance font-bold leading-[1.05] tracking-tighter text-white",
        className
      )}
      style={{ fontSize: "clamp(32px, 5vw, 58px)" }}
    >
      {children}
    </h2>
  );
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mt-5 max-w-3xl text-pretty text-[17px] leading-relaxed text-[#9DB0CE]", className)}>
      {children}
    </p>
  );
}

export function Card({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "gold" | "danger" | "good";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 backdrop-blur-sm transition",
        tone === "default" && "border-white/[0.09] bg-white/[0.035] hover:border-white/20",
        tone === "gold" && "border-[#FFC300]/35 bg-[#FFC300]/[0.07]",
        tone === "danger" && "border-rose-400/25 bg-rose-500/[0.06]",
        tone === "good" && "border-emerald-400/25 bg-emerald-500/[0.06]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "gold" | "good" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ring-1 ring-inset",
        tone === "default" && "bg-white/[0.06] text-[#C7D4EA] ring-white/15",
        tone === "gold" && "bg-[#FFC300]/15 text-[#FFC300] ring-[#FFC300]/35",
        tone === "good" && "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
        tone === "danger" && "bg-rose-500/15 text-rose-300 ring-rose-400/30"
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  value,
  label,
  tone = "default",
}: {
  value: string;
  label: string;
  tone?: "default" | "gold";
}) {
  return (
    <div>
      <p
        className={cn(
          "font-bold leading-none tracking-tighter",
          tone === "gold" ? "text-[#FFC300]" : "text-white"
        )}
        style={{ fontSize: "clamp(30px, 3.6vw, 46px)" }}
      >
        {value}
      </p>
      <p className="mt-2 text-[13px] leading-snug text-[#9DB0CE]">{label}</p>
    </div>
  );
}

/** Numbered step marker used by the how-it-works and go-to-market slides. */
export function StepNumber({ n, tone = "blue" }: { n: number; tone?: "blue" | "gold" }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold",
        tone === "blue" ? "bg-[#0F46F3]/20 text-[#7EA6FF]" : "bg-[#FFC300]/15 text-[#FFC300]"
      )}
    >
      {n}
    </span>
  );
}
