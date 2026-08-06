"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/brand/app-icon";

const LINKS = [
  { href: "/app", label: "Product" },
  { href: "#how", label: "How it works" },
  { href: "#agencies", label: "Agencies" },
];

/**
 * The page's only client component.
 *
 * It exists for one reason: the header is transparent over the hero and gains a
 * border and a blur once the page has moved, which needs scroll state. Every
 * other section on this page is static and ships no JavaScript.
 */
export function PitchHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/[0.08] bg-[#0A1931]/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-lg transition hover:opacity-85"
          aria-label="eGov SuperAgent home"
        >
          <AppIcon size={30} priority />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            eGov <span className="text-[#7EA6FF]">SuperAgent</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-[#A8B8D4] transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href="/"
          className="shrink-0 rounded-lg bg-[#FFC300] px-4 py-2 text-[13.5px] font-semibold text-[#0A1931] transition hover:bg-[#FFD23F]"
        >
          Launch App
        </Link>
      </nav>
    </header>
  );
}
