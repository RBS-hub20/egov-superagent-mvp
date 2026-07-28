import type { Metadata } from "next";
import { BackgroundFx } from "@/components/landing/background-fx";
import { Hero } from "@/components/landing/hero";
import { ServicesBento } from "@/components/landing/services-bento";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import { TrustReceipt } from "@/components/landing/trust-receipt";
import { WhySuperAgent } from "@/components/landing/why-superagent";

export const metadata: Metadata = {
  title: "What is eGov SuperAgent?",
  alternates: { canonical: "/product" },
};

export default function ProductPage() {
  return (
    <div className="lp-canvas relative min-h-[100dvh] overflow-x-clip">
      <BackgroundFx />
      <div className="relative">
        <SiteNav />
        <main>
          <Hero />
          <WhySuperAgent />
          <ServicesBento />
          <TrustReceipt />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
