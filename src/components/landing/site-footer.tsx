import Image from "next/image";
import Link from "next/link";
import { TAGLINE } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-lp-line px-5 py-14 dark:border-lp-dark-line sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-sm">
          <Image src="/logo.png" alt="eGov SuperAgent" width={520} height={257} className="h-11 w-auto" />
          <p className="mt-4 text-[13.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
            {TAGLINE} An MVP demonstration built on mock SSS, PhilHealth, Pag-IBIG and PSA data —
            not affiliated with any Philippine government agency.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-14 gap-y-3 text-[14px]">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lp-body/55 dark:text-lp-dark-muted/70">
              Product
            </p>
            <Link
              href="/app"
              className="block text-lp-body transition-colors hover:text-lp-primary dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
            >
              Open the app
            </Link>
            <a
              href="#services"
              className="block text-lp-body transition-colors hover:text-lp-primary dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
            >
              Services
            </a>
            <a
              href="#trust"
              className="block text-lp-body transition-colors hover:text-lp-primary dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
            >
              Trust &amp; privacy
            </a>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lp-body/55 dark:text-lp-dark-muted/70">
              Built by
            </p>
            <p className="font-semibold text-lp-ink dark:text-lp-dark-text">RBS Labs Inc.</p>
            <p className="text-lp-body dark:text-lp-dark-muted">
              Santo Tomas
              <br />
              Calabarzon, Philippines
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-lp-line pt-6 text-[12.5px] text-lp-body/70 dark:border-lp-dark-line dark:text-lp-dark-muted/70">
        © {new Date().getFullYear()} RBS Labs Inc. Mock data only — walang fixer, walang
        dagdag-bayad.
      </div>
    </footer>
  );
}
