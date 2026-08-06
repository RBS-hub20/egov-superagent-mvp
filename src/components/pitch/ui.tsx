import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the public /pitch page.
 *
 * The page is presented on one fixed surface — navy #0A1931 with a gold accent
 * — rather than following the app's light/dark theme, so these carry explicit
 * colours instead of the `lp-*` pairs used elsewhere. Everything here is a
 * server component: the page ships no JavaScript except the sticky header.
 */

export function Section({
  id,
  children,
  className,
  bleed = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Slightly lifted background, to separate a section from its neighbours. */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      // scroll-mt clears the sticky header when an anchor link lands here.
      className={cn(
        "scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24 lg:py-28",
        bleed && "bg-white/[0.02]",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#FFC300]">
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn("mt-4 text-balance font-bold tracking-tight text-white", className)}
      style={{ fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 1.1 }}
    >
      {children}
    </h2>
  );
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "mt-5 max-w-2xl text-pretty text-[16.5px] leading-relaxed text-[#A8B8D4]",
        className
      )}
    >
      {children}
    </p>
  );
}

/** Glass card: a light wash over navy, never a hard panel. */
export function Card({
  children,
  className,
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.7)] backdrop-blur-[2px] transition-colors",
        accent
          ? "border-[#FFC300]/30 bg-[#FFC300]/[0.05]"
          : "border-white/[0.08] bg-white/[0.035] hover:border-white/[0.16]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "live";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ring-1 ring-inset",
        tone === "neutral" && "bg-white/[0.06] text-[#A8B8D4] ring-white/15",
        tone === "gold" && "bg-[#FFC300]/12 text-[#FFC300] ring-[#FFC300]/30",
        tone === "live" && "bg-emerald-400/12 text-emerald-300 ring-emerald-400/30"
      )}
    >
      {children}
    </span>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[18px] font-semibold tracking-tight text-white">{children}</h3>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mt-2.5 text-[14.5px] leading-relaxed text-[#A8B8D4]", className)}>
      {children}
    </p>
  );
}

/** The one repeated call to action, so every instance matches. */
export function GoldButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-6 py-3.5 text-[15px] font-semibold text-[#0A1931] transition hover:bg-[#FFD23F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1931]",
        className
      )}
    >
      {children}
    </a>
  );
}

export function GhostButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-[15px] font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        className
      )}
    >
      {children}
    </a>
  );
}
