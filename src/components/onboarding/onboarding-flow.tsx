"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReceiptIllustration, UtusanIllustration, VaultIllustration } from "./illustrations";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LICENSEE } from "@/lib/brand";
import { completeOnboarding, isOnboarded } from "@/lib/onboarding";

const SLIDES = [
  {
    key: "utusan",
    title: "Utusan mo lang ako.",
    body: "Hindi mo na kailangan maghanap sa menu. Sabihin mo lang “bayaran mo SSS ko” — ako na bahala sa 6 ahensya.",
    Illustration: UtusanIllustration,
  },
  {
    key: "vault",
    title: "Isang ID lang, habambuhay na.",
    body: "I-upload mo ang Valid ID mo sa Vault. Encrypted with AES-GCM 256. Hindi namin nababasa — ikaw lang may susi. Auto-fill lahat ng forms.",
    Illustration: VaultIllustration,
  },
  {
    key: "receipt",
    title: "Walang fixer, ever.",
    body: "Bawat bayad may EGOV receipt na verifiable online. Official fee lang — P365 lang sa PSA, hindi P1,000. Kung wala sa resibo, walang bayad.",
    Illustration: ReceiptIllustration,
  },
];

/** Only same-origin paths are honoured, so ?next= can't bounce anyone offsite. */
function safeNext(raw: string | null): string {
  if (!raw) return "/app";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/app";
  return raw;
}

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams?.get("next") ?? null);

  const [index, setIndex] = useState(0);
  // -1 / 1 so the outgoing slide leaves the way you came from.
  const [direction, setDirection] = useState(1);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  // Someone who has already been through this can jump straight in.
  useEffect(() => {
    if (isOnboarded()) router.replace(next);
  }, [router, next]);

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace(next);
  }, [router, next]);

  const go = useCallback((delta: number) => {
    setDirection(delta);
    setIndex((current) => Math.min(SLIDES.length - 1, Math.max(0, current + delta)));
  }, []);

  const advance = useCallback(() => {
    if (isLast) finish();
    else go(1);
  }, [isLast, finish, go]);

  // Arrow keys page through, same as swiping.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") advance();
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, go]);

  return (
    <div className="lp-canvas flex min-h-[100dvh] flex-col">
      <header className="flex items-center justify-between px-5 pt-5 sm:px-6">
        <Link href="/" aria-label="eGov SuperAgent home">
          <BrandLockup size={30} priority />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={finish}
            className="rounded-lg px-3 py-2 text-[13.5px] font-semibold text-lp-body transition hover:bg-white hover:text-lp-ink dark:text-lp-dark-muted dark:hover:bg-white/[0.06] dark:hover:text-lp-dark-text"
          >
            Skip
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-6">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.key}
              custom={direction}
              initial={{ opacity: 0, x: direction * 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -48 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                // A decisive flick or a long drag counts as a page turn.
                if (info.offset.x < -70 || info.velocity.x < -450) advance();
                else if (info.offset.x > 70 || info.velocity.x > 450) go(-1);
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <slide.Illustration />

              <h1 className="mt-8 text-center text-[28px] font-bold leading-tight tracking-tight text-lp-ink dark:text-lp-dark-text">
                {slide.title}
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-center text-[16px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-lp-primary"
                    : "w-2 bg-lp-line hover:bg-lp-body/30 dark:bg-lp-dark-line"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="px-6 pb-8 sm:pb-10">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={advance}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-lp-primary text-[16px] font-semibold text-white shadow-[0_0_24px_-8px_rgba(15,70,243,0.8)] transition hover:scale-[1.01] hover:shadow-[0_0_32px_-8px_rgba(15,70,243,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-primary focus-visible:ring-offset-2"
          >
            {isLast ? "Launch SuperAgent" : "Next"}
            <ArrowRight className="h-5 w-5" />
          </button>

          <p className="mt-5 text-center text-[14px] text-lp-body dark:text-lp-dark-muted">
            Already have Vault?{" "}
            <button
              type="button"
              onClick={finish}
              className="font-semibold text-lp-primary transition hover:underline"
            >
              Login here.
            </button>
          </p>

          <p className="mt-6 text-center text-[10.5px] uppercase tracking-[0.14em] text-lp-body/45 dark:text-lp-dark-muted/60">
            Built by {LICENSEE.short}
          </p>
        </div>
      </footer>
    </div>
  );
}
