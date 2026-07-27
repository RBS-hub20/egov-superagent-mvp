"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const LINKS = [
  { href: "#why", label: "Why SuperAgent" },
  { href: "#services", label: "Services" },
  { href: "#trust", label: "Trust" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-lp-line bg-white/75 backdrop-blur-xl dark:border-lp-dark-line dark:bg-lp-dark-bg/75"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="eGov SuperAgent — home">
          <Image
            src="/logo-icon.png"
            alt=""
            width={96}
            height={58}
            priority
            className="h-7 w-auto"
          />
          <span className="hidden text-[15px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text sm:block">
            eGov <span className="text-lp-primary">SuperAgent</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-lp-body transition-colors hover:text-lp-ink dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/app"
            className="inline-flex h-10 items-center rounded-full bg-lp-primary px-5 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(15,70,243,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(15,70,243,0.55)]"
          >
            Launch SuperAgent
          </Link>
        </div>
      </nav>
    </header>
  );
}
