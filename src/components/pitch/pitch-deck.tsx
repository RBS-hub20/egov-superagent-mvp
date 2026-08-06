"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { AppIcon } from "@/components/brand/app-icon";
import { SLIDES, SLIDE_COMPONENTS } from "./slides";

/**
 * The pitch deck at /pitch.
 *
 * A scroll-snapped page rather than a slide library: it presents full-screen on
 * a projector, and it still scrolls like an ordinary page on a phone, so the
 * link can be sent to someone who will read it one thumb at a time.
 *
 * Always dark, never themed — a deck has one look.
 */
export function PitchDeck() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Where we are heading, which during a smooth scroll is not yet where we are.
  const targetRef = useRef(0);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    targetRef.current = clamped;
    document.getElementById(SLIDES[clamped].id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Track the slide in view for the rail and the counter.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = SLIDES.findIndex((s) => s.id === entry.target.id);
          if (index < 0) return;
          setActive(index);
          targetRef.current = index;
        });
      },
      // Half the slide on screen is the point where it has "arrived".
      { root: scrollerRef.current, threshold: 0.5 }
    );
    SLIDES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Presenter keys. Arrow and page keys only — typing is not expected here.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const keys = ["ArrowDown", "ArrowRight", "PageDown", "ArrowUp", "ArrowLeft", "PageUp", "Home", "End"];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      if (e.key === "Home") return goTo(0);
      if (e.key === "End") return goTo(SLIDES.length - 1);
      const forward = ["ArrowDown", "ArrowRight", "PageDown"].includes(e.key);
      goTo(targetRef.current + (forward ? 1 : -1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  const progress = ((active + 1) / SLIDES.length) * 100;

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-[#0A1931] text-white">
      {/* Ambient light, fixed so it does not travel with the scroll. */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(900px 600px at 15% -5%, rgba(15,70,243,0.20), transparent 60%), radial-gradient(700px 500px at 95% 105%, rgba(255,195,0,0.10), transparent 60%)",
        }}
        aria-hidden
      />

      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg transition hover:opacity-80"
          aria-label="eGov SuperAgent home"
        >
          <AppIcon size={30} priority />
          <span className="hidden text-[14.5px] font-bold tracking-tight text-white sm:block">
            eGov <span className="text-[#7EA6FF]">SuperAgent</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-[#5C7099]">
            {String(active + 1).padStart(2, "0")} / {SLIDES.length}
          </span>
          <Link
            href="/app"
            className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-[12.5px] font-semibold text-white transition hover:border-[#FFC300]/50 hover:text-[#FFC300]"
          >
            Open the app
          </Link>
        </div>
      </header>

      {/* Progress bar — the only chrome that moves. */}
      <div className="fixed inset-x-0 top-0 z-40 h-0.5 bg-white/[0.06]" aria-hidden>
        <div
          className="h-full bg-[#FFC300] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Section rail. Hidden on phones, where the scrollbar does this job. */}
      <nav
        aria-label="Deck sections"
        className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex"
      >
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}: ${slide.label}`}
            aria-current={i === active}
            className="group flex items-center gap-2.5"
          >
            <span
              className={`text-[11px] font-medium transition-all ${
                i === active
                  ? "text-[#FFC300] opacity-100"
                  : "text-[#7E93B8] opacity-0 group-hover:opacity-100"
              }`}
            >
              {slide.label}
            </span>
            <span
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-6 bg-[#FFC300]" : "w-1.5 bg-white/25 group-hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </nav>

      <div
        ref={scrollerRef}
        // Mandatory snapping. On a phone a slide reflows taller than the
        // viewport, but a snap area larger than the scrollport stays freely
        // scrollable, so the bottom of a long slide is still reachable —
        // checked on a 390x844 viewport rather than assumed.
        className="relative z-10 h-[100dvh] snap-y snap-mandatory overflow-y-auto scroll-smooth eg-scroll"
      >
        {SLIDE_COMPONENTS.map((SlideComponent, i) => (
          <SlideComponent key={SLIDES[i].id} />
        ))}
      </div>

      {/* Scroll hint, only while the cover is in view. */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center transition-opacity duration-500 ${
          active === 0 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11.5px] font-medium text-[#9DB0CE] backdrop-blur-sm">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce text-[#FFC300]" />
          Scroll or press ↓
        </span>
      </div>
    </div>
  );
}
