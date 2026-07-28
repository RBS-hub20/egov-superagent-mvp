"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FilingIllustration } from "./filing-illustration";
import { UtusanIllustration, VaultIllustration } from "@/components/onboarding/illustrations";
import { LICENSEE } from "@/lib/brand";
import { completeOnboarding, isOnboarded } from "@/lib/onboarding";

const SLIDES = [
  {
    key: "chat",
    title: "One Chat. All Government.",
    body: "eGov SuperAgent is your AI concierge for SSS, PhilHealth, Pag-IBIG, PSA, Immigration and DFA — one utos, tapos agad.",
    Illustration: UtusanIllustration,
  },
  {
    key: "filing",
    title: "Skip The Lines. We File For You.",
    body: "No more pila, no more forms. Chat your request and our operator files it officially on the agency site, with a receipt.",
    Illustration: FilingIllustration,
  },
  {
    key: "vault",
    title: "Secured Vault. Encrypted.",
    body: "PhilSys ID, passport, SSS — encrypted in your Vault, unlocked only on your device. Every filing carries an anti-fixer receipt EGOV-XXXX with a verify link.",
    Illustration: VaultIllustration,
  },
];

const AUTOPLAY_MS = 6000;

export function IntroScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ready, setReady] = useState(false);
  // Autoplay stops for good once someone takes control.
  const interacted = useRef(false);

  const slide = SLIDES[index];

  // A returning visitor goes straight to the app.
  useEffect(() => {
    if (isOnboarded()) {
      router.replace("/app");
      return;
    }
    setReady(true);
  }, [router]);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const take = useCallback(
    (next: number, dir: number) => {
      interacted.current = true;
      goTo(next, dir);
    },
    [goTo]
  );

  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      if (!interacted.current) goTo(index + 1, 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [ready, index, goTo]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") take(index + 1, 1);
      if (e.key === "ArrowLeft") take(index - 1, -1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, take]);

  function proceed(href: string) {
    completeOnboarding();
    router.push(href);
  }

  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-white">
        <Image
          src="/logo.png"
          alt="eGov SuperAgent"
          width={520}
          height={257}
          priority
          className="h-11 w-auto animate-pulse"
        />
      </div>
    );
  }

  return (
    // Always white: the intro sits next to government apps on a first-time
    // visitor's phone, so it ignores the dark theme the rest of the app offers.
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <header className="flex justify-center pt-8 sm:pt-10">
        <Image
          src="/logo.png"
          alt="eGov SuperAgent"
          width={520}
          height={257}
          priority
          className="h-11 w-auto sm:h-12"
        />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-6">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.key}
              custom={direction}
              initial={{ opacity: 0, x: direction * 44 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -44 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragStart={() => {
                interacted.current = true;
              }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70 || info.velocity.x < -450) take(index + 1, 1);
                else if (info.offset.x > 70 || info.velocity.x > 450) take(index - 1, -1);
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <slide.Illustration />

              <h1 className="mt-8 text-center text-[30px] font-bold leading-tight tracking-tight text-[#0A1931] sm:text-[34px]">
                {slide.title}
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-center text-[16px] leading-relaxed text-[#475569]">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => take(i, i > index ? 1 : -1)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-[#0F46F3]" : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="px-6 pb-9 sm:pb-11">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={() => proceed("/app/signup")}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-[#0F46F3] text-[16px] font-semibold text-white transition hover:bg-[#0D3DD6] hover:shadow-[0_0_28px_-8px_rgba(15,70,243,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F46F3] focus-visible:ring-offset-2"
          >
            Sign Up Free
          </button>

          <p className="mt-5 text-center text-[14.5px] text-[#475569]">
            Already a Member?{" "}
            <button
              type="button"
              onClick={() => proceed("/app/login")}
              className="font-semibold text-[#0F46F3] hover:underline"
            >
              Login here.
            </button>
          </p>

          <p className="mt-5 text-center text-[13px]">
            <Link href="/product" className="text-slate-400 transition hover:text-slate-600">
              What is eGov SuperAgent?
            </Link>
          </p>

          <p className="mt-5 text-center text-[10.5px] uppercase tracking-[0.14em] text-slate-400">
            Built by {LICENSEE.short}
          </p>
        </div>
      </footer>
    </div>
  );
}
